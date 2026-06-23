import { Module, FileSystemNode } from '@/types';

export const BASE_FS: FileSystemNode = {
  name: '/',
  type: 'dir',
  children: [
    {
      name: 'home',
      type: 'dir',
      children: [
        {
          name: '__USER__',
          type: 'dir',
          children: [
            { name: 'readme.txt', type: 'file', size: 92, content: 'Welcome to TerminalMaster!\nBu fayl namuna uchun yaratilgan.\nLinux terminalini bu yerda mashq qiling.' },
            { name: 'notes.md', type: 'file', size: 64, content: '# Mening eslatmalarim\n\n- Linux o\'rganish\n- Backend developer bo\'lish\n- Spring Boot' },
            {
              name: 'projects',
              type: 'dir',
              children: [
                { name: 'hello.sh', type: 'file', size: 64, permissions: '-rw-r--r--', content: '#!/bin/bash\necho "Hello World"' },
                { name: 'main.py', type: 'file', size: 0, content: '' },
              ],
            },
            { name: 'downloads', type: 'dir', children: [] },
          ],
        },
      ],
    },
    { name: 'etc', type: 'dir', children: [{ name: 'hosts', type: 'file', size: 174, content: '127.0.0.1   localhost\n::1         localhost' }] },
    { name: 'var', type: 'dir', children: [{ name: 'log', type: 'dir', children: [{ name: 'syslog', type: 'file', size: 2048, content: 'system log...' }] }] },
    { name: 'usr', type: 'dir', children: [{ name: 'bin', type: 'dir', children: [] }, { name: 'local', type: 'dir', children: [] }] },
    { name: 'tmp', type: 'dir', children: [] },
  ],
};

