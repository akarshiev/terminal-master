import { FileSystemNode } from '@/types';
import { BASE_FS } from '@/data/curriculum';

export interface ExecResult {
  output: string;
  error?: boolean;
  effect?: string;
  clear?: boolean;
  /* tmux side-effects */
  tmux?: { action: 'new'|'detach'|'attach'|'split-v'|'split-h'|'new-window'|'nav'|'kill'|'list'; session?: string };
  /* process side-effects */
  killedPid?: number;
}

interface Process { pid: number; user: string; cpu: number; mem: number; cmd: string; }

export class VirtualFS {
  private root: FileSystemNode;
  private cwd: string[];
  public nickname: string;
  private processes: Process[];
  private commandHistory: string[] = [];
  private sshKeyGenerated = false;

  constructor(nickname: string) {
    this.nickname = nickname;
    this.root = JSON.parse(JSON.stringify(BASE_FS));
    this.replace(this.root, '__USER__', nickname);
    this.cwd = ['home', nickname];
    this.processes = [
      { pid: 1,    user: 'root',     cpu: 0.0, mem: 0.1, cmd: 'systemd' },
      { pid: 892,  user: 'root',     cpu: 0.0, mem: 0.2, cmd: 'sshd' },
      { pid: 1234, user: nickname,   cpu: 0.0, mem: 0.1, cmd: 'bash' },
      { pid: 2341, user: nickname,   cpu: 2.1, mem: 1.2, cmd: 'node server.js' },
      { pid: 3892, user: nickname,   cpu: 0.5, mem: 3.4, cmd: 'java -jar app.jar' },
    ];
  }

  private replace(node: FileSystemNode, from: string, to: string) {
    if (node.name === from) node.name = to;
    node.children?.forEach(c => this.replace(c, from, to));
  }

  private getNode(parts: string[]): FileSystemNode | null {
    let n: FileSystemNode = this.root;
    for (const p of parts) {
      if (!n.children) return null;
      const child = n.children.find(c => c.name === p);
      if (!child) return null;
      n = child;
    }
    return n;
  }

  private resolve(path: string): string[] {
    if (path === '~' || path === '') return ['home', this.nickname];
    if (path.startsWith('~/')) return ['home', this.nickname, ...path.slice(2).split('/').filter(Boolean)];
    if (path === '/') return [];
    if (path.startsWith('/')) return path.slice(1).split('/').filter(Boolean);
    const parts = [...this.cwd];
    for (const seg of path.split('/').filter(Boolean)) {
      if (seg === '..') parts.pop();
      else if (seg !== '.') parts.push(seg);
    }
    return parts;
  }

  getCurrentPath(): string { return this.cwd.length === 0 ? '/' : '/' + this.cwd.join('/'); }
  getPromptPath(): string {
    const home = `/home/${this.nickname}`;
    const full = this.getCurrentPath();
    if (full === home) return '~';
    if (full.startsWith(home + '/')) return '~' + full.slice(home.length);
    return full;
  }
  getCurrentNode(): FileSystemNode | null { return this.getNode(this.cwd); }
  getFS(): FileSystemNode { return this.root; }
  getHistory(): string[] { return this.commandHistory; }

  /* ─────────────────────────────────────────────
     MAIN EXECUTOR
     ───────────────────────────────────────────── */
  execute(raw: string): ExecResult {
    const line = raw.trim();
    if (!line) return { output: '' };
    this.commandHistory.push(line);

    /* Pipe */
    if (line.includes('|')) return this.runPipe(line);
    /* Redirect append */
    if (line.includes('>>')) return this.runRedirect(line, true);
    /* Redirect write */
    if (/[^>]>[^>]|[^>]>$/.test(line)) return this.runRedirect(line, false);

    return this.runSingle(line);
  }

