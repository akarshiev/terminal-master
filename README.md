<div align="center">

```
  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
     ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
                ███╗   ███╗ █████╗ ███████╗████████╗███████╗██████╗
                ████╗ ████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
                ██╔████╔██║███████║███████╗   ██║   █████╗  ██████╔╝
                ██║╚██╔╝██║██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗
                ██║ ╚═╝ ██║██║  ██║███████║   ██║   ███████╗██║  ██║
                ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

**Linux Terminal va Tmux ni o'rganish uchun interaktiv platforma**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Deploy: Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

[Demo](#) · [O'rnatish](#o'rnatish) · [Hissa qo'shish](CONTRIBUTING.md) · [Muallif](https://github.com/akarshiev)

</div>

---

## Nima bu?

**TerminalMaster** — brauzerda to'liq ishlaydigan, interaktiv Linux va Tmux o'rganish platformasi. Server kerak emas, hech narsa o'rnatish shart emas — ochasan va o'rganasiz.

```
┌─────────────────┬────────────────────────────┬───────────────────┐
│  Modul paneli   │     Virtual terminal        │  O'quv qo'llanma  │
│                 │                             │                   │
│  01 Basics    ✓ │  akarshiev@linux:~          │  pwd buyrug'i     │
│  02 Navigation  │  akarshiev@linux:~ ❯ pwd   │                   │
│  03 Files       │  /home/akarshiev            │  pwd (print       │
│  04 Reading     │  akarshiev@linux:~ ❯ ls -l  │  working dir)     │
│  05 Search      │  total 8                    │  joriy papkani    │
│  06 Pipe        │  drwxr-xr-x  projects       │  ko'rsatadi.      │
│  07 Permissions │  -rw-r--r--  notes.md       │                   │
│  08 Processes   │  akarshiev@linux:~ ❯ █      │  [ Vazifaga o't ] │
│  09 Tmux        │                             │                   │
│  10 SSH         ├────────────────────────────┤  ─────────────    │
│                 │  FILES  PERMS  PIPE          │  Qadamlar: 1/2   │
└─────────────────┴────────────────────────────┴───────────────────┘
```

## Imkoniyatlar

- **Virtual filesystem engine** — `cd`, `ls`, `mkdir`, `touch`, `rm`, `cp`, `mv`, `chmod`, `find`, `grep`, `pipe`, `redirect` va boshqalar haqiqiy Linux kabi ishlaydi
- **Real terminal tajribasi** — o'rtada cursor tahrirlash, history (↑↓), Tab autocomplete, Ctrl+L, Ctrl+C
- **Tmux simulator** — sessiya ochish, `Ctrl+B %` / `Ctrl+B "` bilan ekran bo'lish, detach/attach
- **Strict command validation** — faqat to'g'ri buyruq darsni oldinga siljitadi
- **LabEx-style o'quv qo'llanma** — har bir buyruq uchun "nima, nega, qanday" tushuntirish va misollar
- **UZ/EN ikki tilli** — o'zbek va ingliz tillarida
- **Serverless** — `localStorage` orqali progress saqlanadi, backend kerak emas
- **Vercel'ga deploy** — bitta `git push` yetarli

## Stack

| Texnologiya | Maqsad |
|---|---|
| Next.js 16 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| `localStorage` | Progress saqlash |

## O'rnatish

```bash
# 1. Klonlash
git clone https://github.com/akarshiev/terminal-master.git
cd terminal-master

# 2. Bog'liqliklarni o'rnatish
npm install

# 3. Dev server
npm run dev
```

Brauzerda `http://localhost:3000` ni oching.

## Deploy (Vercel)

```bash
# Vercel CLI orqali
npm i -g vercel
vercel --prod
```

Yoki [Vercel Dashboard](https://vercel.com)da GitHub repo'ni ulang — avtomatik deploy bo'ladi.

## Loyiha tuzilmasi

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   └── learn/page.tsx    # Asosiy o'quv sahifasi
├── components/
│   ├── terminal/
│   │   ├── TerminalEmulator.tsx  # Virtual terminal (cursor, history, autocomplete)
│   │   └── TmuxTerminal.tsx      # Tmux simulator (split, detach, sessions)
│   ├── sidebar/
│   │   ├── Sidebar.tsx           # Modul/dars navigatsiyasi
│   │   └── LessonPanel.tsx       # O'quv qo'llanma (theory + examples + task)
│   ├── visual/
│   │   ├── FileTree.tsx          # Fayl tizimi daraxti
│   │   ├── PermissionsVisual.tsx # chmod kalkulyator
│   │   └── PipeVisual.tsx        # Pipe oqim diagrammasi
│   └── layout/
│       └── LearnNavbar.tsx
├── lib/
│   ├── virtualfs.ts      # Virtual fayl tizimi engine (barcha Linux buyruqlari)
│   └── storage.ts        # localStorage progress manager
├── data/
│   └── curriculum.ts     # 10 modul, 30+ dars, to'liq nazariy kontent
└── types/
    └── index.ts
```

## Modullar

| # | Modul | Buyruqlar |
|---|---|---|
| 01 | Linux Asoslari | `pwd` `whoami` `echo` `clear` `date` `uname` |
| 02 | Navigatsiya | `ls` `cd` |
| 03 | Fayllar | `touch` `mkdir` `cp` `mv` `rm` |
| 04 | Fayllarni o'qish | `cat` `head` `tail` `wc` |
| 05 | Qidiruv | `find` `tree` `grep` |
| 06 | Pipe va Redirect | `>` `>>` `\|` |
| 07 | Ruxsatlar | `chmod` `ls -l` |
| 08 | Jarayonlar | `ps` `kill` |
| 09 | Tmux | `new` `split` `detach` `attach` `windows` |
| 10 | SSH | `ssh-keygen` `ssh` |

## Hissa qo'shish

Yangi modul, dars yoki bug fix? Xush kelibsiz! → [CONTRIBUTING.md](CONTRIBUTING.md)

## Muallif

**Abdukarim Qarshiyev** — Java Backend Developer, PDP University Tashkent

- GitHub: [@akarshiev](https://github.com/akarshiev)
- Telegram: [@abdukarim_qarshiyev](https://t.me/abdukarim_qarshiyev)
- Blog: [uz.akarshiev.blog](https://uz.akarshiev.blog)

## Litsenziya

[MIT](LICENSE) © 2026 Abdukarim Qarshiyev