export const MODULES: Module[] = [
  /* ═══════════════════ 1. LINUX BASICS ═══════════════════ */
  {
    id: 'linux-basics',
    title: { uz: 'Linux Asoslari', en: 'Linux Basics' },
    icon: '01',
    color: '#5bc873',
    lessons: [
      {
        id: 'pwd',
        title: { uz: 'pwd — Qayerdaman?', en: 'pwd — Where am I?' },
        description: { uz: 'Joriy papka yo\'lini ko\'rsatish', en: 'Print the current directory path' },
        command: 'pwd',
        theory: {
          uz: 'Linux fayl tizimi katta daraxtga o\'xshaydi. Eng tepada "root" (`/`) turadi, undan barcha papkalar tarmoqlanadi. Terminalda ishlaganingizda, siz doim biror papka ichida turasiz — bu sizning "joriy ish papkangiz" (current working directory).\n\n`pwd` buyrug\'i (print working directory) aynan shu — "hozir qayerdaman?" degan savolga javob beradi. U to\'liq yo\'lni `/` dan boshlab ko\'rsatadi. Masalan `/home/akarshiev` — bu sizning shaxsiy papkangiz.\n\nNega kerak? Murakkab loyihalarda papkalar ichida adashib qolish oson. `pwd` har doim aniq joyni ko\'rsatadi.',
          en: 'The Linux file system is like a big tree. At the top sits "root" (`/`), and all folders branch out from it. When working in the terminal, you are always inside some folder — your "current working directory".\n\nThe `pwd` command (print working directory) answers exactly this — "where am I right now?". It shows the full path starting from `/`. For example `/home/akarshiev` is your personal folder.\n\nWhy useful? In complex projects it is easy to get lost between folders. `pwd` always shows your exact location.',
        },
        examples: [
          { cmd: 'pwd', desc: { uz: 'Joriy papkani ko\'rsatadi', en: 'Shows current directory' } },
        ],
        steps: [{
          id: 'pwd-1',
          instruction: { uz: 'Quyidagi buyruqni yozing va Enter bosing:', en: 'Type the following command and press Enter:' },
          expectedCommands: ['pwd'],
          successMessage: { uz: 'Ajoyib! Siz hozir shaxsiy papkangizda turibsiz.', en: 'Great! You are now in your home directory.' },
          visualEffect: 'filesystem',
        }],
      },
      {
        id: 'whoami',
        title: { uz: 'whoami — Men kimman?', en: 'whoami — Who am I?' },
        description: { uz: 'Joriy foydalanuvchi nomini ko\'rsatish', en: 'Show the current username' },
        command: 'whoami',
        theory: {
          uz: 'Linux — ko\'p foydalanuvchili (multi-user) tizim. Bitta kompyuterda bir nechta odam alohida hisob (account) bilan ishlashi mumkin. Har bir foydalanuvchining o\'z papkasi, o\'z fayllari va o\'z ruxsatlari bor.\n\n`whoami` buyrug\'i — "men hozir qaysi foydalanuvchi sifatida ishlayapman?" degan savolga javob beradi. Bu ayniqsa serverlarda muhim: ba\'zan oddiy foydalanuvchi, ba\'zan `root` (administrator) sifatida ishlaysiz.\n\n`id` buyrug\'i esa yanada batafsil ma\'lumot beradi — foydalanuvchi ID raqami (uid), guruh (gid) va qaysi guruhlarga a\'zoligingizni ko\'rsatadi.',
          en: 'Linux is a multi-user system. Multiple people can work on one computer with separate accounts. Each user has their own folder, files, and permissions.\n\nThe `whoami` command answers "which user am I working as right now?". This matters especially on servers: sometimes you work as a normal user, sometimes as `root` (administrator).\n\nThe `id` command gives even more detail — your user ID number (uid), group (gid), and which groups you belong to.',
        },
        examples: [
          { cmd: 'whoami', desc: { uz: 'Foydalanuvchi nomi', en: 'Username' } },
          { cmd: 'id', desc: { uz: 'To\'liq foydalanuvchi ma\'lumoti', en: 'Full user info' } },
        ],
        steps: [{
          id: 'whoami-1',
          instruction: { uz: 'Foydalanuvchi nomingizni ko\'rish uchun yozing:', en: 'Type this to see your username:' },
          expectedCommands: ['whoami'],
          successMessage: { uz: 'Ha, bu siz! Bu sizning Linux foydalanuvchi nomingiz.', en: 'Yes, that\'s you! This is your Linux username.' },
        }],
      },
      {
        id: 'echo',
        title: { uz: 'echo — Matn chiqarish', en: 'echo — Print text' },
        description: { uz: 'Terminalga matn chiqarish', en: 'Print text to the terminal' },
        command: 'echo',
        theory: {
          uz: '`echo` — eng oddiy, lekin eng ko\'p ishlatiladigan buyruqlardan biri. U bergan matningizni shunchaki ekranga chiqaradi.\n\nBoshda foydasiz tuyulishi mumkin, lekin u juda muhim: skript (script) yozayotganda foydalanuvchiga xabar ko\'rsatish, o\'zgaruvchilar qiymatini tekshirish va faylga matn yozish uchun ishlatiladi.\n\nMisol uchun `echo $HOME` — `HOME` o\'zgaruvchisining qiymatini (sizning papkangiz yo\'lini) chiqaradi. Keyinroq `echo "matn" > fayl.txt` orqali faylga yozishni ham o\'rganasiz.',
          en: '`echo` is one of the simplest yet most-used commands. It simply prints the text you give to the screen.\n\nIt may seem useless at first, but it is very important: when writing scripts, it shows messages to the user, checks variable values, and writes text to files.\n\nFor example `echo $HOME` prints the value of the `HOME` variable (your folder path). Later you will learn to write to files with `echo "text" > file.txt`.',
        },
        examples: [
          { cmd: 'echo "Salom Dunyo"', desc: { uz: 'Matn chiqaradi', en: 'Prints text' } },
          { cmd: 'echo $HOME', desc: { uz: 'O\'zgaruvchi qiymati', en: 'Variable value' } },
        ],
        steps: [{
          id: 'echo-1',
          instruction: { uz: 'Quyidagini aynan yozing:', en: 'Type exactly this:' },
          expectedCommands: ['echo "Salom Dunyo"', 'echo Salom Dunyo'],
          hint: { uz: 'echo "Salom Dunyo" — qo\'shtirnoq bilan', en: 'echo "Salom Dunyo" — with quotes' },
          successMessage: { uz: 'Terminalga birinchi matningizni chiqardingiz!', en: 'You printed your first text!' },
        }],
      },
      {
        id: 'clear',
        title: { uz: 'clear — Ekranni tozalash', en: 'clear — Clear the screen' },
        description: { uz: 'Terminal ekranini tozalash', en: 'Clear the terminal screen' },
        command: 'clear',
        theory: {
          uz: 'Terminalda ko\'p buyruq yozganingizdan keyin ekran to\'lib ketadi va chalkash bo\'ladi. `clear` buyrug\'i ekranni tozalab, toza varaq beradi.\n\nMuhim: `clear` hech narsani o\'chirmaydi — fayllaringiz, papkalaringiz joyida qoladi. U faqat ekrandagi ko\'rinishni tozalaydi. Yuqoriga scroll qilsangiz, eski buyruqlarni ko\'rishingiz mumkin.\n\nKlaviatura yorlig\'i: `Ctrl + L` — `clear` bilan bir xil ishlaydi va tezroq.',
          en: 'After typing many commands, the terminal screen fills up and becomes cluttered. The `clear` command wipes the screen and gives you a clean slate.\n\nImportant: `clear` deletes nothing — your files and folders stay in place. It only clears the visible display. If you scroll up, you can still see old commands.\n\nKeyboard shortcut: `Ctrl + L` works the same as `clear` and is faster.',
        },
        examples: [
          { cmd: 'clear', desc: { uz: 'Ekranni tozalaydi', en: 'Clears the screen' } },
        ],
        steps: [{
          id: 'clear-1',
          instruction: { uz: 'Ekranni tozalash uchun yozing:', en: 'Type this to clear the screen:' },
          expectedCommands: ['clear'],
          successMessage: { uz: 'Ekran tozalandi! Ctrl+L ham xuddi shunday ishlaydi.', en: 'Screen cleared! Ctrl+L does the same.' },
        }],
      },
      {
        id: 'date',
        title: { uz: 'date — Sana va vaqt', en: 'date — Date and time' },
        description: { uz: 'Joriy sana va vaqtni ko\'rsatish', en: 'Show current date and time' },
        command: 'date',
        theory: {
          uz: '`date` buyrug\'i tizimning joriy sanasi va vaqtini ko\'rsatadi. Bu oddiy ko\'rinsa-da, serverlarni boshqarishda juda muhim.\n\nNega? Loglar (log fayllari) har bir hodisani vaqt bilan yozadi. Backup (zaxira nusxa) olishda sana ishlatiladi. Skriptlarda vaqtga qarab qaror qabul qilinadi.\n\n`date` turli formatda chiqarishi mumkin. Masalan `date "+%Y-%m-%d"` faqat sanani `2026-06-23` ko\'rinishida beradi.',
          en: 'The `date` command shows the system\'s current date and time. Though simple, it is very important in server administration.\n\nWhy? Logs record every event with a timestamp. Backups use the date in their names. Scripts make decisions based on time.\n\n`date` can output in different formats. For example `date "+%Y-%m-%d"` gives just the date as `2026-06-23`.',
        },
        examples: [
          { cmd: 'date', desc: { uz: 'To\'liq sana va vaqt', en: 'Full date and time' } },
        ],
        steps: [{
          id: 'date-1',
          instruction: { uz: 'Joriy vaqtni ko\'rish uchun yozing:', en: 'Type this to see the current time:' },
          expectedCommands: ['date'],
          successMessage: { uz: 'Tizim vaqti ko\'rsatildi!', en: 'System time displayed!' },
        }],
      },
      {
        id: 'uname',
        title: { uz: 'uname — Tizim ma\'lumoti', en: 'uname — System info' },
        description: { uz: 'Operatsion tizim haqida ma\'lumot', en: 'Information about the operating system' },
        command: 'uname',
        theory: {
          uz: '`uname` (unix name) buyrug\'i operatsion tizim haqida ma\'lumot beradi. Yolg\'iz `uname` faqat "Linux" deb yozadi, lekin `uname -a` (all) to\'liq ma\'lumot beradi: yadro (kernel) versiyasi, kompyuter nomi, arxitektura (x86_64) va boshqalar.\n\nBu serverda ishlayotganda muhim: qaysi Linux versiyasi o\'rnatilgan, 64-bitmi yoki 32-bit, qaysi yadro ishlayapti. Dasturlarni o\'rnatishda bu ma\'lumot kerak bo\'ladi.',
          en: 'The `uname` (unix name) command gives information about the operating system. `uname` alone just prints "Linux", but `uname -a` (all) gives full info: kernel version, computer name, architecture (x86_64), and more.\n\nThis matters when working on a server: which Linux version is installed, 64-bit or 32-bit, which kernel is running. This info is needed when installing software.',
        },
        examples: [
          { cmd: 'uname', desc: { uz: 'Tizim nomi', en: 'System name' } },
          { cmd: 'uname -a', desc: { uz: 'To\'liq tizim ma\'lumoti', en: 'Full system info' } },
        ],
        steps: [{
          id: 'uname-1',
          instruction: { uz: 'To\'liq tizim ma\'lumotini ko\'rish uchun yozing:', en: 'Type this for full system info:' },
          expectedCommands: ['uname -a'],
          hint: { uz: 'uname -a (a harfi "all" — hammasi degani)', en: 'uname -a (a means "all")' },
          successMessage: { uz: 'Tizim ma\'lumotlari to\'liq ko\'rsatildi!', en: 'Full system info displayed!' },
        }],
      },
    ],
  },

  /* ═══════════════════ 2. NAVIGATION ═══════════════════ */
  {
    id: 'navigation',
    title: { uz: 'Navigatsiya', en: 'Navigation' },
    icon: '02',
    color: '#6cb6ff',
    lessons: [
      {
        id: 'ls',
        title: { uz: 'ls — Fayllarni ko\'rish', en: 'ls — List files' },
        description: { uz: 'Papka ichidagi fayllarni ko\'rsatish', en: 'List files inside a directory' },
        command: 'ls',
        theory: {
          uz: '`ls` (list) — eng ko\'p ishlatiladigan buyruq. U joriy papkada qanday fayl va papkalar borligini ko\'rsatadi.\n\nO\'zi yolg\'iz `ls` faqat nomlarni beradi. Lekin "bayroqlar" (flags) bilan ko\'proq ma\'lumot olish mumkin:\n\n• `ls -l` — uzun format: ruxsatlar, egasi, hajmi, sana\n• `ls -a` — yashirin fayllar ham (nuqta bilan boshlanadiganlar, masalan `.git`)\n• `ls -la` — ikkalasi birga\n\nLinux\'da nuqta bilan boshlanadigan fayllar (`.bashrc`, `.git`) yashirin hisoblanadi va oddiy `ls`da ko\'rinmaydi.',
          en: '`ls` (list) is the most-used command. It shows what files and folders exist in the current directory.\n\n`ls` alone just gives names. But with "flags" you get more info:\n\n• `ls -l` — long format: permissions, owner, size, date\n• `ls -a` — hidden files too (those starting with a dot, like `.git`)\n• `ls -la` — both combined\n\nIn Linux, files starting with a dot (`.bashrc`, `.git`) are hidden and do not show in a plain `ls`.',
        },
        examples: [
          { cmd: 'ls', desc: { uz: 'Oddiy ro\'yxat', en: 'Simple list' } },
          { cmd: 'ls -l', desc: { uz: 'Batafsil ro\'yxat', en: 'Detailed list' } },
          { cmd: 'ls -la', desc: { uz: 'Yashirin fayllar bilan', en: 'Including hidden files' } },
        ],
        steps: [
          {
            id: 'ls-1',
            instruction: { uz: 'Papkadagi fayllarni ko\'rish uchun yozing:', en: 'Type this to list files:' },
            expectedCommands: ['ls'],
            successMessage: { uz: 'Fayllar ko\'rindi! Ko\'k rangdagilar — papkalar.', en: 'Files listed! Blue ones are directories.' },
            visualEffect: 'filesystem',
          },
          {
            id: 'ls-2',
            instruction: { uz: 'Endi batafsil ro\'yxatni ko\'ring (ruxsatlar, hajm bilan):', en: 'Now see the detailed list (with permissions, size):' },
            expectedCommands: ['ls -l', 'ls -la', 'ls -al'],
            hint: { uz: 'ls -l yoki ls -la', en: 'ls -l or ls -la' },
            successMessage: { uz: 'Endi har bir fayl haqida to\'liq ma\'lumot ko\'rinyapti!', en: 'Now you see full info about each file!' },
            visualEffect: 'filesystem',
          },
        ],
      },
      {
        id: 'cd',
        title: { uz: 'cd — Papkaga kirish', en: 'cd — Change directory' },
        description: { uz: 'Papkalar orasida harakatlanish', en: 'Move between directories' },
        command: 'cd',
        theory: {
          uz: '`cd` (change directory) — papkalar orasida sayohat qilish uchun. Bu fayl daraxti bo\'ylab yurish kabi.\n\nMuhim qisqartmalar:\n• `cd papka` — ichkariga kirish\n• `cd ..` — bir pog\'ona orqaga (yuqoriga)\n• `cd ~` yoki shunchaki `cd` — uy papkasiga qaytish\n• `cd /` — eng tepaga (root)\n• `cd -` — oldingi papkaga qaytish\n\nIkki xil yo\'l bor: **absolute** (to\'liq, `/` dan boshlanadi: `/home/user/projects`) va **relative** (nisbiy, joriy papkadan: `projects` yoki `../downloads`). Relative yo\'l qisqaroq va ko\'proq ishlatiladi.',
          en: '`cd` (change directory) is for traveling between folders. It is like walking through the file tree.\n\nKey shortcuts:\n• `cd folder` — go inside\n• `cd ..` — one level back (up)\n• `cd ~` or just `cd` — return to home folder\n• `cd /` — go to the top (root)\n• `cd -` — return to previous folder\n\nTwo path types: **absolute** (full, starts with `/`: `/home/user/projects`) and **relative** (from current folder: `projects` or `../downloads`). Relative paths are shorter and used more often.',
        },
        examples: [
          { cmd: 'cd projects', desc: { uz: 'projects ichiga kirish', en: 'Enter projects' } },
          { cmd: 'cd ..', desc: { uz: 'Bir pog\'ona orqaga', en: 'One level up' } },
          { cmd: 'cd ~', desc: { uz: 'Uy papkasiga', en: 'To home folder' } },
        ],
        steps: [
          {
            id: 'cd-1',
            instruction: { uz: '`projects` papkasiga kiring:', en: 'Enter the `projects` folder:' },
            expectedCommands: ['cd projects', 'cd projects/', 'cd ~/projects'],
            successMessage: { uz: 'projects ichidasiz! Prompt o\'zgardi: ~/projects', en: 'You are inside projects! Prompt changed: ~/projects' },
            visualEffect: 'filesystem',
          },
          {
            id: 'cd-2',
            instruction: { uz: 'Endi bir pog\'ona orqaga qayting:', en: 'Now go one level back:' },
            expectedCommands: ['cd ..'],
            hint: { uz: 'cd .. (ikki nuqta — yuqoriga degani)', en: 'cd .. (two dots mean up)' },
            successMessage: { uz: 'Orqaga qaytdingiz!', en: 'You went back!' },
            visualEffect: 'filesystem',
          },
          {
            id: 'cd-3',
            instruction: { uz: 'Uy papkangizga qayting:', en: 'Return to your home folder:' },
            expectedCommands: ['cd ~', 'cd', 'cd /home/__USER__'],
            hint: { uz: 'cd ~ yoki shunchaki cd', en: 'cd ~ or just cd' },
            successMessage: { uz: 'Uyga qaytdingiz!', en: 'Back home!' },
            visualEffect: 'filesystem',
          },
        ],
      },
    ],
  },

  /* ═══════════════════ 3. FILES ═══════════════════ */
  {
    id: 'files',
    title: { uz: 'Fayllar bilan ishlash', en: 'File Operations' },
    icon: '03',
    color: '#e3b341',
    lessons: [
      {
        id: 'touch',
        title: { uz: 'touch — Fayl yaratish', en: 'touch — Create a file' },
        description: { uz: 'Bo\'sh fayl yaratish', en: 'Create an empty file' },
        command: 'touch',
        theory: {
          uz: '`touch` buyrug\'i bo\'sh fayl yaratadi. Nomi g\'alati — "touch" (tegmoq) degani. Aslida u faylga "tegib", uni yangilaydi yoki bo\'lmasa yaratadi.\n\nIkki vazifasi bor:\n1. Fayl yo\'q bo\'lsa — yangi bo\'sh fayl yaratadi\n2. Fayl bor bo\'lsa — uning "oxirgi o\'zgartirilgan vaqtini" yangilaydi (mazmunini emas)\n\nDasturlashda tez-tez yangi fayl kerak bo\'ladi: `touch index.html`, `touch app.py`. Bu eng tez usul.',
          en: 'The `touch` command creates an empty file. The name is odd — "touch". It actually "touches" a file, updating it or creating it.\n\nIt has two jobs:\n1. If the file does not exist — creates a new empty file\n2. If the file exists — updates its "last modified time" (not the content)\n\nWhen programming you often need new files: `touch index.html`, `touch app.py`. This is the fastest way.',
        },
        examples: [
          { cmd: 'touch app.py', desc: { uz: 'app.py faylini yaratadi', en: 'Creates app.py' } },
        ],
        steps: [{
          id: 'touch-1',
          instruction: { uz: '`app.py` nomli yangi fayl yarating:', en: 'Create a new file named `app.py`:' },
          expectedCommands: ['touch app.py'],
          successMessage: { uz: 'app.py yaratildi! Fayl tizimida ko\'ring (pastdagi panel).', en: 'app.py created! See it in the file tree below.' },
          visualEffect: 'filesystem',
        }],
      },
      {
        id: 'mkdir',
        title: { uz: 'mkdir — Papka yaratish', en: 'mkdir — Create a directory' },
        description: { uz: 'Yangi papka yaratish', en: 'Create a new directory' },
        command: 'mkdir',
        theory: {
          uz: '`mkdir` (make directory) — yangi papka yaratadi. Fayllar tartibli bo\'lishi uchun papkalar muhim.\n\nFoydali bayroq: `mkdir -p` — bir vaqtda ichma-ich papkalar yaratadi. Masalan `mkdir -p src/main/java` uchta papkani birdaniga yasaydi: `src`, uning ichida `main`, uning ichida `java`. `-p` bo\'lmasa, har birini alohida yaratish kerak bo\'lardi.\n\nBu ayniqsa loyiha tuzilmasini yaratishda qulay.',
          en: '`mkdir` (make directory) creates a new folder. Folders are important to keep files organized.\n\nUseful flag: `mkdir -p` creates nested folders at once. For example `mkdir -p src/main/java` makes three folders at once: `src`, inside it `main`, inside it `java`. Without `-p` you would create each separately.\n\nThis is especially handy when setting up a project structure.',
        },
        examples: [
          { cmd: 'mkdir backend', desc: { uz: 'backend papkasi', en: 'backend folder' } },
          { cmd: 'mkdir -p src/main/java', desc: { uz: 'Ichma-ich papkalar', en: 'Nested folders' } },
        ],
        steps: [
          {
            id: 'mkdir-1',
            instruction: { uz: '`backend` nomli papka yarating:', en: 'Create a folder named `backend`:' },
            expectedCommands: ['mkdir backend'],
            successMessage: { uz: 'backend papkasi yaratildi!', en: 'backend folder created!' },
            visualEffect: 'filesystem',
          },
          {
            id: 'mkdir-2',
            instruction: { uz: 'Endi ichma-ich papkalar yarating:', en: 'Now create nested folders:' },
            expectedCommands: ['mkdir -p src/main/java'],
            hint: { uz: 'mkdir -p src/main/java', en: 'mkdir -p src/main/java' },
            successMessage: { uz: 'Uchta ichma-ich papka birdaniga yaratildi!', en: 'Three nested folders created at once!' },
            visualEffect: 'filesystem',
          },
        ],
      },
      {
        id: 'cp',
        title: { uz: 'cp — Nusxa olish', en: 'cp — Copy' },
        description: { uz: 'Fayl yoki papkani nusxalash', en: 'Copy a file or folder' },
        command: 'cp',
        theory: {
          uz: '`cp` (copy) — fayl yoki papkadan nusxa oladi. Asl fayl joyida qoladi, yangi nusxa yaratiladi.\n\nFormat: `cp manba maqsad` (`cp source destination`).\n\n• `cp notes.md backup.md` — notes.md dan backup.md nusxasini yaratadi\n• `cp -r papka yangi_papka` — papkani nusxalash uchun `-r` (recursive) kerak, chunki papka ichida boshqa fayllar bo\'lishi mumkin\n\nMuhim qoida: nusxa olishdan oldin asl faylni o\'zgartirish — backup olishning eng oddiy usuli.',
          en: '`cp` (copy) makes a copy of a file or folder. The original stays in place, a new copy is created.\n\nFormat: `cp source destination`.\n\n• `cp notes.md backup.md` — creates backup.md from notes.md\n• `cp -r folder new_folder` — copying a folder needs `-r` (recursive) because a folder may contain other files\n\nKey practice: copying before editing the original is the simplest way to make a backup.',
        },
        examples: [
          { cmd: 'cp notes.md backup.md', desc: { uz: 'Fayl nusxasi', en: 'Copy a file' } },
          { cmd: 'cp -r projects backup', desc: { uz: 'Papka nusxasi', en: 'Copy a folder' } },
        ],
        steps: [{
          id: 'cp-1',
          instruction: { uz: '`notes.md` dan `backup.md` nusxasini yarating:', en: 'Copy `notes.md` to `backup.md`:' },
          expectedCommands: ['cp notes.md backup.md'],
          successMessage: { uz: 'Nusxa yaratildi! Endi ikkita fayl bor.', en: 'Copy created! Now there are two files.' },
          visualEffect: 'filesystem',
        }],
      },
      {
        id: 'mv',
        title: { uz: 'mv — Ko\'chirish / Nomlash', en: 'mv — Move / Rename' },
        description: { uz: 'Fayl ko\'chirish yoki nomini o\'zgartirish', en: 'Move a file or rename it' },
        command: 'mv',
        theory: {
          uz: '`mv` (move) — ikki vazifani bajaradi:\n\n1. **Ko\'chirish**: `mv fayl.txt papka/` — faylni boshqa papkaga olib boradi\n2. **Nomini o\'zgartirish**: `mv eski.txt yangi.txt` — faylni o\'sha joyda qoldirib, nomini o\'zgartiradi\n\nNega bitta buyruq ikkalasini qiladi? Chunki Linux uchun "ko\'chirish" va "qayta nomlash" — bir xil amal: faylni eski joydan olib, yangi joyga (yoki yangi nom bilan) qo\'yish.\n\n`cp` dan farqi: `mv` nusxa qoldirmaydi — asl fayl yo\'qoladi, faqat yangi joyda paydo bo\'ladi.',
          en: '`mv` (move) does two jobs:\n\n1. **Move**: `mv file.txt folder/` — moves the file to another folder\n2. **Rename**: `mv old.txt new.txt` — keeps the file in place but changes its name\n\nWhy does one command do both? Because for Linux, "moving" and "renaming" are the same operation: take the file from the old place and put it in a new place (or with a new name).\n\nDifference from `cp`: `mv` leaves no copy — the original disappears and only appears in the new place.',
        },
        examples: [
          { cmd: 'mv app.py main.py', desc: { uz: 'Nomini o\'zgartirish', en: 'Rename' } },
          { cmd: 'mv file.txt downloads/', desc: { uz: 'Boshqa papkaga', en: 'To another folder' } },
        ],
        steps: [{
          id: 'mv-1',
          instruction: { uz: '`backup.md` faylining nomini `archive.md` ga o\'zgartiring:', en: 'Rename `backup.md` to `archive.md`:' },
          expectedCommands: ['mv backup.md archive.md'],
          successMessage: { uz: 'Fayl nomi o\'zgartirildi!', en: 'File renamed!' },
          visualEffect: 'filesystem',
        }],
      },
      {
        id: 'rm',
        title: { uz: 'rm — O\'chirish', en: 'rm — Remove' },
        description: { uz: 'Fayl yoki papkani o\'chirish', en: 'Delete a file or folder' },
        command: 'rm',
        theory: {
          uz: '`rm` (remove) — fayllarni o\'chiradi. **DIQQAT**: Linux\'da o\'chirilgan fayl "Savatcha"ga (Trash) tushmaydi — butunlay yo\'qoladi! Qaytarib bo\'lmaydi.\n\n• `rm fayl.txt` — bitta faylni o\'chiradi\n• `rm -r papka` — papkani va ichidagi hamma narsani o\'chiradi (`-r` = recursive)\n• `rm -f` — so\'ramasdan o\'chiradi (force)\n\nMashhur xavfli buyruq: `rm -rf /` — butun tizimni o\'chiradi. **Hech qachon yozmang!** `-rf` bayroqlarini doim ehtiyot bilan ishlating.\n\nQoida: o\'chirishdan oldin `ls` bilan tekshiring — nimani o\'chirayotganingizni aniq biling.',
          en: '`rm` (remove) deletes files. **WARNING**: in Linux a deleted file does NOT go to Trash — it is gone completely! It cannot be recovered.\n\n• `rm file.txt` — deletes one file\n• `rm -r folder` — deletes a folder and everything in it (`-r` = recursive)\n• `rm -f` — deletes without asking (force)\n\nFamous dangerous command: `rm -rf /` deletes the entire system. **Never type it!** Always use `-rf` flags carefully.\n\nRule: before deleting, check with `ls` — know exactly what you are deleting.',
        },
        examples: [
          { cmd: 'rm archive.md', desc: { uz: 'Faylni o\'chiradi', en: 'Deletes a file' } },
          { cmd: 'rm -r papka', desc: { uz: 'Papkani o\'chiradi', en: 'Deletes a folder' } },
        ],
        steps: [{
          id: 'rm-1',
          instruction: { uz: '`archive.md` faylini o\'chiring:', en: 'Delete the `archive.md` file:' },
          expectedCommands: ['rm archive.md'],
          successMessage: { uz: 'Fayl o\'chirildi! (Linux\'da bu qaytarilmaydi)', en: 'File deleted! (cannot be undone in Linux)' },
          visualEffect: 'filesystem',
        }],
      },
    ],
  },

  /* ═══════════════════ 4. READING FILES ═══════════════════ */
  {
    id: 'reading',
    title: { uz: 'Fayllarni o\'qish', en: 'Reading Files' },
    icon: '04',
    color: '#bc8cff',
    lessons: [
      {
        id: 'cat',
        title: { uz: 'cat — Faylni o\'qish', en: 'cat — Read a file' },
        description: { uz: 'Fayl mazmunini ko\'rsatish', en: 'Display file contents' },
        command: 'cat',
        theory: {
          uz: '`cat` (concatenate) — faylning butun mazmunini ekranga chiqaradi. Eng oddiy fayl o\'qish usuli.\n\nNomi "concatenate" (birlashtirish) — chunki bir nechta faylni birlashtirib ko\'rsata oladi: `cat fayl1.txt fayl2.txt`.\n\nQachon ishlatiladi? Kichik fayllarni tez ko\'rish uchun ideal: konfiguratsiya fayllari, kod, eslatmalar. Lekin katta fayllar uchun yaramaydi — hammasi birdan chiqib ketadi. Katta fayllar uchun `less` ishlatiladi (keyingi dars).',
          en: '`cat` (concatenate) prints the entire content of a file to the screen. The simplest way to read a file.\n\nIts name "concatenate" comes from its ability to join multiple files: `cat file1.txt file2.txt`.\n\nWhen to use? Ideal for quickly viewing small files: config files, code, notes. But not good for large files — everything prints at once. For large files use `less` (next lesson).',
        },
        examples: [
          { cmd: 'cat readme.txt', desc: { uz: 'Fayl mazmunini ko\'rsatadi', en: 'Shows file content' } },
        ],
        steps: [{
          id: 'cat-1',
          instruction: { uz: '`readme.txt` faylini o\'qing:', en: 'Read the `readme.txt` file:' },
          expectedCommands: ['cat readme.txt'],
          successMessage: { uz: 'Fayl mazmunini o\'qidingiz!', en: 'You read the file content!' },
        }],
      },
      {
        id: 'head-tail',
        title: { uz: 'head va tail — Qism o\'qish', en: 'head and tail — Read parts' },
        description: { uz: 'Faylning boshi yoki oxirini ko\'rsatish', en: 'Show the start or end of a file' },
        command: 'head',
        theory: {
          uz: 'Katta fayllarda butun mazmunni o\'qish shart emas. `head` va `tail` faqat kerakli qismni ko\'rsatadi.\n\n• `head fayl` — faylning birinchi 10 qatorini\n• `tail fayl` — oxirgi 10 qatorini\n• `head -n 5 fayl` — birinchi 5 qatorni (istalgan son)\n• `tail -n 20 fayl` — oxirgi 20 qatorni\n\nEng ko\'p ishlatiladigan joy: **log fayllar**. Server logi minglab qatordan iborat bo\'lishi mumkin. `tail -f app.log` — eng yangi yozuvlarni jonli kuzatish uchun ishlatiladi (real vaqtda).',
          en: 'For large files you do not need to read everything. `head` and `tail` show only the part you need.\n\n• `head file` — first 10 lines of the file\n• `tail file` — last 10 lines\n• `head -n 5 file` — first 5 lines (any number)\n• `tail -n 20 file` — last 20 lines\n\nMost common use: **log files**. A server log can have thousands of lines. `tail -f app.log` is used to watch the newest entries live (in real time).',
        },
        examples: [
          { cmd: 'head readme.txt', desc: { uz: 'Birinchi qatorlar', en: 'First lines' } },
          { cmd: 'tail -n 2 readme.txt', desc: { uz: 'Oxirgi 2 qator', en: 'Last 2 lines' } },
        ],
        steps: [
          {
            id: 'head-1',
            instruction: { uz: '`readme.txt` ning birinchi 2 qatorini ko\'ring:', en: 'See the first 2 lines of `readme.txt`:' },
            expectedCommands: ['head -n 2 readme.txt', 'head readme.txt'],
            hint: { uz: 'head -n 2 readme.txt', en: 'head -n 2 readme.txt' },
            successMessage: { uz: 'Birinchi qatorlar ko\'rsatildi!', en: 'First lines shown!' },
          },
          {
            id: 'tail-1',
            instruction: { uz: 'Endi oxirgi qatorni ko\'ring:', en: 'Now see the last line:' },
            expectedCommands: ['tail -n 1 readme.txt', 'tail readme.txt'],
            hint: { uz: 'tail -n 1 readme.txt', en: 'tail -n 1 readme.txt' },
            successMessage: { uz: 'Oxirgi qatorlar ko\'rsatildi!', en: 'Last lines shown!' },
          },
        ],
      },
      {
        id: 'wc',
        title: { uz: 'wc — Hisoblash', en: 'wc — Count' },
        description: { uz: 'Qator, so\'z, belgilarni sanash', en: 'Count lines, words, characters' },
        command: 'wc',
        theory: {
          uz: '`wc` (word count) — faylning qatorlari, so\'zlari va belgilarini sanaydi.\n\n• `wc fayl` — uchchalasini ham: qator, so\'z, belgi\n• `wc -l fayl` — faqat qatorlar soni (lines)\n• `wc -w fayl` — faqat so\'zlar soni (words)\n• `wc -c fayl` — faqat belgilar soni (characters)\n\nQayerda kerak? Loyihada nechta qator kod borligini bilish, log faylda nechta xato yozilganini sanash. Ayniqsa `pipe` bilan kuchli: `cat fayl | wc -l` yoki `ls | wc -l` (papkadagi fayllar sonini sanaydi).',
          en: '`wc` (word count) counts the lines, words, and characters of a file.\n\n• `wc file` — all three: lines, words, characters\n• `wc -l file` — only line count\n• `wc -w file` — only word count\n• `wc -c file` — only character count\n\nWhere useful? Knowing how many lines of code a project has, counting errors in a log file. Especially powerful with `pipe`: `cat file | wc -l` or `ls | wc -l` (counts files in a folder).',
        },
        examples: [
          { cmd: 'wc -l readme.txt', desc: { uz: 'Qatorlar soni', en: 'Line count' } },
          { cmd: 'wc readme.txt', desc: { uz: 'Qator, so\'z, belgi', en: 'Lines, words, chars' } },
        ],
        steps: [{
          id: 'wc-1',
          instruction: { uz: '`readme.txt` da nechta qator borligini sanang:', en: 'Count the lines in `readme.txt`:' },
          expectedCommands: ['wc -l readme.txt', 'wc readme.txt'],
          hint: { uz: 'wc -l readme.txt', en: 'wc -l readme.txt' },
          successMessage: { uz: 'Qatorlar soni hisoblandi!', en: 'Lines counted!' },
          visualEffect: 'pipe',
        }],
      },
    ],
  },

  /* ═══════════════════ 5. SEARCH ═══════════════════ */
  {
    id: 'search',
    title: { uz: 'Qidiruv', en: 'Search' },
    icon: '05',
    color: '#ff7eb6',
    lessons: [
      {
        id: 'find',
        title: { uz: 'find — Fayl qidirish', en: 'find — Find files' },
        description: { uz: 'Fayllarni nom yoki turi bo\'yicha topish', en: 'Find files by name or type' },
        command: 'find',
        theory: {
          uz: '`find` — fayl tizimida fayllarni qidiradi. Bu eng kuchli, lekin biroz murakkab buyruqlardan biri.\n\nFormat: `find qayerda shart`\n\n• `find . -name "*.txt"` — joriy papkadan (`.`) barcha `.txt` fayllarni topadi\n• `find . -type d` — faqat papkalarni (`d` = directory)\n• `find . -type f` — faqat fayllarni (`f` = file)\n• `find /home -name "config*"` — `/home` dan "config" bilan boshlanadiganlarni\n\n`*` belgisi — "istalgan narsa" degani (wildcard). `*.txt` = istalgan nom, lekin `.txt` bilan tugaydigan.\n\n`find` ichma-ich papkalarga ham kiradi — butun daraxtni qidiradi.',
          en: '`find` searches for files in the file system. It is one of the most powerful but slightly complex commands.\n\nFormat: `find where condition`\n\n• `find . -name "*.txt"` — finds all `.txt` files from the current folder (`.`)\n• `find . -type d` — only folders (`d` = directory)\n• `find . -type f` — only files (`f` = file)\n• `find /home -name "config*"` — things starting with "config" from `/home`\n\nThe `*` symbol means "anything" (wildcard). `*.txt` = any name, but ending with `.txt`.\n\n`find` also goes into nested folders — it searches the whole tree.',
        },
        examples: [
          { cmd: 'find . -name "*.txt"', desc: { uz: 'Barcha .txt fayllar', en: 'All .txt files' } },
          { cmd: 'find . -type d', desc: { uz: 'Faqat papkalar', en: 'Only directories' } },
        ],
        steps: [
          {
            id: 'find-1',
            instruction: { uz: 'Barcha `.txt` fayllarni toping:', en: 'Find all `.txt` files:' },
            expectedCommands: ['find . -name "*.txt"', 'find . -name *.txt'],
            hint: { uz: 'find . -name "*.txt"', en: 'find . -name "*.txt"' },
            successMessage: { uz: '.txt fayllar topildi!', en: '.txt files found!' },
            visualEffect: 'filesystem',
          },
          {
            id: 'find-2',
            instruction: { uz: 'Endi faqat papkalarni toping:', en: 'Now find only directories:' },
            expectedCommands: ['find . -type d'],
            hint: { uz: 'find . -type d (d = directory)', en: 'find . -type d (d = directory)' },
            successMessage: { uz: 'Barcha papkalar topildi!', en: 'All directories found!' },
          },
        ],
      },
      {
        id: 'tree',
        title: { uz: 'tree — Daraxt ko\'rinishi', en: 'tree — Tree view' },
        description: { uz: 'Papka tuzilmasini daraxt shaklida', en: 'Show folder structure as a tree' },
        command: 'tree',
        theory: {
          uz: '`tree` — papka tuzilmasini chiroyli daraxt shaklida ko\'rsatadi. `ls` faqat bitta papkani ko\'rsatsa, `tree` butun ichma-ich tuzilmani bir qarashda ko\'rsatadi.\n\nMisol natija:\n```\n.\n├── readme.txt\n├── projects\n│   ├── hello.sh\n│   └── main.py\n└── downloads\n```\n\nBu loyiha tuzilmasini tushunish uchun juda qulay. Yangi loyihaga kirganingizda `tree` bilan butun strukturani ko\'rasiz.\n\nEslatma: `tree` ba\'zi tizimlarda alohida o\'rnatilishi kerak (`apt install tree`), lekin bu yerda tayyor.',
          en: '`tree` shows the folder structure as a nice tree. While `ls` shows only one folder, `tree` shows the entire nested structure at a glance.\n\nExample output:\n```\n.\n├── readme.txt\n├── projects\n│   ├── hello.sh\n│   └── main.py\n└── downloads\n```\n\nThis is very handy for understanding a project structure. When entering a new project, `tree` shows you the whole structure.\n\nNote: `tree` sometimes needs separate installation (`apt install tree`), but here it is ready.',
        },
        examples: [
          { cmd: 'tree', desc: { uz: 'Joriy papka daraxti', en: 'Current folder tree' } },
        ],
        steps: [{
          id: 'tree-1',
          instruction: { uz: 'Papka tuzilmasini daraxt shaklida ko\'ring:', en: 'View the folder structure as a tree:' },
          expectedCommands: ['tree'],
          successMessage: { uz: 'Butun tuzilma daraxt shaklida ko\'rindi!', en: 'The whole structure shown as a tree!' },
          visualEffect: 'filesystem',
        }],
      },
      {
        id: 'grep',
        title: { uz: 'grep — Matn qidirish', en: 'grep — Search text' },
        description: { uz: 'Fayl ichidan matn qidirish', en: 'Search for text inside files' },
        command: 'grep',
        theory: {
          uz: '`grep` — fayl ichidan matn qidiradi. Bu juda muhim buyruq, har bir backend developer kuniga necha marta ishlatadi.\n\nFormat: `grep "qidiriladigan" fayl`\n\n• `grep "error" app.log` — log faylda "error" so\'zi bor qatorlarni topadi\n• `grep -i "Error" fayl` — katta-kichik harfga e\'tibor bermaydi (-i = ignore case)\n• `grep -n "TODO" kod.py` — qator raqami bilan ko\'rsatadi (-n)\n\nEng kuchli tomoni — `pipe` bilan birga: `ps aux | grep node` — ishlab turgan jarayonlardan faqat "node" borlarini ko\'rsatadi. `history | grep git` — tarixdan git buyruqlarini topadi.',
          en: '`grep` searches for text inside files. This is a very important command; every backend developer uses it many times a day.\n\nFormat: `grep "search" file`\n\n• `grep "error" app.log` — finds lines containing "error" in a log file\n• `grep -i "Error" file` — ignores case (-i = ignore case)\n• `grep -n "TODO" code.py` — shows with line numbers (-n)\n\nIts strongest use is with `pipe`: `ps aux | grep node` — shows only running processes containing "node". `history | grep git` — finds git commands in history.',
        },
        examples: [
          { cmd: 'grep "Welcome" readme.txt', desc: { uz: 'Matn qidiradi', en: 'Searches text' } },
          { cmd: 'history | grep git', desc: { uz: 'Pipe bilan', en: 'With pipe' } },
        ],
        steps: [{
          id: 'grep-1',
          instruction: { uz: '`readme.txt` da "Welcome" so\'zini qidiring:', en: 'Search for "Welcome" in `readme.txt`:' },
          expectedCommands: ['grep "Welcome" readme.txt', 'grep Welcome readme.txt'],
          hint: { uz: 'grep "Welcome" readme.txt', en: 'grep "Welcome" readme.txt' },
          successMessage: { uz: 'Matn topildi! O\'sha qator ko\'rsatildi.', en: 'Text found! The matching line is shown.' },
        }],
      },
    ],
  },

  /* ═══════════════════ 6. PIPE & REDIRECT ═══════════════════ */
  {
    id: 'pipe',
    title: { uz: 'Pipe va Redirect', en: 'Pipe & Redirect' },
    icon: '06',
    color: '#39c5cf',
    lessons: [
      {
        id: 'redirect',
        title: { uz: '> — Faylga yozish', en: '> — Write to file' },
        description: { uz: 'Buyruq natijasini faylga yo\'naltirish', en: 'Redirect command output to a file' },
        command: '>',
        theory: {
          uz: 'Odatda buyruq natijasi ekranga chiqadi. Lekin `>` belgisi yordamida uni **faylga** yozish mumkin. Bu "redirect" (yo\'naltirish) deyiladi.\n\n• `echo "salom" > fayl.txt` — "salom" ni faylga yozadi (eski mazmunni o\'chirib)\n• `echo "yana" >> fayl.txt` — faylga **qo\'shib** yozadi (eski mazmun saqlanadi)\n\nFarqni eslab qoling:\n• `>` — faylni qaytadan yozadi (eski mazmun yo\'qoladi!)\n• `>>` — faylga qo\'shadi (eski mazmun saqlanadi)\n\nQayerda kerak? Log yozish, natijalarni saqlash, konfiguratsiya yaratish. Masalan `ls > fayllar.txt` — papkadagi fayllar ro\'yxatini faylga saqlaydi.',
          en: 'Normally command output goes to the screen. But with the `>` symbol you can write it to a **file**. This is called "redirect".\n\n• `echo "hi" > file.txt` — writes "hi" to the file (erasing old content)\n• `echo "more" >> file.txt` — **appends** to the file (old content kept)\n\nRemember the difference:\n• `>` — rewrites the file (old content is lost!)\n• `>>` — appends to the file (old content kept)\n\nWhere useful? Logging, saving results, creating configs. For example `ls > files.txt` saves the folder listing to a file.',
        },
        examples: [
          { cmd: 'echo "salom" > greet.txt', desc: { uz: 'Faylga yozadi', en: 'Writes to file' } },
          { cmd: 'echo "yana" >> greet.txt', desc: { uz: 'Faylga qo\'shadi', en: 'Appends to file' } },
        ],
        steps: [
          {
            id: 'redir-1',
            instruction: { uz: '"Salom" matnini `greet.txt` fayliga yozing:', en: 'Write "Salom" to a file `greet.txt`:' },
            expectedCommands: ['echo "Salom" > greet.txt', 'echo Salom > greet.txt'],
            hint: { uz: 'echo "Salom" > greet.txt', en: 'echo "Salom" > greet.txt' },
            successMessage: { uz: 'Matn faylga yozildi!', en: 'Text written to the file!' },
            visualEffect: 'pipe',
          },
          {
            id: 'redir-2',
            instruction: { uz: 'Endi yozilganini tekshiring:', en: 'Now verify what was written:' },
            expectedCommands: ['cat greet.txt'],
            hint: { uz: 'cat greet.txt', en: 'cat greet.txt' },
            successMessage: { uz: 'Fayl mazmunini ko\'rdingiz — matn saqlangan!', en: 'You saw the content — the text was saved!' },
          },
        ],
      },
      {
        id: 'pipe-cmd',
        title: { uz: '| — Pipe (quvur)', en: '| — Pipe' },
        description: { uz: 'Bir buyruq natijasini boshqasiga uzatish', en: 'Pass one command\'s output to another' },
        command: '|',
        theory: {
          uz: '`|` (pipe — quvur) — Linux\'ning eng kuchli g\'oyasi. U bir buyruqning natijasini boshqa buyruqqa "uzatadi".\n\nTasavvur qiling: birinchi buyruq suv quyadi, pipe esa uni quvur orqali ikkinchi buyruqqa olib boradi.\n\nMisollar:\n• `cat fayl.txt | wc -l` — faylni o\'qiydi, natijani wc ga uzatadi (qatorlarni sanaydi)\n• `ls | grep .txt` — fayllar ro\'yxatidan faqat .txt borlarini ko\'rsatadi\n• `ps aux | grep node` — jarayonlardan node bor qatorni topadi\n• `history | grep git` — buyruqlar tarixidan git larni topadi\n\nBir nechta pipe ulash mumkin: `cat fayl | grep error | wc -l` — faylda nechta "error" borligini sanaydi. Bu Linux falsafasi: kichik buyruqlarni birlashtirib, kuchli natija olish.',
          en: '`|` (pipe) is Linux\'s most powerful idea. It "passes" the output of one command to another.\n\nImagine: the first command pours water, the pipe carries it through a tube to the second command.\n\nExamples:\n• `cat file.txt | wc -l` — reads the file, passes output to wc (counts lines)\n• `ls | grep .txt` — shows only .txt entries from the file list\n• `ps aux | grep node` — finds the node line among processes\n• `history | grep git` — finds git commands in history\n\nYou can chain multiple pipes: `cat file | grep error | wc -l` — counts how many "error" lines are in the file. This is the Linux philosophy: combine small commands to get a powerful result.',
        },
        examples: [
          { cmd: 'cat readme.txt | wc -l', desc: { uz: 'O\'qib, qatorlarni sanaydi', en: 'Read, then count lines' } },
          { cmd: 'ls | grep txt', desc: { uz: 'Ro\'yxatdan filtrlaydi', en: 'Filters the list' } },
        ],
        steps: [
          {
            id: 'pipe-1',
            instruction: { uz: '`readme.txt` ni o\'qib, qatorlarini sanang (pipe bilan):', en: 'Read `readme.txt` and count its lines (with pipe):' },
            expectedCommands: ['cat readme.txt | wc -l'],
            hint: { uz: 'cat readme.txt | wc -l', en: 'cat readme.txt | wc -l' },
            successMessage: { uz: 'Pipe ishladi! cat natijasi wc ga uzatildi.', en: 'Pipe worked! cat output was passed to wc.' },
            visualEffect: 'pipe',
          },
          {
            id: 'pipe-2',
            instruction: { uz: 'Endi fayllar ro\'yxatidan faqat papkalarni filtrlang:', en: 'Now filter only folders from the file list:' },
            expectedCommands: ['ls | grep projects', 'ls -la | grep projects', 'ls | grep downloads'],
            hint: { uz: 'ls | grep projects', en: 'ls | grep projects' },
            successMessage: { uz: 'Pipe va grep birga ishladi!', en: 'Pipe and grep worked together!' },
            visualEffect: 'pipe',
          },
        ],
      },
    ],
  },

  /* ═══════════════════ 7. PERMISSIONS ═══════════════════ */
  {
    id: 'permissions',
    title: { uz: 'Ruxsatlar', en: 'Permissions' },
    icon: '07',
    color: '#ffa657',
    lessons: [
      {
        id: 'permissions-view',
        title: { uz: 'Ruxsatlarni tushunish', en: 'Understanding permissions' },
        description: { uz: 'Fayl ruxsatlarini o\'qish', en: 'Read file permissions' },
        command: 'ls -l',
        theory: {
          uz: 'Linux\'da har bir faylning **ruxsatlari** (permissions) bor — kim o\'qishi, yozishi yoki ishga tushirishi mumkinligini belgilaydi.\n\n`ls -l` da ruxsatlar shunday ko\'rinadi: `-rwxr-xr--`\n\nUni 4 qismga bo\'lib o\'qing:\n• Birinchi belgi: `-` (fayl) yoki `d` (papka)\n• Keyingi 3 ta (`rwx`): **egasi** (owner) huquqlari\n• Keyingi 3 ta (`r-x`): **guruh** (group) huquqlari\n• Oxirgi 3 ta (`r--`): **boshqalar** (others) huquqlari\n\nHar bir harf:\n• `r` (read) — o\'qish\n• `w` (write) — yozish/o\'zgartirish\n• `x` (execute) — ishga tushirish\n• `-` — bu huquq yo\'q\n\nMisol: `-rwxr-xr--` = egasi hammasini qila oladi (rwx), guruh o\'qiy va ishga tushira oladi (r-x), boshqalar faqat o\'qiy oladi (r--).',
          en: 'In Linux every file has **permissions** — defining who can read, write, or execute it.\n\nIn `ls -l` permissions look like this: `-rwxr-xr--`\n\nRead it in 4 parts:\n• First character: `-` (file) or `d` (directory)\n• Next 3 (`rwx`): **owner** rights\n• Next 3 (`r-x`): **group** rights\n• Last 3 (`r--`): **others** rights\n\nEach letter:\n• `r` (read)\n• `w` (write/modify)\n• `x` (execute)\n• `-` — this right is absent\n\nExample: `-rwxr-xr--` = owner can do everything (rwx), group can read and execute (r-x), others can only read (r--).',
        },
        examples: [
          { cmd: 'ls -l projects/hello.sh', desc: { uz: 'Faylning ruxsatlarini ko\'radi', en: 'Shows file permissions' } },
        ],
        steps: [{
          id: 'perm-view-1',
          instruction: { uz: '`projects/hello.sh` faylining ruxsatlarini ko\'ring:', en: 'View the permissions of `projects/hello.sh`:' },
          expectedCommands: ['ls -l projects/hello.sh', 'ls -l projects/', 'ls -l projects'],
          hint: { uz: 'ls -l projects/hello.sh', en: 'ls -l projects/hello.sh' },
          successMessage: { uz: 'Ruxsatlarni ko\'rdingiz! O\'ng paneldagi vizualga qarang.', en: 'You saw the permissions! Look at the visual on the right.' },
          visualEffect: 'permissions',
        }],
      },
      {
        id: 'chmod',
        title: { uz: 'chmod — Ruxsatlarni o\'zgartirish', en: 'chmod — Change permissions' },
        description: { uz: 'Fayl ruxsatlarini sozlash', en: 'Set file permissions' },
        command: 'chmod',
        theory: {
          uz: '`chmod` (change mode) — fayl ruxsatlarini o\'zgartiradi. Ruxsatlarni raqam bilan berish eng oson usul.\n\nHar bir huquq raqamga ega:\n• `r` (read) = 4\n• `w` (write) = 2\n• `x` (execute) = 1\n\nUlarni qo\'shib, har bir guruh uchun bitta raqam olamiz:\n• `7` = 4+2+1 = rwx (hammasi)\n• `5` = 4+0+1 = r-x (o\'qish + ishga tushirish)\n• `6` = 4+2+0 = rw- (o\'qish + yozish)\n• `4` = 4+0+0 = r-- (faqat o\'qish)\n\n`chmod 754 fayl` degani:\n• 7 (egasi) = rwx\n• 5 (guruh) = r-x\n• 4 (boshqalar) = r--\n\nEng ko\'p ishlatiladigan:\n• `755` — skriptlar va papkalar uchun (hamma o\'qiy/ishlata oladi)\n• `644` — oddiy fayllar uchun (egasi yozadi, boshqalar o\'qiydi)\n• `chmod +x fayl.sh` — faylni ishga tushiriladigan qiladi\n\nO\'ng paneldagi kalkulyatorda harflarni bosib, raqamni ko\'ring!',
          en: '`chmod` (change mode) changes file permissions. Setting permissions by number is the easiest way.\n\nEach right has a number:\n• `r` (read) = 4\n• `w` (write) = 2\n• `x` (execute) = 1\n\nAdding them gives one digit per group:\n• `7` = 4+2+1 = rwx (all)\n• `5` = 4+0+1 = r-x (read + execute)\n• `6` = 4+2+0 = rw- (read + write)\n• `4` = 4+0+0 = r-- (read only)\n\n`chmod 754 file` means:\n• 7 (owner) = rwx\n• 5 (group) = r-x\n• 4 (others) = r--\n\nMost common:\n• `755` — for scripts and folders (everyone can read/run)\n• `644` — for normal files (owner writes, others read)\n• `chmod +x file.sh` — makes a file executable\n\nUse the calculator on the right — click the letters and watch the number!',
        },
        examples: [
          { cmd: 'chmod 755 hello.sh', desc: { uz: 'Skript uchun', en: 'For a script' } },
          { cmd: 'chmod 644 notes.txt', desc: { uz: 'Oddiy fayl uchun', en: 'For a normal file' } },
        ],
        steps: [{
          id: 'chmod-1',
          instruction: { uz: '`projects/hello.sh` ni ishga tushiriladigan qiling (755):', en: 'Make `projects/hello.sh` executable (755):' },
          expectedCommands: ['chmod 755 projects/hello.sh'],
          hint: { uz: 'chmod 755 projects/hello.sh', en: 'chmod 755 projects/hello.sh' },
          successMessage: { uz: 'Ruxsatlar o\'zgartirildi! Endi -rwxr-xr-x. ls -l bilan tekshiring.', en: 'Permissions changed! Now -rwxr-xr-x. Check with ls -l.' },
          visualEffect: 'permissions',
        }],
      },
    ],
  },

  /* ═══════════════════ 8. PROCESSES ═══════════════════ */
  {
    id: 'processes',
    title: { uz: 'Jarayonlar', en: 'Processes' },
    icon: '08',
    color: '#db61a2',
    lessons: [
      {
        id: 'ps',
        title: { uz: 'ps — Jarayonlar ro\'yxati', en: 'ps — Process list' },
        description: { uz: 'Ishlab turgan jarayonlarni ko\'rish', en: 'See running processes' },
        command: 'ps',
        theory: {
          uz: '**Jarayon** (process) — ishlab turgan dastur. Brauzer, terminal, server — har biri jarayon. Har bir jarayonning **PID** (Process ID) — noyob raqami bor.\n\n`ps` buyrug\'i ishlab turgan jarayonlarni ko\'rsatadi:\n• `ps` — faqat sizning jarayonlaringiz\n• `ps aux` — tizimdagi BARCHA jarayonlar (eng ko\'p ishlatiladi)\n\n`ps aux` natijasidagi ustunlar:\n• USER — jarayon egasi\n• PID — jarayon raqami\n• %CPU — protsessor ishlatilishi\n• %MEM — xotira ishlatilishi\n• COMMAND — qaysi dastur\n\nBackend developer uchun muhim: server (node, java) ishlab turibdimi, qancha xotira yeyapti — `ps aux | grep java` bilan ko\'rish mumkin.',
          en: 'A **process** is a running program. Browser, terminal, server — each is a process. Every process has a **PID** (Process ID) — a unique number.\n\nThe `ps` command shows running processes:\n• `ps` — only your processes\n• `ps aux` — ALL processes in the system (most used)\n\nColumns in `ps aux`:\n• USER — process owner\n• PID — process number\n• %CPU — processor usage\n• %MEM — memory usage\n• COMMAND — which program\n\nImportant for backend developers: is the server (node, java) running, how much memory it uses — check with `ps aux | grep java`.',
        },
        examples: [
          { cmd: 'ps aux', desc: { uz: 'Barcha jarayonlar', en: 'All processes' } },
          { cmd: 'ps aux | grep node', desc: { uz: 'Faqat node jarayonlari', en: 'Only node processes' } },
        ],
        steps: [{
          id: 'ps-1',
          instruction: { uz: 'Barcha jarayonlarni ko\'ring:', en: 'View all processes:' },
          expectedCommands: ['ps aux', 'ps'],
          hint: { uz: 'ps aux', en: 'ps aux' },
          successMessage: { uz: 'Jarayonlar ko\'rindi! PID — har birining raqami.', en: 'Processes listed! PID is each one\'s number.' },
          visualEffect: 'process',
        }],
      },
      {
        id: 'kill',
        title: { uz: 'kill — Jarayonni to\'xtatish', en: 'kill — Stop a process' },
        description: { uz: 'Jarayonni PID orqali to\'xtatish', en: 'Stop a process by PID' },
        command: 'kill',
        theory: {
          uz: '`kill` — jarayonni to\'xtatadi. Nomi qo\'rqinchli, lekin oddiy: u jarayonga "to\'xta" signalini yuboradi.\n\nFormat: `kill PID` — bu yerda PID jarayon raqami (`ps aux` dan olinadi).\n\n• `kill 1234` — 1234-jarayonni muloyim to\'xtatadi (dastur o\'zini tozalashga ulguradi)\n• `kill -9 1234` — majburan, darhol to\'xtatadi (dastur osilib qolganda)\n\n`-9` — eng kuchli signal (SIGKILL). Jarayon javob bermayotganda ishlatiladi. Lekin ehtiyot bo\'ling: dastur ma\'lumotni saqlashga ulgurmaydi.\n\nMuhim: faqat **mavjud** PID ni to\'xtata olasiz. Bo\'lmagan raqamni yozsangiz, xato beradi: "No such process". Shuning uchun avval `ps aux` bilan PID ni toping.',
          en: '`kill` stops a process. The name sounds scary but it is simple: it sends a "stop" signal to the process.\n\nFormat: `kill PID` — where PID is the process number (from `ps aux`).\n\n• `kill 1234` — gently stops process 1234 (the program can clean up)\n• `kill -9 1234` — forcibly, immediately stops it (when a program is frozen)\n\n`-9` is the strongest signal (SIGKILL). Used when a process is not responding. But be careful: the program cannot save data.\n\nImportant: you can only kill an **existing** PID. If you type a non-existent number, you get an error: "No such process". So first find the PID with `ps aux`.',
        },
        examples: [
          { cmd: 'ps aux', desc: { uz: 'Avval PID ni toping', en: 'First find the PID' } },
          { cmd: 'kill -9 2341', desc: { uz: 'Jarayonni majburan to\'xtatadi', en: 'Force-stops the process' } },
        ],
        steps: [
          {
            id: 'kill-1',
            instruction: { uz: 'Avval jarayonlarni ko\'ring va PID raqamlarni toping:', en: 'First view processes and find the PIDs:' },
            expectedCommands: ['ps aux', 'ps'],
            hint: { uz: 'ps aux', en: 'ps aux' },
            successMessage: { uz: 'PID raqamlarni ko\'rdingiz. Endi birini to\'xtatamiz.', en: 'You saw the PIDs. Now let\'s stop one.' },
            visualEffect: 'process',
          },
          {
            id: 'kill-2',
            instruction: { uz: 'node serverini (PID 2341) to\'xtating:', en: 'Stop the node server (PID 2341):' },
            expectedCommands: ['kill -9 2341', 'kill 2341'],
            hint: { uz: 'kill -9 2341 (ro\'yxatdagi mavjud PID)', en: 'kill -9 2341 (an existing PID from the list)' },
            successMessage: { uz: 'Jarayon to\'xtatildi! ps aux bilan tekshiring — endi yo\'q.', en: 'Process stopped! Check with ps aux — it\'s gone now.' },
            visualEffect: 'process',
          },
        ],
      },
    ],
  },

  /* ═══════════════════ 9. TMUX ═══════════════════ */
  {
    id: 'tmux',
    title: { uz: 'Tmux', en: 'Tmux' },
    icon: '09',
    color: '#5bc873',
    lessons: [
      {
        id: 'tmux-intro',
        title: { uz: 'Tmux nima?', en: 'What is Tmux?' },
        description: { uz: 'Terminal multiplexer bilan tanishish', en: 'Introduction to the terminal multiplexer' },
        command: 'tmux',
        theory: {
          uz: '**Tmux** (terminal multiplexer) — bitta terminal oynasida bir nechta "ish stoli" ochish imkonini beradi. Backend developer uchun bu majburiy ko\'nikma.\n\nNega kerak?\n1. **Bir nechta panel**: bitta ekranda serverni ishga tushirib, yonida kod yozish\n2. **Sessiya saqlash**: serverdan uzilsangiz ham, tmux ishlashda davom etadi. Qayta ulanib, ishni davom ettirasiz\n3. **Uzoq jarayonlar**: server yoki build jarayonini ishga tushirib, terminalni yopsangiz ham to\'xtamaydi\n\nEng muhim tushuncha — **prefix tugma**: `Ctrl + B`. Tmux\'da har bir buyruq shu tugmadan boshlanadi. Avval `Ctrl+B` bosasiz, qo\'yib yuborasiz, keyin buyruq tugmasini bosasiz.\n\nMasalan: `Ctrl+B` keyin `D` = sessiyadan chiqish. `Ctrl+B` keyin `%` = ekranni bo\'lish.',
          en: '**Tmux** (terminal multiplexer) lets you open several "desktops" in one terminal window. For a backend developer this is an essential skill.\n\nWhy needed?\n1. **Multiple panes**: run a server on one screen while writing code beside it\n2. **Session persistence**: even if disconnected from the server, tmux keeps running. Reconnect and continue\n3. **Long processes**: start a server or build and it won\'t stop even if you close the terminal\n\nThe key concept is the **prefix key**: `Ctrl + B`. In tmux every command starts with this key. First press `Ctrl+B`, release, then press the command key.\n\nFor example: `Ctrl+B` then `D` = detach from session. `Ctrl+B` then `%` = split the screen.',
        },
        examples: [
          { cmd: 'tmux new -s backend', desc: { uz: 'Yangi sessiya ochadi', en: 'Opens a new session' } },
          { cmd: 'tmux ls', desc: { uz: 'Sessiyalarni ko\'rsatadi', en: 'Lists sessions' } },
        ],
        steps: [{
          id: 'tmux-intro-1',
          instruction: { uz: '`backend` nomli yangi tmux sessiya oching:', en: 'Open a new tmux session named `backend`:' },
          expectedCommands: ['tmux new -s backend', 'tmux new-session -s backend'],
          hint: { uz: 'tmux new -s backend', en: 'tmux new -s backend' },
          successMessage: { uz: 'Sessiya ochildi! Pastda yashil status panelni ko\'ring.', en: 'Session opened! See the green status bar below.' },
          visualEffect: 'tmux',
        }],
      },
      {
        id: 'tmux-split',
        title: { uz: 'Ekranni bo\'lish', en: 'Split the screen' },
        description: { uz: 'Panellarni vertikal va gorizontal bo\'lish', en: 'Split panes vertically and horizontally' },
        command: 'Ctrl+B %',
        theory: {
          uz: 'Tmux\'ning eng kuchli xususiyati — ekranni **panellarga** bo\'lish. Bir vaqtda bir nechta narsani ko\'rish mumkin.\n\nIkki xil bo\'lish:\n• `Ctrl+B` keyin `%` — **vertikal** bo\'lish (chap | o\'ng)\n• `Ctrl+B` keyin `"` — **gorizontal** bo\'lish (yuqori / quyi)\n\nPanellar orasida yurish:\n• `Ctrl+B` keyin o\'q tugmalari (← → ↑ ↓)\n\nMisol ish jarayoni: chap panelda server ishlaydi (`npm run dev`), o\'ng panelda kod tahrirlaysiz, pastki panelda git buyruqlarini yozasiz. Hammasi bitta ekranda!\n\nEslatma: bu yerda `Ctrl+B` ni klaviaturada bosing — tmux paneli pastda bo\'linishini ko\'rasiz. (Brauzer yorliqlari bloklangan.)',
          en: 'Tmux\'s most powerful feature is splitting the screen into **panes**. You can view several things at once.\n\nTwo split types:\n• `Ctrl+B` then `%` — **vertical** split (left | right)\n• `Ctrl+B` then `"` — **horizontal** split (top / bottom)\n\nMove between panes:\n• `Ctrl+B` then arrow keys (← → ↑ ↓)\n\nExample workflow: server runs in the left pane (`npm run dev`), you edit code in the right pane, run git commands in the bottom pane. All on one screen!\n\nNote: here press `Ctrl+B` on the keyboard — you\'ll see the tmux pane split below. (Browser shortcuts are blocked.)',
        },
        examples: [
          { cmd: 'Ctrl+B  then  %', desc: { uz: 'Vertikal bo\'lish', en: 'Vertical split' } },
          { cmd: 'Ctrl+B  then  "', desc: { uz: 'Gorizontal bo\'lish', en: 'Horizontal split' } },
        ],
        steps: [
          {
            id: 'tmux-split-1',
            instruction: { uz: 'Ekranni vertikal bo\'ling: `Ctrl+B` bosing, qo\'yib yuboring, keyin `%` bosing.', en: 'Split vertically: press `Ctrl+B`, release, then press `%`.' },
            expectedCommands: ['ctrl+b %'],
            hint: { uz: 'Avval Ctrl+B, keyin alohida % belgisi (Shift+5)', en: 'First Ctrl+B, then the % symbol separately (Shift+5)' },
            successMessage: { uz: 'Ekran ikkiga bo\'lindi! Chap va o\'ng panel.', en: 'Screen split in two! Left and right panes.' },
            visualEffect: 'tmux',
          },
          {
            id: 'tmux-split-2',
            instruction: { uz: 'Endi gorizontal bo\'ling: `Ctrl+B` keyin `"` (qo\'shtirnoq).', en: 'Now split horizontally: `Ctrl+B` then `"` (quote).' },
            expectedCommands: ['ctrl+b "'],
            hint: { uz: 'Ctrl+B keyin " (Shift+\')', en: 'Ctrl+B then " (Shift+\')' },
            successMessage: { uz: 'Yana bir panel qo\'shildi!', en: 'Another pane added!' },
            visualEffect: 'tmux',
          },
        ],
      },
      {
        id: 'tmux-detach',
        title: { uz: 'Sessiyadan chiqish va qaytish', en: 'Detach and reattach' },
        description: { uz: 'Sessiyani saqlab chiqish', en: 'Leave a session while keeping it alive' },
        command: 'Ctrl+B D',
        theory: {
          uz: 'Tmux\'ning eng sehrli xususiyati — **detach** (uzilish). Sessiyadan chiqasiz, lekin u **ishlashda davom etadi**.\n\nTasavvur qiling: serverda dastur ishga tushirdingiz. Internetdan uzildingiz. Oddiy holda dastur to\'xtardi. Lekin tmux\'da — yo\'q! U ishlashda davom etadi.\n\nBuyruqlar:\n• `Ctrl+B` keyin `D` — **detach** (sessiyadan chiqish, lekin u tirik qoladi)\n• `tmux ls` — barcha sessiyalarni ko\'rish\n• `tmux attach -t backend` — `backend` sessiyasiga qayta ulanish\n\nIsh jarayoni: serverga SSH bilan kirasiz → `tmux new -s server` → dastur ishga tushirasiz → `Ctrl+B D` (chiqasiz) → kompyuterni o\'chirasiz → ertasi kuni qaytib `tmux attach -t server` → hammasi joyida ishlab turibdi!',
          en: 'Tmux\'s most magical feature is **detach**. You leave the session, but it **keeps running**.\n\nImagine: you started a program on a server. You got disconnected from the internet. Normally the program would stop. But in tmux — no! It keeps running.\n\nCommands:\n• `Ctrl+B` then `D` — **detach** (leave the session, but it stays alive)\n• `tmux ls` — list all sessions\n• `tmux attach -t backend` — reattach to the `backend` session\n\nWorkflow: SSH into a server → `tmux new -s server` → start a program → `Ctrl+B D` (detach) → turn off your computer → next day reconnect with `tmux attach -t server` → everything still running!',
        },
        examples: [
          { cmd: 'Ctrl+B  then  D', desc: { uz: 'Sessiyadan chiqish', en: 'Detach from session' } },
          { cmd: 'tmux attach -t backend', desc: { uz: 'Qayta ulanish', en: 'Reattach' } },
        ],
        steps: [
          {
            id: 'tmux-detach-1',
            instruction: { uz: 'Sessiyadan chiqing: `Ctrl+B` keyin `D`.', en: 'Detach from the session: `Ctrl+B` then `D`.' },
            expectedCommands: ['ctrl+b d'],
            hint: { uz: 'Ctrl+B keyin d harfi', en: 'Ctrl+B then the d key' },
            successMessage: { uz: 'Sessiyadan chiqdingiz! U orqada ishlashda davom etyapti.', en: 'Detached! It keeps running in the background.' },
            visualEffect: 'tmux',
          },
          {
            id: 'tmux-detach-2',
            instruction: { uz: 'Sessiyaga qayta ulaning:', en: 'Reattach to the session:' },
            expectedCommands: ['tmux attach -t backend', 'tmux a -t backend', 'tmux attach'],
            hint: { uz: 'tmux attach -t backend', en: 'tmux attach -t backend' },
            successMessage: { uz: 'Sessiyaga qaytdingiz! Hammasi joyida.', en: 'Reattached! Everything is in place.' },
            visualEffect: 'tmux',
          },
        ],
      },
    ],
  },

  /* ═══════════════════ 10. SSH ═══════════════════ */
  {
    id: 'ssh',
    title: { uz: 'SSH', en: 'SSH' },
    icon: '10',
    color: '#d29922',
    lessons: [
      {
        id: 'ssh-keygen',
        title: { uz: 'ssh-keygen — Kalit yaratish', en: 'ssh-keygen — Generate keys' },
        description: { uz: 'SSH kalit juftini yaratish', en: 'Create an SSH key pair' },
        command: 'ssh-keygen',
        theory: {
          uz: '**SSH** (Secure Shell) — uzoqdagi serverga xavfsiz ulanish usuli. Backend developer serverlar bilan doim SSH orqali ishlaydi.\n\nSSH **kalit jufti** bilan ishlaydi:\n• **Maxfiy kalit** (private key) — sizda qoladi, hech kimga bermaysiz\n• **Ochiq kalit** (public key) — serverga qo\'yasiz\n\nBu qulf va kalit kabi: ochiq kalit — qulf (serverda), maxfiy kalit — uni ochadigan kalit (sizda). Parol yozmasdan, xavfsiz ulanasiz.\n\n`ssh-keygen -t ed25519` — zamonaviy, xavfsiz kalit yaratadi. `-t` turini bildiradi (ed25519 — eng yaxshi tanlov). `-C "email"` — izoh qo\'shadi.\n\nKalitlar `~/.ssh/` papkasida saqlanadi:\n• `id_ed25519` — maxfiy kalit\n• `id_ed25519.pub` — ochiq kalit\n\nYaratgandan keyin `ls -la ~/.ssh` bilan ko\'rishingiz mumkin. GitHub, GitLab va serverlarga ulanish uchun ochiq kalitni (.pub) joylashtrasiz.',
          en: '**SSH** (Secure Shell) is a way to securely connect to a remote server. Backend developers always work with servers via SSH.\n\nSSH uses a **key pair**:\n• **Private key** — stays with you, never shared\n• **Public key** — placed on the server\n\nIt is like a lock and key: the public key is the lock (on the server), the private key opens it (with you). You connect securely without typing a password.\n\n`ssh-keygen -t ed25519` creates a modern, secure key. `-t` is the type (ed25519 — the best choice). `-C "email"` adds a comment.\n\nKeys are saved in `~/.ssh/`:\n• `id_ed25519` — private key\n• `id_ed25519.pub` — public key\n\nAfter generating, view them with `ls -la ~/.ssh`. You place the public key (.pub) on GitHub, GitLab, and servers to connect.',
        },
        examples: [
          { cmd: 'ssh-keygen -t ed25519', desc: { uz: 'Kalit juftini yaratadi', en: 'Generates a key pair' } },
          { cmd: 'ls -la ~/.ssh', desc: { uz: 'Kalitlarni ko\'radi', en: 'Views the keys' } },
        ],
        steps: [
          {
            id: 'keygen-1',
            instruction: { uz: 'SSH kalit juftini yarating:', en: 'Generate an SSH key pair:' },
            expectedCommands: ['ssh-keygen -t ed25519 -c "email@example.com"', 'ssh-keygen -t ed25519', 'ssh-keygen'],
            hint: { uz: 'ssh-keygen -t ed25519', en: 'ssh-keygen -t ed25519' },
            successMessage: { uz: 'Kalitlar yaratildi va ~/.ssh papkasiga saqlandi!', en: 'Keys created and saved in ~/.ssh!' },
            visualEffect: 'ssh',
          },
          {
            id: 'keygen-2',
            instruction: { uz: 'Yaratilgan kalitlarni ko\'ring:', en: 'View the generated keys:' },
            expectedCommands: ['ls -la ~/.ssh', 'ls ~/.ssh', 'ls -l ~/.ssh', 'ls -la .ssh'],
            hint: { uz: 'ls -la ~/.ssh', en: 'ls -la ~/.ssh' },
            successMessage: { uz: 'Kalitlarni ko\'rdingiz! id_ed25519 (maxfiy) va id_ed25519.pub (ochiq).', en: 'You saw the keys! id_ed25519 (private) and id_ed25519.pub (public).' },
            visualEffect: 'filesystem',
          },
        ],
      },
      {
        id: 'ssh-connect',
        title: { uz: 'ssh — Serverga ulanish', en: 'ssh — Connect to a server' },
        description: { uz: 'Uzoqdagi serverga ulanish', en: 'Connect to a remote server' },
        command: 'ssh',
        theory: {
          uz: '`ssh` buyrug\'i uzoqdagi serverga ulanadi. Bu backend developer uchun kundalik amal.\n\nFormat: `ssh foydalanuvchi@server`\n• `ssh ubuntu@192.168.1.1` — IP manzil orqali\n• `ssh root@example.com` — domen orqali\n• `ssh -p 2222 user@host` — boshqa port orqali (`-p`)\n\nUlangandan keyin siz uzoqdagi server terminalida ishlaysiz — go\'yo o\'sha kompyuter oldida o\'tirgandek. Barcha buyruqlar (ls, cd, mkdir) o\'sha serverda bajariladi.\n\nChiqish uchun `exit` yoki `Ctrl+D`.\n\nXavfsizlik: birinchi marta ulanganda server "barmoq izi" (fingerprint) so\'raydi — "yes" deysiz. Keyin kalit bilan parolsiz ulanadi (agar kalit sozlangan bo\'lsa).',
          en: 'The `ssh` command connects to a remote server. This is a daily task for backend developers.\n\nFormat: `ssh user@server`\n• `ssh ubuntu@192.168.1.1` — via IP address\n• `ssh root@example.com` — via domain\n• `ssh -p 2222 user@host` — via another port (`-p`)\n\nAfter connecting you work in the remote server\'s terminal — as if sitting at that computer. All commands (ls, cd, mkdir) run on that server.\n\nTo exit, type `exit` or `Ctrl+D`.\n\nSecurity: on first connection the server asks for a "fingerprint" — you say "yes". Then it connects without a password using your key (if configured).',
        },
        examples: [
          { cmd: 'ssh ubuntu@192.168.1.1', desc: { uz: 'Serverga ulanadi', en: 'Connects to a server' } },
        ],
        steps: [{
          id: 'ssh-1',
          instruction: { uz: 'Serverga ulanishni sinab ko\'ring:', en: 'Try connecting to a server:' },
          expectedCommands: ['ssh ubuntu@192.168.1.1', 'ssh user@server.com', 'ssh root@example.com'],
          hint: { uz: 'ssh ubuntu@192.168.1.1', en: 'ssh ubuntu@192.168.1.1' },
          successMessage: { uz: 'SSH ulanish sinab ko\'rildi! (Bu simulyatsiya — real server yo\'q)', en: 'SSH connection tested! (This is a simulation — no real server)' },
          visualEffect: 'ssh',
        }],
      },
    ],
  },
];

export const getTotalLessons = () => MODULES.reduce((a, m) => a + m.lessons.length, 0);
export const getTotalSteps = () => MODULES.reduce((a, m) => a + m.lessons.reduce((x, l) => x + l.steps.length, 0), 0);
