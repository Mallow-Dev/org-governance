import React from 'react';
import { Bot, Activity, Clock, AlertCircle } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

export interface AgentData {
  role: string;
  status: 'Active' | 'Idle' | 'Offline' | 'Error';
  currentTask?: string;
  lastUpdate: string;
}

interface AgentStatusProps {
  agents: AgentData[];
}

export function AgentStatus({ agents }: AgentStatusProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <DashboardCard key={agent.role} className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Bot size={64} />
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} animate-pulse`} />
            <h4 className="font-medium text-white">{agent.role}</h4>
          </div>
          
          <div className="space-y-2 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Activity size={14} />
              <span>{agent.status}</span>
            </div>
            {agent.currentTask && (
              <div className="flex items-start gap-2">
                <Clock size={14} className="mt-1 shrink-0" />
                <span className="line-clamp-2">{agent.currentTask}</span>
              </div>
            )}
            <div className="text-xs text-white/40 mt-2 pt-2 border-t border-white/10">
              Last update: {agent.lastUpdate}
            </div>
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Active': return 'bg-success shadow-[0_0_10px_var(--success)]';
    case 'Idle': return 'bg-warning';
    case 'Error': return 'bg-error';
    default: return 'bg-white/20';
  }
}
