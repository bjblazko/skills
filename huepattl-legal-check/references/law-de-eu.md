# Law: Germany and the EU (as of October 2026)

Engineering summary, not legal advice. Re-check dates and wording at the
sources when a finding depends on them.

## Imprint

| Rule | Applies to | Requires |
|---|---|---|
| § 18 Abs. 1 MStV | every telemedium not *exclusively* personal or family — interpreted narrowly: a public blog or product page is in | name and postal address |
| § 18 Abs. 2 MStV | journalistic-editorial content (a blog) | a responsible person with name and address |
| § 5 DDG (was § 5 TMG) | business-like services, usually for payment | also fast electronic contact (email), registers, VAT ID |

Sources: [§ 18 MStV commentary](https://www.res-media.net/18-mstv-das-impressum-und-der-verantwortliche/),
[NLM guide](https://www.nlm.de/fileadmin/dateien/infothek/pdf/leitfaden_impressumspflicht_NLM.pdf).

## Privacy

- GDPR applies to public websites; the household exemption (Art. 2(2)(c)) does not.
- Server logs with IPs: Art. 6(1)(f) (security), information duty Art. 13,
  rights Art. 15–18, 21, complaint Art. 77. A host processing them on your
  behalf needs a processor agreement (Art. 28) — e.g. Hetzner:
  `accounts.hetzner.com` → Auftragsverarbeitung; tick the data types
  (Protokolldaten, …) and add "Besucher der Websites" as data subjects.
- § 25 TDDDG: storing on the device needs consent unless strictly necessary for
  a service the user asked for (a theme they chose).
- Truncated IP + full User-Agent + timestamp is arguably not anonymous;
  keep only coarse families (browser, OS).

## Patents

- § 9 PatG: use, offer, distribution are reserved to the owner.
- § 11 Nr. 1 PatG: exempt only "Handlungen, die im privaten Bereich zu
  nichtgewerblichen Zwecken vorgenommen werden" — your own private use, not
  publishing for others.
- § 10 Abs. 3 PatG: private users do not count as entitled persons, so
  supplying means to them can be indirect infringement.
- Software "as such" is not patentable (EPC Art. 52), computer-implemented
  inventions with technical character are — codec patents are valid in DE.

Sources: [§ 10 PatG](https://www.gesetze-im-internet.de/patg/__10.html),
[§ 11 PatG](https://www.gesetze-im-internet.de/patg/__11.html),
[Access Advance FAQ](https://accessadvance.com/faq/).

## Liability

- Free software is treated like a gift (§§ 521, 524 BGB by analogy): liability
  only for intent and gross negligence; defects only if fraudulently concealed.
- A license's total disclaimer is partly void under German standard-terms law
  (§ 309 Nr. 7 BGB), but the gift privilege applies anyway; write
  "as far as the law allows".

## EU product rules

| Act | From | Free/open-source software |
|---|---|---|
| Product Liability Directive (EU) 2024/2853 | products placed on the market after 9 Dec 2026 | excluded when developed or supplied outside a commercial activity; open repositories are not "placing on the market" |
| Cyber Resilience Act (EU) 2024/2847 | obligations from 11 Dec 2027 | non-monetised FOSS excluded; occasional donations fine; paid versions, paid support or regular corporate donations can bring it in |

Sources: [PLD text](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ%3AL_202402853),
[Linux Foundation on the CRA](https://www.linuxfoundation.org/blog/understanding-the-cyber-resilience-act).

## Marks and pictures

- § 23 MarkenG: descriptive use of others' marks (what a product works with,
  what a camera recorded) is allowed; logos and implied endorsement are not.
- § 22 KUG: publishing recognisable people needs consent.
