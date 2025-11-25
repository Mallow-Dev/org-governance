import React from 'react';
import { LayoutDashboard, Shield, FileText, Settings, Users, GitBranch } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', href: '/' },
    { icon: <Shield size={20} />, label: 'Compliance', href: '/compliance' },
    { icon: <Users size={20} />, label: 'Agents', href: '/agents' },
    { icon: <FileText size={20} />, label: 'Reports', href: '/reports' },
    { icon: <GitBranch size={20} />, label: 'Repositories', href: '/repos' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel m-4 flex flex-col border-r-0 z-50">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Governance AI
        </h1>
        <p className="text-xs text-white/50 mt-1">Orchestration Layer</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all group"
          >
            <span className="group-hover:text-primary transition-colors">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
          <div>
            <div className="text-sm font-medium text-white">Admin User</div>
            <div className="text-xs text-white/50">admin@mallow.dev</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