  private runSingle(line: string): ExecResult {
    const tokens = this.tokenize(line);
    const cmd = tokens[0];
    const args = tokens.slice(1);

    switch (cmd) {
      case 'pwd':    return { output: this.getCurrentPath() };
      case 'whoami': return { output: this.nickname };
      case 'id':     return { output: `uid=1000(${this.nickname}) gid=1000(${this.nickname}) groups=1000(${this.nickname}),27(sudo),100(users)` };
      case 'echo':   return { output: this.cmdEcho(args) };
      case 'clear':  return { output: '', clear: true };
      case 'date':   return { output: new Date().toString() };
      case 'uname':  return { output: args.includes('-a')
        ? `Linux ${this.nickname}-pc 6.8.0-generic #1 SMP x86_64 x86_64 x86_64 GNU/Linux`
        : 'Linux' };
      case 'ls':     return this.cmdLs(args);
      case 'cd':     return this.cmdCd(args[0] || '~');
      case 'touch':  return this.cmdTouch(args);
      case 'mkdir':  return this.cmdMkdir(args);
      case 'rm':     return this.cmdRm(args);
      case 'rmdir':  return this.cmdRmdir(args[0]);
      case 'cp':     return this.cmdCp(args);
      case 'mv':     return this.cmdMv(args);
      case 'cat':    return this.cmdCat(args);
      case 'head':   return this.cmdHead(args);
      case 'tail':   return this.cmdTail(args);
      case 'wc':     return this.cmdWc(args);
      case 'find':   return this.cmdFind(args);
      case 'grep':   return this.cmdGrep(args);
      case 'tree':   return this.cmdTree(args);
      case 'chmod':  return this.cmdChmod(args);
      case 'chown':  return this.cmdChown(args);
      case 'history':return { output: this.commandHistory.map((h, i) => `  ${i + 1}  ${h}`).join('\n') };
      case 'ps':     return this.cmdPs(args);
      case 'top':    return this.cmdTop();
      case 'kill':   return this.cmdKill(args);
      case 'jobs':   return { output: '[1]+  Running    node server.js &' };
      case 'man':    return this.cmdMan(args[0]);
      case 'less':
      case 'more':   return this.cmdCat(args);
      case 'ssh':    return this.cmdSsh(args);
      case 'ssh-keygen': return this.cmdSshKeygen(args);
      case 'scp':    return { output: `${args[0] || 'file'}  100%  1024  1.0MB/s  00:00` };
      case 'tmux':   return this.cmdTmux(args);
      case 'sudo':   return this.cmdSudo(args);
      case 'tee':    return { output: '' };
      case 'vim': case 'vi': case 'nano':
        return { output: `[${cmd}: editor simulyatsiyasi — bu muhitda matn muharrir ochilmaydi]` };
      default:
        return { output: `${cmd}: command not found`, error: true };
    }
  }

