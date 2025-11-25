#!/usr/bin/env python3
"""
Agent Status Dashboard

Displays current status of all governance agents by parsing memory bank files.
Shows active work, recent activity, and health status.
"""

import os
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

# Paths
REPO_ROOT = Path(__file__).parent.parent
MEMORY_BANK = REPO_ROOT / "memory-bank"
AGENT_BANKS = REPO_ROOT / "agent-memory-banks"
ACTIVE_CONTEXT = MEMORY_BANK / "activeContext.md"
AGENT_LOGBOOK = MEMORY_BANK / "agent-logbook.md"

# Agent definitions
AGENTS = [
    "Governance Monitor",
    "Report Processor",
    "Standards Updater",
    "Compliance Checker"
]

def parse_active_agents_table(content: str) -> Dict[str, Dict]:
    """Parse Active Agents table from activeContext.md"""
    agents_data = {}
    
    # Find table section
    table_pattern = r"\| Agent Role \| Status \| Current Task \| Last Update \|.*?\n\|[-\s|]+\|.*?\n((?:\|.*?\n)+)"
    match = re.search(table_pattern, content, re.MULTILINE)
    
    if not match:
        return agents_data
    
    table_rows = match.group(1).strip().split('\n')
    
    for row in table_rows:
        parts = [p.strip() for p in row.split('|')[1:-1]]  # Remove empty first/last
        if len(parts) >= 4:
            role, status, task, last_update = parts[:4]
            agents_data[role] = {
                'status': status,
                'task': task if task != '-' else None,
                'last_update': last_update
            }
    
    return agents_data

def get_latest_logbook_entry(agent_name: str) -> Optional[Dict]:
    """Get most recent logbook entry for an agent"""
    if not AGENT_LOGBOOK.exists():
        return None
    
    content = AGENT_LOGBOOK.read_text()
    
    # Pattern: ## YYYY-MM-DD HH:MM - Agent Name → ...
    pattern = rf"##\s+(\d{{4}}-\d{{2}}-\d{{2}})\s+(\d{{2}}:\d{{2}})\s+-\s+{re.escape(agent_name)}\s+→\s+(.*?)\n\*\*Status\*\*:\s+(.*?)\n"
    
    matches = list(re.finditer(pattern, content, re.MULTILINE))
    
    if not matches:
        return None
    
    # Get most recent
    latest = matches[-1]
    
    return {
        'date': latest.group(1),
        'time': latest.group(2),
        'handoff_to': latest.group(3),
        'status': latest.group(4)
    }

def check_agent_health(agent_name: str, last_update: Optional[str]) -> str:
    """Determine agent health status"""
    if not last_update or last_update == '-':
        return "🟡 Unknown"
    
    try:
        # Parse last update time
        now = datetime.now()
        # Assume last_update is in format HH:MM or YYYY-MM-DD HH:MM
        if ':' in last_update:
            if len(last_update) > 5:  # Has date
                update_time = datetime.strptime(last_update, "%Y-%m-%d %H:%M")
            else:  # Just time, assume today
                time_part = datetime.strptime(last_update, "%H:%M").time()
                update_time = datetime.combine(now.date(), time_part)
        else:
            return "🟡 Unknown"
        
        time_diff = now - update_time
        
        if time_diff < timedelta(hours=4):
            return "🟢 Healthy"
        elif time_diff < timedelta(hours=24):
            return "🟡 Idle"
        else:
            return "🔴 Stale"
    except:
        return "🟡 Unknown"

def print_dashboard():
    """Print agent status dashboard"""
    print("=" * 80)
    print(" " * 25 + "AGENT STATUS DASHBOARD")
    print("=" * 80)
    print()
    
    # Read active context
    active_agents = {}
    if ACTIVE_CONTEXT.exists():
        content = ACTIVE_CONTEXT.read_text()
        active_agents = parse_active_agents_table(content)
    
    print(f"{'Agent Role':<25} {'Status':<12} {'Health':<15} {'Current Task':<30}")
    print("-" * 85)
    
    for agent in AGENTS:
        agent_data = active_agents.get(agent, {})
        status = agent_data.get('status', 'Unknown')
        task = agent_data.get('task', '-')
        last_update = agent_data.get('last_update', '-')
        
        health = check_agent_health(agent, last_update)
        
        # Truncate task if too long
        if task and len(task) > 28:
            task = task[:25] + "..."
        
        print(f"{agent:<25} {status:<12} {health:<15} {task or '-':<30}")
    
    print()
    print("=" * 80)
    print()
    
    # Show recent logbook activity
    print("RECENT ACTIVITY (Last 5 entries):")
    print("-" * 80)
    
    if AGENT_LOGBOOK.exists():
        content = AGENT_LOGBOOK.read_text()
        entries = re.findall(r'##\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})\s+-\s+(.+?)\s+→\s+(.+?)\n', content)
        
        for timestamp, from_agent, to_agent in entries[-5:]:
            print(f"{timestamp} | {from_agent:<25} → {to_agent}")
    else:
        print("No logbook entries found")
    
    print()
    print("=" * 80)
    
    # Health summary
    if active_agents:
        active_count = sum(1 for a in active_agents.values() if a.get('status') == 'Active')
        print(f"\n📊 Summary: {active_count}/{len(AGENTS)} agents active")
    
    print()

if __name__ == "__main__":
    try:
        print_dashboard()
    except Exception as e:
        print(f"❌ Error generating dashboard: {e}")
        import traceback
        traceback.print_exc()
