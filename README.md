# patrykbobrowski.pl — Portfolio Rebuild Pack

Cel: przebudować obecną stronę portfolio Patryka Bobrowskiego z wyglądu „AI-slop” na nowoczesne, premium, responsywne portfolio w stylu: Apple Intelligence gradient, Anthropic/Linear minimalizm, editorial portfolio, płynne mikroanimacje, mocny UX i szybkie ładowanie.

## Priorytet na dziś

1. Zrób backup repo.
2. Uruchom lokalnie stronę i sprawdź, z czego naprawdę jest zbudowana.
3. Wykonaj audyt bez przepisywania wszystkiego od razu.
4. Ustal docelowy design system w `DESIGN.md`.
5. Przebuduj layout mobile-first.
6. Napraw wideo / media fallback.
7. Usuń ciężkie, losowe efekty i zastąp je kontrolowanym gradientem + subtelnym motion.
8. Sprawdź responsywność: 360, 390, 768, 1024, 1440, 1920 px.
9. Sprawdź Lighthouse / Performance / Accessibility.
10. Wypuść update dopiero po checklistach.

## Docelowa struktura repo

```txt
/
├─ index.html
├─ styles.css
├─ script.js
├─ videos/
├─ assets/
│  ├─ images/
│  ├─ posters/
│  └─ brand/
├─ docs/
│  ├─ DESIGN.md
│  ├─ CONTENT.md
│  └─ LAUNCH_CHECKLIST.md
├─ skills/
│  ├─ portfolio-redesign/SKILL.md
│  ├─ responsive-qa/SKILL.md
│  ├─ motion-performance/SKILL.md
│  └─ anti-ai-slop-ui/SKILL.md
├─ AGENTS.md
└─ README.md
```

## Antigravity / Gemini workflow

Używaj krótkich, kontrolowanych promptów. Nie dawaj agentowi jednego prompta typu „zrób wszystko”, bo wtedy często robi chaos, zmienia za dużo plików i psuje istniejące działanie.

Kolejność:

1. `prompts/00_AUDIT_REPO.md`
2. `prompts/01_CREATE_DOCS.md`
3. `prompts/02_DESIGN_SYSTEM_LOCK.md`
4. `prompts/03_REBUILD_HERO.md`
5. `prompts/04_REBUILD_SECTIONS.md`
6. `prompts/05_MOTION_AND_MEDIA.md`
7. `prompts/06_RESPONSIVE_QA.md`
8. `prompts/07_FINAL_LAUNCH_CHECK.md`

## Zakaz

- Nie tworzyć losowego kosmicznego tła z kropkami na całej stronie.
- Nie robić neonowej „gamingowej” estetyki.
- Nie przesadzać z blurami, glow i animacjami.
- Nie ukrywać problemów z filmami za „fallbackiem”.
- Nie zmieniać danych kontaktowych bez zgody.
- Nie usuwać legal pages / cookies bez zastąpienia działającym rozwiązaniem.
- Nie tworzyć fałszywych projektów ani kompetencji.

## Szybka definicja kierunku

Strona ma mówić:
„Patryk to młody twórca video/grafiki/AI, który potrafi robić krótkie, dynamiczne treści, proste landing page i używać narzędzi AI do szybszej pracy”.

Nie ma udawać dużej agencji ani senior developera. Ma wyglądać profesjonalnie, świeżo, odważnie, ale wiarygodnie.