  /* Tokenize respecting quotes */
  private tokenize(line: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inQuote: '"' | "'" | null = null;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuote) {
        if (ch === inQuote) inQuote = null;
        else current += ch;
      } else if (ch === '"' || ch === "'") {
        inQuote = ch;
      } else if (ch === ' ') {
        if (current) { tokens.push(current); current = ''; }
      } else {
        current += ch;
      }
    }
    if (current) tokens.push(current);
    return tokens;
  }

  /* ─── echo ─── */
  private cmdEcho(args: string[]): string {
    return args.join(' ');
  }

  /* ─── ls ─── */
  private cmdLs(args: string[]): ExecResult {
    const flags = args.filter(a => a.startsWith('-')).join('').replace(/-/g, '');
    const pathArg = args.find(a => !a.startsWith('-'));
    const target = pathArg ? this.resolve(pathArg) : this.cwd;
    const node = this.getNode(target);
    if (!node) return { output: `ls: cannot access '${pathArg}': No such file or directory`, error: true };
    if (node.type === 'file') {
      if (flags.includes('l')) {
        const perm = node.permissions || '-rw-r--r--';
        const size = node.size ?? 0;
        return { output: `${perm} 1 ${this.nickname} ${this.nickname} ${String(size).padStart(5)} Jun 22 10:00 ${pathArg || node.name}`, effect: 'permissions' };
      }
      return { output: pathArg || node.name };
    }

    let kids = (node.children || []).slice();
    if (!flags.includes('a')) kids = kids.filter(c => !c.name.startsWith('.'));
    kids.sort((a, b) => a.name.localeCompare(b.name));

    if (flags.includes('a') && (pathArg === undefined || pathArg === '.')) {
      kids = [
        { name: '.', type: 'dir' as const },
        { name: '..', type: 'dir' as const },
        ...kids,
      ];
    }

    if (!kids.length) return { output: '' };

    if (flags.includes('l')) {
      const lines = kids.map(c => {
        const perm = c.permissions || (c.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--');
        const size = c.size ?? (c.type === 'dir' ? 4096 : 0);
        const name = c.type === 'dir' ? `\x1b[34m${c.name}\x1b[0m` : c.name;
        return `${perm} 1 ${this.nickname} ${this.nickname} ${String(size).padStart(5)} Jun 22 10:00 ${name}`;
      });
      return { output: `total ${kids.length * 4}\n` + lines.join('\n'), effect: 'filesystem' };
    }

    return {
      output: kids.map(c => c.type === 'dir' ? `\x1b[34m${c.name}\x1b[0m` : c.name).join('  '),
      effect: 'filesystem',
    };
  }

  /* ─── cd ─── */
  private cmdCd(path: string): ExecResult {
    const parts = this.resolve(path);
    const node = this.getNode(parts);
    if (!node) return { output: `cd: ${path}: No such file or directory`, error: true };
    if (node.type !== 'dir') return { output: `cd: ${path}: Not a directory`, error: true };
    this.cwd = parts;
    return { output: '', effect: 'filesystem' };
  }

  /* ─── touch ─── */
  private cmdTouch(args: string[]): ExecResult {
    const name = args.find(a => !a.startsWith('-'));
    if (!name) return { output: 'touch: missing file operand', error: true };
    const parts = this.resolve(name);
    const fileName = parts.pop()!;
    const dir = this.getNode(parts.length ? parts : this.cwd);
    if (!dir || dir.type !== 'dir') return { output: `touch: cannot touch '${name}': No such file or directory`, error: true };
    dir.children ||= [];
    if (!dir.children.find(c => c.name === fileName))
      dir.children.push({ name: fileName, type: 'file', size: 0, content: '' });
    return { output: '', effect: 'filesystem' };
  }

  /* ─── mkdir ─── */
  private cmdMkdir(args: string[]): ExecResult {
    const recursive = args.includes('-p');
    const name = args.find(a => !a.startsWith('-'));
    if (!name) return { output: 'mkdir: missing operand', error: true };

    if (recursive) {
      const parts = this.resolve(name);
      let cur = this.getNode([]) || this.root;
      const base = name.startsWith('/') ? [] : [...this.cwd];
      let node = this.getNode(base)!;
      for (const seg of (name.startsWith('/') ? parts : name.split('/').filter(Boolean))) {
        node.children ||= [];
        let child = node.children.find(c => c.name === seg);
        if (!child) { child = { name: seg, type: 'dir', children: [] }; node.children.push(child); }
        node = child;
      }
      return { output: '', effect: 'filesystem' };
    }

    const parts = this.resolve(name);
    const dirName = parts.pop()!;
    const parent = this.getNode(parts.length ? parts : this.cwd);
    if (!parent || parent.type !== 'dir') return { output: `mkdir: cannot create directory '${name}': No such file or directory`, error: true };
    parent.children ||= [];
    if (parent.children.find(c => c.name === dirName))
      return { output: `mkdir: cannot create directory '${name}': File exists`, error: true };
    parent.children.push({ name: dirName, type: 'dir', children: [] });
    return { output: '', effect: 'filesystem' };
  }

  /* ─── rm ─── */
  private cmdRm(args: string[]): ExecResult {
    const flags = args.filter(a => a.startsWith('-')).join('');
    const name = args.find(a => !a.startsWith('-'));
    if (!name) return { output: 'rm: missing operand', error: true };
    const parts = this.resolve(name);
    const fileName = parts.pop()!;
    const dir = this.getNode(parts.length ? parts : this.cwd);
    if (!dir?.children) return { output: `rm: cannot remove '${name}': No such file or directory`, error: true };
    const idx = dir.children.findIndex(c => c.name === fileName);
    if (idx === -1) return { output: `rm: cannot remove '${name}': No such file or directory`, error: true };
    const target = dir.children[idx];
    if (target.type === 'dir' && !flags.includes('r'))
      return { output: `rm: cannot remove '${name}': Is a directory`, error: true };
    dir.children.splice(idx, 1);
    return { output: '', effect: 'filesystem' };
  }

  private cmdRmdir(name?: string): ExecResult {
    if (!name) return { output: 'rmdir: missing operand', error: true };
    const parts = this.resolve(name);
    const dirName = parts.pop()!;
    const parent = this.getNode(parts.length ? parts : this.cwd);
    if (!parent?.children) return { output: `rmdir: failed to remove '${name}': No such file or directory`, error: true };
    const idx = parent.children.findIndex(c => c.name === dirName && c.type === 'dir');
    if (idx === -1) return { output: `rmdir: failed to remove '${name}': No such file or directory`, error: true };
    if ((parent.children[idx].children?.length || 0) > 0)
      return { output: `rmdir: failed to remove '${name}': Directory not empty`, error: true };
    parent.children.splice(idx, 1);
    return { output: '', effect: 'filesystem' };
  }

  /* ─── cp ─── */
  private cmdCp(args: string[]): ExecResult {
    const nonFlags = args.filter(a => !a.startsWith('-'));
    const [src, dest] = nonFlags;
    if (!src || !dest) return { output: 'cp: missing file operand', error: true };
    const srcParts = this.resolve(src);
    const srcNode = this.getNode(srcParts);
    if (!srcNode) return { output: `cp: cannot stat '${src}': No such file or directory`, error: true };
    const destParts = this.resolve(dest);
    const destNode = this.getNode(destParts);
    const copy: FileSystemNode = JSON.parse(JSON.stringify(srcNode));
    if (destNode?.type === 'dir') {
      destNode.children ||= [];
      if (!destNode.children.find(c => c.name === copy.name)) destNode.children.push(copy);
    } else {
      const parent = this.getNode(destParts.slice(0, -1));
      if (!parent || parent.type !== 'dir') return { output: `cp: cannot create '${dest}': No such file or directory`, error: true };
      copy.name = destParts[destParts.length - 1];
      parent.children ||= [];
      const existing = parent.children.findIndex(c => c.name === copy.name);
      if (existing >= 0) parent.children[existing] = copy;
      else parent.children.push(copy);
    }
    return { output: '', effect: 'filesystem' };
  }

  /* ─── mv ─── */
  private cmdMv(args: string[]): ExecResult {
    const nonFlags = args.filter(a => !a.startsWith('-'));
    const [src, dest] = nonFlags;
    if (!src || !dest) return { output: 'mv: missing file operand', error: true };
    const srcParts = this.resolve(src);
    const srcName = srcParts[srcParts.length - 1];
    const srcParent = this.getNode(srcParts.slice(0, -1));
    if (!srcParent?.children) return { output: `mv: cannot stat '${src}': No such file or directory`, error: true };
    const srcIdx = srcParent.children.findIndex(c => c.name === srcName);
    if (srcIdx === -1) return { output: `mv: cannot stat '${src}': No such file or directory`, error: true };
    const srcNode = srcParent.children[srcIdx];

    const destParts = this.resolve(dest);
    const destNode = this.getNode(destParts);
    if (destNode?.type === 'dir') {
      destNode.children ||= [];
      destNode.children.push({ ...srcNode });
    } else {
      const parent = this.getNode(destParts.slice(0, -1));
      if (!parent || parent.type !== 'dir') return { output: `mv: cannot move '${src}' to '${dest}': No such file or directory`, error: true };
      parent.children ||= [];
      parent.children.push({ ...srcNode, name: destParts[destParts.length - 1] });
    }
    srcParent.children.splice(srcIdx, 1);
    return { output: '', effect: 'filesystem' };
  }

  /* ─── cat ─── */
  private cmdCat(args: string[]): ExecResult {
    const name = args.find(a => !a.startsWith('-'));
    if (!name) return { output: '' };
    const node = this.getNode(this.resolve(name));
    if (!node) return { output: `cat: ${name}: No such file or directory`, error: true };
    if (node.type === 'dir') return { output: `cat: ${name}: Is a directory`, error: true };
    return { output: node.content ?? '' };
  }

  private cmdHead(args: string[]): ExecResult {
    const nIdx = args.indexOf('-n');
    const n = nIdx >= 0 ? parseInt(args[nIdx + 1]) || 10 : 10;
    const file = args.find(a => !a.startsWith('-') && !/^\d+$/.test(a));
    const r = this.cmdCat(file ? [file] : []);
    if (r.error) return r;
    return { output: r.output.split('\n').slice(0, n).join('\n') };
  }
  private cmdTail(args: string[]): ExecResult {
    const nIdx = args.indexOf('-n');
    const n = nIdx >= 0 ? parseInt(args[nIdx + 1]) || 10 : 10;
    const file = args.find(a => !a.startsWith('-') && !/^\d+$/.test(a));
    const r = this.cmdCat(file ? [file] : []);
    if (r.error) return r;
    const lines = r.output.split('\n');
    return { output: lines.slice(Math.max(0, lines.length - n)).join('\n') };
  }

  /* ─── wc ─── */
  private cmdWc(args: string[]): ExecResult {
    const flags = args.filter(a => a.startsWith('-')).join('');
    const file = args.find(a => !a.startsWith('-'));
    const r = this.cmdCat(file ? [file] : []);
    if (r.error) return r;
    return { output: this.wcCompute(r.output, flags, file) };
  }
  private wcCompute(content: string, flags: string, file?: string): string {
    const lines = content === '' ? 0 : content.split('\n').length;
    const words = content.split(/\s+/).filter(Boolean).length;
    const chars = content.length;
    const suffix = file ? ` ${file}` : '';
    if (flags.includes('l')) return `${lines}${suffix}`;
    if (flags.includes('w')) return `${words}${suffix}`;
    if (flags.includes('c')) return `${chars}${suffix}`;
    return `${lines} ${words} ${chars}${suffix}`;
  }

  /* ─── find ─── */
  private cmdFind(args: string[]): ExecResult {
    const startPath = args[0] && !args[0].startsWith('-') ? args[0] : '.';
    const nameIdx = args.indexOf('-name');
    const typeIdx = args.indexOf('-type');
    const namePat = nameIdx >= 0 ? args[nameIdx + 1]?.replace(/['"]/g, '') : null;
    const typeFilter = typeIdx >= 0 ? args[typeIdx + 1] : null;

    /* Validate -name argument exists if -name was passed */
    if (nameIdx >= 0 && !args[nameIdx + 1])
      return { output: `find: missing argument to '-name'`, error: true };
    if (typeIdx >= 0 && !['f', 'd', 'l'].includes(args[typeIdx + 1] || ''))
      return { output: `find: Arguments to -type should contain only one of [bcdpfls]`, error: true };

    const startNode = this.getNode(startPath === '.' ? this.cwd : this.resolve(startPath));
    if (!startNode) return { output: `find: '${startPath}': No such file or directory`, error: true };

    const results: string[] = [];
    const matchName = (n: string) => {
      if (!namePat) return true;
      const rx = new RegExp('^' + namePat.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
      return rx.test(n);
    };
    const walk = (node: FileSystemNode, path: string) => {
      const typeOk = !typeFilter || (typeFilter === 'd' && node.type === 'dir') || (typeFilter === 'f' && node.type === 'file');
      if (typeOk && matchName(node.name)) results.push(path);
      node.children?.forEach(c => walk(c, `${path}/${c.name}`));
    };
    if (startNode.children) {
      const base = startPath;
      const typeOk = !typeFilter || (typeFilter === 'd');
      if (typeOk && matchName('.')) results.push(base);
      startNode.children.forEach(c => walk(c, `${base}/${c.name}`));
    }
    return { output: results.join('\n'), effect: 'filesystem' };
  }

  /* ─── grep ─── */
  private cmdGrep(args: string[]): ExecResult {
    const flags = args.filter(a => a.startsWith('-')).join('');
    const nonFlags = args.filter(a => !a.startsWith('-'));
    const pattern = nonFlags[0];
    const file = nonFlags[1];
    if (!pattern) return { output: 'usage: grep PATTERN FILE', error: true };
    const r = this.cmdCat(file ? [file] : []);
    if (r.error) return r;
    const rx = new RegExp(pattern, flags.includes('i') ? 'i' : '');
    const matched = r.output.split('\n').filter(l => rx.test(l));
    return { output: matched.join('\n') };
  }

  /* ─── tree ─── */
  private cmdTree(args: string[]): ExecResult {
    const pathArg = args.find(a => !a.startsWith('-'));
    const startNode = pathArg ? this.getNode(this.resolve(pathArg)) : this.getCurrentNode();
    if (!startNode) return { output: `${pathArg} [error opening dir]\n\n0 directories, 0 files`, error: true };
    let dirs = 0, files = 0;
    const render = (node: FileSystemNode, prefix: string): string => {
      const kids = (node.children || []).filter(c => !c.name.startsWith('.'));
      return kids.map((c, i) => {
        const last = i === kids.length - 1;
        const connector = last ? '└── ' : '├── ';
        const ext = last ? '    ' : '│   ';
        if (c.type === 'dir') dirs++; else files++;
        const name = c.type === 'dir' ? `\x1b[34m${c.name}\x1b[0m` : c.name;
        let out = prefix + connector + name + '\n';
        if (c.children) out += render(c, prefix + ext);
        return out;
      }).join('');
    };
    const body = render(startNode, '');
    const label = pathArg || '.';
    return { output: `${label}\n${body}\n${dirs} directories, ${files} files`, effect: 'filesystem' };
  }

  /* ─── chmod ─── */
  private cmdChmod(args: string[]): ExecResult {
    const mode = args[0];
    const name = args[1];
    if (!mode || !name) return { output: 'chmod: missing operand', error: true };
    const node = this.getNode(this.resolve(name));
    if (!node) return { output: `chmod: cannot access '${name}': No such file or directory`, error: true };

    const toRwx = (d: number) => (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-');

    if (/^[0-7]{3,4}$/.test(mode)) {
      const digits = mode.slice(-3).split('').map(Number);
      const prefix = node.type === 'dir' ? 'd' : '-';
      node.permissions = prefix + digits.map(toRwx).join('');
      return { output: '', effect: 'permissions' };
    }
    /* symbolic mode like u+x */
    const m = mode.match(/^([ugoa]+)([+-=])([rwx]+)$/);
    if (m) {
      // Simplified: just acknowledge
      return { output: '', effect: 'permissions' };
    }
    return { output: `chmod: invalid mode: '${mode}'`, error: true };
  }

  private cmdChown(args: string[]): ExecResult {
    const owner = args[0];
    const name = args[1];
    if (!owner || !name) return { output: 'chown: missing operand', error: true };
    const node = this.getNode(this.resolve(name));
    if (!node) return { output: `chown: cannot access '${name}': No such file or directory`, error: true };
    return { output: '', effect: 'permissions' };
  }

  /* ─── ps ─── */
  private cmdPs(args: string[]): ExecResult {
    const aux = args.join('').includes('aux') || args.join('').includes('a');
    if (aux) {
      const header = 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND';
      const rows = this.processes.map(p =>
        `${p.user.padEnd(8)} ${String(p.pid).padStart(5)} ${p.cpu.toFixed(1).padStart(4)} ${p.mem.toFixed(1).padStart(4)} ${String(100000 + p.pid * 100).padStart(6)} ${String(p.mem * 8192 | 0).padStart(5)} pts/0    Sl   10:00   0:00 ${p.cmd}`
      );
      return { output: [header, ...rows].join('\n'), effect: 'process' };
    }
    const header = '  PID TTY          TIME CMD';
    const rows = this.processes.filter(p => p.user === this.nickname).map(p =>
      `${String(p.pid).padStart(5)} pts/0    00:00:00 ${p.cmd.split(' ')[0]}`
    );
    return { output: [header, ...rows].join('\n'), effect: 'process' };
  }

  private cmdTop(): ExecResult {
    const header = '  PID USER      %CPU %MEM    TIME+ COMMAND';
    const rows = this.processes.map(p =>
      `${String(p.pid).padStart(5)} ${p.user.padEnd(8)} ${p.cpu.toFixed(1).padStart(5)} ${p.mem.toFixed(1).padStart(4)}  0:00.0 ${p.cmd}`
    );
    return { output: `top - load average: 0.15, 0.10, 0.05\nTasks: ${this.processes.length} total\n\n${[header, ...rows].join('\n')}\n\n[q tugmasi bilan chiqish — bu yerda avtomatik chiqdi]`, effect: 'process' };
  }

  /* ─── kill: ONLY kills existing PIDs ─── */
  private cmdKill(args: string[]): ExecResult {
    const pidArg = args.find(a => /^\d+$/.test(a));
    if (!pidArg) return { output: 'kill: usage: kill [-signal] pid', error: true };
    const pid = parseInt(pidArg);
    const idx = this.processes.findIndex(p => p.pid === pid);
    if (idx === -1)
      return { output: `kill: (${pid}): No such process`, error: true };
    /* Cannot kill init */
    if (pid === 1)
      return { output: `kill: (1): Operation not permitted`, error: true };
    const killed = this.processes[idx];
    this.processes.splice(idx, 1);
    return { output: '', effect: 'process', killedPid: pid };
  }

  /* ─── man ─── */
  private cmdMan(name?: string): ExecResult {
    if (!name) return { output: 'What manual page do you want?', error: true };
    const pages: Record<string, string> = {
      ls:    'LS(1)\n\nNAME\n    ls — list directory contents\n\nSYNOPSIS\n    ls [OPTION]... [FILE]...\n\nDESCRIPTION\n    -l   use a long listing format\n    -a   do not ignore entries starting with .\n\n[q bilan chiqish]',
      cd:    'CD(1)\n\nNAME\n    cd — change the working directory\n\nSYNOPSIS\n    cd [directory]\n\n[q bilan chiqish]',
      pwd:   'PWD(1)\n\nNAME\n    pwd — print working directory\n\n[q bilan chiqish]',
      chmod: 'CHMOD(1)\n\nNAME\n    chmod — change file mode bits\n\nSYNOPSIS\n    chmod MODE FILE\n\n[q bilan chiqish]',
    };
    return { output: pages[name] || `No manual entry for ${name}` };
  }

  /* ─── ssh ─── */
  private cmdSsh(args: string[]): ExecResult {
    const target = args.find(a => a.includes('@'));
    if (!target) return { output: 'usage: ssh user@host', error: true };
    return { output: `The authenticity of host cannot be established.\nThis is a simulation — real SSH connections are not made.\nConnecting to ${target}...\nPermission denied (publickey).`, effect: 'ssh' };
  }

  private cmdSshKeygen(args: string[]): ExecResult {
    this.sshKeyGenerated = true;
    const home = `/home/${this.nickname}`;
    /* Add .ssh directory and keys to FS */
    const homeNode = this.getNode(['home', this.nickname]);
    if (homeNode) {
      homeNode.children ||= [];
      let ssh = homeNode.children.find(c => c.name === '.ssh');
      if (!ssh) { ssh = { name: '.ssh', type: 'dir', children: [] }; homeNode.children.push(ssh); }
      ssh.children ||= [];
      if (!ssh.children.find(c => c.name === 'id_ed25519')) {
        ssh.children.push({ name: 'id_ed25519', type: 'file', size: 411, permissions: '-rw-------', content: '-----BEGIN OPENSSH PRIVATE KEY-----\n(private key data)\n-----END OPENSSH PRIVATE KEY-----' });
        ssh.children.push({ name: 'id_ed25519.pub', type: 'file', size: 96, permissions: '-rw-r--r--', content: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... ${this.nickname}@linux` });
      }
    }
    return {
      output: `Generating public/private ed25519 key pair.\nYour identification has been saved in ${home}/.ssh/id_ed25519\nYour public key has been saved in ${home}/.ssh/id_ed25519.pub\nThe key fingerprint is:\nSHA256:a1b2c3d4e5f6g7h8i9j0 ${this.nickname}@linux\n\nKalit yaratildi! '.ssh' papkasini ko'rish uchun:  ls -la ~/.ssh`,
      effect: 'ssh',
    };
  }

  /* ─── tmux ─── */
  private cmdTmux(args: string[]): ExecResult {
    const sub = args[0];
    if (!sub) return { output: 'usage: tmux [new|attach|ls|kill-session] [-s name]', effect: 'tmux' };

    if (sub === 'new' || sub === 'new-session') {
      const sIdx = args.indexOf('-s');
      const name = sIdx >= 0 ? args[sIdx + 1] : 'default';
      return { output: '', effect: 'tmux', tmux: { action: 'new', session: name } };
    }
    if (sub === 'attach' || sub === 'a') {
      const sIdx = args.indexOf('-t');
      const name = sIdx >= 0 ? args[sIdx + 1] : 'default';
      return { output: '', effect: 'tmux', tmux: { action: 'attach', session: name } };
    }
    if (sub === 'ls' || sub === 'list-sessions') {
      return { output: '', effect: 'tmux', tmux: { action: 'list' } };
    }
    if (sub === 'kill-session') {
      return { output: '', effect: 'tmux', tmux: { action: 'kill' } };
    }
    return { output: `tmux: unknown command: ${sub}`, error: true };
  }

  /* ─── sudo ─── */
  private cmdSudo(args: string[]): ExecResult {
    if (!args.length) return { output: 'usage: sudo command', error: true };
    /* Run the inner command as if root */
    const inner = args.join(' ');
    const r = this.runSingle(inner);
    return { ...r, output: r.output };
  }

  /* ═══════════ PIPE ═══════════ */
  private runPipe(line: string): ExecResult {
    const stages = line.split('|').map(s => s.trim());
    let buffer = '';
    let lastEffect: string | undefined;
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (i === 0) {
        const r = this.runSingle(stage);
        if (r.error) return r;
        buffer = r.output;
        lastEffect = r.effect;
      } else {
        const tokens = this.tokenize(stage);
        const cmd = tokens[0];
        const a = tokens.slice(1);
        if (cmd === 'wc') {
          buffer = this.wcCompute(buffer, a.filter(x => x.startsWith('-')).join(''));
        } else if (cmd === 'grep') {
          const flags = a.filter(x => x.startsWith('-')).join('');
          const pat = a.find(x => !x.startsWith('-')) || '';
          const rx = new RegExp(pat, flags.includes('i') ? 'i' : '');
          buffer = buffer.split('\n').filter(l => rx.test(l)).join('\n');
        } else if (cmd === 'head') {
          const nIdx = a.indexOf('-n');
          const n = nIdx >= 0 ? parseInt(a[nIdx + 1]) || 10 : 10;
          buffer = buffer.split('\n').slice(0, n).join('\n');
        } else if (cmd === 'tail') {
          const nIdx = a.indexOf('-n');
          const n = nIdx >= 0 ? parseInt(a[nIdx + 1]) || 10 : 10;
          const ls = buffer.split('\n');
          buffer = ls.slice(Math.max(0, ls.length - n)).join('\n');
        } else if (cmd === 'sort') {
          buffer = buffer.split('\n').sort().join('\n');
        } else if (cmd === 'uniq') {
          buffer = [...new Set(buffer.split('\n'))].join('\n');
        } else if (cmd === 'tee') {
          const f = a.find(x => !x.startsWith('-'));
          if (f) this.writeFile(f, buffer, false);
        } else {
          return { output: `${cmd}: command not found`, error: true };
        }
      }
    }
    return { output: buffer, effect: lastEffect || 'pipe' };
  }

  /* ═══════════ REDIRECT ═══════════ */
  private runRedirect(line: string, append: boolean): ExecResult {
    const sep = append ? '>>' : '>';
    const idx = line.lastIndexOf(sep);
    const cmdPart = line.slice(0, idx).trim();
    const file = line.slice(idx + sep.length).trim().replace(/['"]/g, '');
    const r = this.runSingle(cmdPart);
    if (r.error) return r;
    this.writeFile(file, r.output, append);
    return { output: '', effect: 'filesystem' };
  }

  private writeFile(name: string, content: string, append: boolean) {
    const parts = this.resolve(name);
    const fileName = parts.pop()!;
    const dir = this.getNode(parts.length ? parts : this.cwd);
    if (!dir || dir.type !== 'dir') return;
    dir.children ||= [];
    const existing = dir.children.find(c => c.name === fileName);
    if (existing && existing.type === 'file') {
      existing.content = append ? (existing.content || '') + '\n' + content : content;
      existing.size = (existing.content || '').length;
    } else {
      dir.children.push({ name: fileName, type: 'file', content, size: content.length });
    }
  }
}
