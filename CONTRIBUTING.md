# Hissa qo'shish qo'llanmasi

TerminalMaster'ga hissa qo'shganingiz uchun rahmat! Bu qo'llanma loyihaga qanday contribution qilishni tushuntiradi.

## Nimani qilish mumkin?

- Yangi **dars** yoki **modul** qo'shish
- Mavjud nazariy tushuntirishlarni yaxshilash (UZ yoki EN)
- Bug fix
- UI/UX yaxshilash
- Yangi til qo'shish (RU, TR, ...)
- `virtualfs.ts` engine'ga yangi buyruqlar qo'shish (e.g. `awk`, `sed`, `curl`)
- Test yozish

## Boshlash

```bash
# Fork qiling va klonlang
git clone https://github.com/YOUR_USERNAME/terminal-master.git
cd terminal-master

# Bog'liqliklarni o'rnating
npm install

# Yangi branch oching
git checkout -b feat/yangi-modul
# yoki
git checkout -b fix/chmod-bug
```

## Yangi dars qo'shish

`src/data/curriculum.ts` faylida `MODULES` arrayiga dars qo'shing:

```typescript
{
  id: 'curl',                          // unique ID
  title: { uz: 'curl — HTTP so\'rov', en: 'curl — HTTP requests' },
  description: {
    uz: 'HTTP so\'rovlar yuborish',
    en: 'Send HTTP requests from terminal',
  },
  command: 'curl',
  theory: {
    uz: 'curl buyrug\'i HTTP so\'rovlar yuboradi...',
    en: 'The curl command sends HTTP requests...',
  },
  examples: [
    { cmd: 'curl https://api.example.com', desc: { uz: 'GET so\'rov', en: 'GET request' } },
  ],
  steps: [
    {
      id: 'curl-1',
      instruction: { uz: 'GET so\'rov yuboring:', en: 'Send a GET request:' },
      expectedCommands: ['curl https://jsonplaceholder.typicode.com/todos/1'],
      hint: { uz: 'curl URL', en: 'curl URL' },
      successMessage: { uz: 'So\'rov yuborildi!', en: 'Request sent!' },
    },
  ],
},
```

Keyin `virtualfs.ts` da buyruqni qo'shing (`execute()` switch ichida).

## Kod uslubi

- TypeScript — type annotation yozing
- `var` ishlatmang — `const`/`let`
- CSS-in-JS (inline styles) — Tailwind faqat utilitylar uchun
- Yangi komponent qo'shsangiz — `'use client'` direktivasini unutmang

## Branch nomlash

```
feat/module-awk         # yangi xususiyat
fix/kill-nonexistent    # bug fix
docs/readme-update      # hujjatlar
refactor/virtualfs      # qayta yozish
```

## Commit xabarlari

[Conventional Commits](https://www.conventionalcommits.org) uslubida:

```
feat: add awk command to virtualfs engine
fix: kill command now validates PID existence
docs: add contributing guide
refactor: simplify commandMatches function
chore: upgrade Next.js to 16.3
```

## Pull Request

1. Branch'da ishlang, `main`ga to'g'ridan-to'g'ri push qilmang
2. PR sarlavhasini aniq yozing
3. Nima o'zgartirganingizni va nima uchun tushuntiring
4. Screenshot qo'shing (UI o'zgarishi bo'lsa)
5. Build sinishini tekshiring: `npm run build`

## Savol?

- [GitHub Issues](https://github.com/akarshiev/terminal-master/issues) da muammo oching
- Telegram: [@abdukarim_qarshiyev](https://t.me/abdukarim_qarshiyev)
