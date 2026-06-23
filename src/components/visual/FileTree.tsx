'use client';
import { FileSystemNode } from '@/types';
import { useState } from 'react';

interface Props {
  node: FileSystemNode;
  activePath?: string;
  depth?: number;
  parentPath?: string;
}

export default function FileTree({ node, activePath = '', depth = 0, parentPath = '' }: Props) {
  const fullPath = depth === 0 ? '/' : parentPath + '/' + node.name;
  const isDir    = node.type === 'dir';
  const hasKids  = isDir && (node.children?.length ?? 0) > 0;
  const [open, setOpen] = useState(depth < 2);
  const isCwd    = activePath === fullPath;
  const isOnPath = activePath.startsWith(fullPath + '/') && fullPath !== '/';

  const cls = `ft-row ${isDir ? 'dir' : 'file'} ${isCwd ? 'cwd' : ''}`;

  return (
    <div>
      <div
        className={cls}
        style={{ paddingLeft: `${depth * 12 + 2}px`, cursor: hasKids ? 'pointer' : 'default' }}
        onClick={() => hasKids && setOpen(o => !o)}
      >
        <span style={{ color: 'var(--fg-2)', fontSize: 9, width: 8, flexShrink: 0 }}>
          {hasKids ? (open ? '▾' : '▸') : ''}
        </span>
        <span style={{ flexShrink: 0, marginRight: 3, fontSize: 11 }}>
          {isDir ? (open && hasKids ? '▾ ' : '') : ''}
        </span>
        <span>{node.name}</span>
        {node.permissions && depth > 0 && (
          <span style={{ marginLeft: 6, color: 'var(--fg-2)', fontSize: 9 }}>{node.permissions}</span>
        )}
      </div>
      {open && hasKids && node.children!.map(child => (
        <FileTree key={child.name} node={child} activePath={activePath} depth={depth+1} parentPath={fullPath} />
      ))}
    </div>
  );
}
