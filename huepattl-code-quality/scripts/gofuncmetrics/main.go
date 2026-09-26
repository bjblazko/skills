// gofuncmetrics prints one line per Go function under a directory, tab-separated:
// length in lines, cyclomatic complexity, file:line, name. Test files are skipped.
// Stdlib only, so it needs no install:
//
//	go -C ~/.claude/skills/huepattl-code-quality/scripts/gofuncmetrics run . /abs/path/to/src | sort -rn | head

package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"strings"
)

func cyclo(n ast.Node) int {
	c := 1
	ast.Inspect(n, func(n ast.Node) bool {
		switch x := n.(type) {
		case *ast.IfStmt, *ast.ForStmt, *ast.RangeStmt, *ast.CaseClause, *ast.CommClause:
			c++
		case *ast.BinaryExpr:
			if x.Op == token.LAND || x.Op == token.LOR {
				c++
			}
		}
		return true
	})
	return c
}

func main() {
	fs := token.NewFileSet()
	filepath.Walk(os.Args[1], func(p string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() || !strings.HasSuffix(p, ".go") || strings.HasSuffix(p, "_test.go") {
			return nil
		}
		f, err := parser.ParseFile(fs, p, nil, 0)
		if err != nil {
			return nil
		}
		for _, d := range f.Decls {
			fn, ok := d.(*ast.FuncDecl)
			if !ok || fn.Body == nil {
				continue
			}
			lines := fs.Position(fn.End()).Line - fs.Position(fn.Pos()).Line + 1
			name := fn.Name.Name
			if fn.Recv != nil && len(fn.Recv.List) > 0 {
				t := fn.Recv.List[0].Type
				if s, ok := t.(*ast.StarExpr); ok {
					t = s.X
				}
				if id, ok := t.(*ast.Ident); ok {
					name = id.Name + "." + name
				}
			}
			fmt.Printf("%d\t%d\t%s:%d\t%s\n", lines, cyclo(fn), p, fs.Position(fn.Pos()).Line, name)
		}
		return nil
	})
}
