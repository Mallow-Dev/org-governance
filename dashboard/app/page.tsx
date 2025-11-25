import { AgentStatus, AgentData } from "@/components/AgentStatus";
import { DashboardCard } from "@/components/DashboardCard";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

export default function Home() {
  const agents: AgentData[] = [
    { role: "Governance Monitor", status: "Active", currentTask: "Scanning repo: stock-v3", lastUpdate: "2 mins ago" },
    { role: "Report Processor", status: "Idle", lastUpdate: "1 hour ago" },
    { role: "Standards Updater", status: "Active", currentTask: "Updating PR guidelines", lastUpdate: "5 mins ago" },
    { role: "Compliance Checker", status: "Active", currentTask: "Validating branch protection", lastUpdate: "10 mins ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-white/50 mt-1">Real-time governance overview</p>
        </div>
        <div className="flex gap-4">
           {/* Actions */}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Shield size={24} />
            </div>
            <div>
              <div className="text-sm text-white/50">Health Score</div>
              <div className="text-2xl font-bold text-white">92/100</div>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="text-sm text-white/50">Compliant Repos</div>
              <div className="text-2xl font-bold text-white">14/15</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-sm text-white/50">Active Violations</div>
              <div className="text-2xl font-bold text-white">3</div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/20 text-amber-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-sm text-white/50">Weekly Trend</div>
              <div className="text-2xl font-bold text-emerald-400">+5%</div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Agents Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Active Agents</h3>
        <AgentStatus agents={agents} />
      </div>

      {/* Recent Activity / Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div className="flex-1">
                  <div className="text-sm text-white">Governance Monitor scanned <b>stock-v3</b></div>
                  <div className="text-xs text-white/50">2 minutes ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Critical Issues</h3>
           <div className="space-y-4">
            <div className="glass-panel p-4 border-l-4 border-l-rose-500 bg-rose-500/5">
              <div className="font-medium text-rose-200">Missing Branch Protection</div>
              <div className="text-sm text-white/60 mt-1">Repo: payments-api</div>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
}
