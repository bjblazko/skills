// jsfuncmetrics prints one line per JS function under a directory (or one file),
// tab-separated: length in lines, cyclomatic complexity, file:line, name.
// No dependencies: a small tokenizer that knows strings, template literals
// (with nested ${}), comments and regex literals, so braces inside them do not
// count. Decision points (if for while case catch && || ?? ?:) count toward the
// innermost function. Skips vendor/, node_modules/ and *.min.js. Good for plain
// ES modules and classes; not a full parser.
//
//   node ~/.claude/skills/huepattl-code-quality/scripts/jsfuncmetrics/jsfuncmetrics.mjs src/web/js | sort -rn | head
import fs from 'node:fs';
import path from 'node:path';

const KEYWORDS_BEFORE_REGEX = new Set(['return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'yield', 'await', 'instanceof']);
const CONTROL = new Set(['if', 'for', 'while', 'switch', 'catch', 'with', 'return', 'typeof', 'await', 'new', 'function', 'else']);
const DECISION_WORDS = new Set(['if', 'for', 'while', 'case', 'catch']);

function scan(src, file, out) {
  const n = src.length;
  let i = 0, line = 1;
  const tokens = []; // {t: text, k: kind, line, pos}
  const templateStack = []; // brace depth at which a ${ opened
  let braceDepth = 0;
  const push = (t, k) => tokens.push({ t, k, line, pos: i });
  const prevSignificant = () => tokens.length ? tokens[tokens.length - 1] : null;
  const regexAllowed = () => {
    const p = prevSignificant();
    if (!p) return true;
    if (p.k === 'id') return KEYWORDS_BEFORE_REGEX.has(p.t);
    if (p.k === 'num' || p.k === 'str') return false;
    return !(p.t === ')' || p.t === ']' || p.t === '}');
  };
  const readTemplate = () => { // at a backtick or after a closing } of ${ }
    while (i < n) {
      const c = src[i];
      if (c === '\\') { i += 2; continue; }
      if (c === '\n') line++;
      if (c === '`') { i++; push('`', 'str'); return; }
      if (c === '$' && src[i + 1] === '{') { i += 2; templateStack.push(braceDepth); braceDepth++; push('${', 'punct'); return; }
      i++;
    }
  };
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++; } i += 2; continue; }
    if (c === '"' || c === "'") { const q = c; i++; while (i < n && src[i] !== q) { if (src[i] === '\\') i++; else if (src[i] === '\n') line++; i++; } i++; push(q, 'str'); continue; }
    if (c === '`') { i++; readTemplate(); continue; }
    if (c === '/' && regexAllowed()) {
      i++; let inClass = false;
      while (i < n) { const d = src[i]; if (d === '\\') { i += 2; continue; } if (d === '[') inClass = true; else if (d === ']') inClass = false; else if (d === '/' && !inClass) break; else if (d === '\n') break; i++; }
      i++; while (i < n && /[a-z]/i.test(src[i])) i++;
      push('/re/', 'str'); continue;
    }
    if (/[A-Za-z_$#]/.test(c)) { const s = i; while (i < n && /[\w$#]/.test(src[i])) i++; push(src.slice(s, i), 'id'); continue; }
    if (/[0-9]/.test(c)) { while (i < n && /[\w.]/.test(src[i])) i++; push('0', 'num'); continue; }
    const three = src.slice(i, i + 3), two = src.slice(i, i + 2);
    if (['===', '!==', '...', '**=', '??=', '&&=', '||=', '>>>'].includes(three)) { i += 3; push(three, 'punct'); continue; }
    if (['=>', '&&', '||', '??', '?.', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '++', '--'].includes(two)) { i += 2; push(two, 'punct'); continue; }
    if (c === '{') { braceDepth++; i++; push('{', 'punct'); continue; }
    if (c === '}') {
      if (templateStack.length && templateStack[templateStack.length - 1] === braceDepth - 1) { templateStack.pop(); braceDepth--; i++; push('}', 'tmpl-end'); readTemplate(); continue; }
      braceDepth--; i++; push('}', 'punct'); continue;
    }
    i++; push(c, 'punct');
  }

  // Match brackets, find function bodies.
  const parenOpen = []; const matchOf = new Map();
  tokens.forEach((tk, idx) => { if (tk.t === '(') parenOpen.push(idx); else if (tk.t === ')') matchOf.set(idx, parenOpen.pop()); });
  const stack = []; // {isFn, name, line, cyclo}
  const nameBefore = (idx) => { // name for an arrow function starting at idx
    const p = tokens[idx - 1], q = tokens[idx - 2];
    if (p && (p.t === '=' || p.t === ':') && q && q.k === 'id') return q.t;
    if (p && p.t === '(' && q && q.k === 'id') return q.t + '(callback)';
    return '(arrow)';
  };
  tokens.forEach((tk, idx) => {
    if (tk.t === '{' && tk.k === 'punct') {
      const p = tokens[idx - 1];
      let fn = null;
      if (p && p.t === '=>') {
        let s = idx - 2; // params: identifier or (...)
        if (tokens[s] && tokens[s].t === ')') s = matchOf.get(s);
        if (tokens[s - 1] && tokens[s - 1].t === 'async') s--;
        fn = { name: nameBefore(s), line: tokens[s].line };
      } else if (p && p.t === ')') {
        const o = matchOf.get(idx - 1);
        const before = tokens[o - 1];
        if (before && before.k === 'id' && !CONTROL.has(before.t)) {
          fn = { name: before.t, line: before.line };
        } else if (before && before.t === 'function') {
          fn = { name: nameBefore(o - 1), line: before.line };
        }
        if (before && before.k === 'id' && tokens[o - 2] && tokens[o - 2].t === 'function') fn = { name: before.t, line: tokens[o - 2].line };
      }
      stack.push(fn ? { ...fn, isFn: true, cyclo: 1 } : { isFn: false });
      return;
    }
    if (tk.t === '}' && tk.k === 'punct') {
      const top = stack.pop();
      if (top && top.isFn) out.push([tk.line - top.line + 1, top.cyclo, `${file}:${top.line}`, top.name].join('\t'));
      return;
    }
    const isDecision = (tk.k === 'id' && DECISION_WORDS.has(tk.t)) || tk.t === '&&' || tk.t === '||' || tk.t === '??' || tk.t === '?';
    if (isDecision) {
      for (let s = stack.length - 1; s >= 0; s--) if (stack[s].isFn) { stack[s].cyclo++; break; }
    }
  });
}

const target = process.argv[2];
const files = fs.statSync(target).isDirectory()
  ? fs.readdirSync(target, { recursive: true }).filter(f => f.endsWith('.js') && !f.endsWith('.min.js') && !/(^|\/)(vendor|node_modules)\//.test(f)).map(f => path.join(target, f))
  : [target];
const out = [];
for (const f of files) scan(fs.readFileSync(f, 'utf8'), path.relative(process.cwd(), f), out);
console.log(out.join('\n'));
