import React, { useState } from 'react';
import {
  Shield, Activity, Database, Ban, RefreshCw,
  Download, WifiOff, Eye, AlertOctagon, Zap
} from 'lucide-react';

const ACTION_GROUPS = [
  {
    label: 'Protection',
    color: 'cyan',
    actions: [
      { icon: Shield,       label: 'Enable Full Protection', desc: 'Activate all IDS/IPS rules',        status: 'active' },
      { icon: Eye,          label: 'Deep Scan Network',       desc: 'Run full packet inspection',        status: 'idle' },
      { icon: AlertOctagon, label: 'Emergency Lockdown',      desc: 'Block all inbound traffic',         status: 'danger' },
    ],
  },
  {
    label: 'Response',
    color: 'orange',
    actions: [
      { icon: Ban,          label: 'Block Last Threat IP',   desc: 'Add to permanent blocklist',        status: 'idle' },
      { icon: WifiOff,      label: 'Isolate Endpoint',       desc: 'Quarantine suspicious host',        status: 'idle' },
      { icon: RefreshCw,    label: 'Flush Blocklist',        desc: 'Remove all temporary blocks',       status: 'idle' },
    ],
  },
  {
    label: 'Reporting',
    color: 'purple',
    actions: [
      { icon: Download,     label: 'Export Threat Report',  desc: 'Download PDF incident summary',     status: 'idle' },
      { icon: Activity,     label: 'Live Traffic Dump',      desc: 'Capture 60s pcap snapshot',         status: 'idle' },
      { icon: Database,     label: 'Backup ML Models',       desc: 'Save current trained models',       status: 'idle' },
    ],
  },
];

const colorMap = {
  cyan:   { border: 'border-[#00f0ff]/30', bg: 'bg-[#00f0ff]/10', hover: 'hover:bg-[#00f0ff]/20', text: 'text-[#00f0ff]', glow: 'shadow-[0_0_12px_rgba(0,240,255,0.2)]' },
  orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', hover: 'hover:bg-orange-500/20', text: 'text-orange-400', glow: 'shadow-[0_0_12px_rgba(249,115,22,0.2)]' },
  purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', hover: 'hover:bg-purple-500/20', text: 'text-purple-400', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.2)]' },
};

const QuickActionsTab = () => {
  const [firing, setFiring] = useState(null);

  const handleAction = (label) => {
    setFiring(label);
    setTimeout(() => setFiring(null), 1800);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="glass-panel flex items-center gap-3 py-3 px-4">
        <Zap className="w-5 h-5 text-[#00f0ff]" />
        <div>
          <h2 className="text-sm font-black text-white tracking-widest uppercase">Quick Actions</h2>
          <p className="text-xs text-gray-500">One-tap system controls &amp; responses</p>
        </div>
      </div>

      {ACTION_GROUPS.map(({ label, color, actions }) => {
        const c = colorMap[color];
        return (
          <div key={label} className="glass-panel">
            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 pb-2
                            border-b border-white/5 ${c.text}`}>
              {label}
            </h3>
            <div className="flex flex-col gap-2">
              {actions.map(({ icon: Icon, label: actionLabel, desc, status }) => {
                const isFiring = firing === actionLabel;
                const isDanger = status === 'danger';
                return (
                  <button
                    key={actionLabel}
                    onClick={() => handleAction(actionLabel)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200
                                active:scale-[0.98]
                                ${isDanger
                                  ? 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20'
                                  : `${c.border} ${c.bg} ${c.hover}`}
                                ${isFiring ? c.glow : ''}`}
                  >
                    <div className={`p-2 rounded-lg ${isDanger ? 'bg-red-500/20' : c.bg}`}>
                      <Icon className={`w-4 h-4 ${isDanger ? 'text-red-400' : c.text}
                                       ${isFiring ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-bold ${isDanger ? 'text-red-400' : 'text-gray-200'}`}>
                        {actionLabel}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{desc}</div>
                    </div>
                    {isFiring && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                                       ${isDanger ? 'bg-red-500/20 text-red-400' : `${c.bg} ${c.text}`}`}>
                        EXECUTING…
                      </span>
                    )}
                    {status === 'active' && !isFiring && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                                       bg-emerald-500/20 text-emerald-400">
                        ON
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickActionsTab;