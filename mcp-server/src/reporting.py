import datetime
from typing import Dict, Any

class ComplianceReporter:
    def __init__(self):
        pass

    def generate_report(self, data: Dict[str, Any], format: str = "markdown") -> str:
        """
        Generate a compliance report based on the provided data.
        """
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if format == "markdown":
            return self._generate_markdown_report(data, timestamp)
        else:
            return "Unsupported format"

    def _generate_markdown_report(self, data: Dict[str, Any], timestamp: str) -> str:
        report = f"# Compliance Report\n\n"
        report += f"**Generated**: {timestamp}\n\n"
        
        report += "## Executive Summary\n"
        report += f"- **Overall Health Score**: {data.get('health_score', 'N/A')}\n"
        report += f"- **Active Violations**: {data.get('active_violations', 0)}\n"
        report += f"- **Compliant Repositories**: {data.get('compliant_repos', 0)}/{data.get('total_repos', 0)}\n\n"
        
        report += "## Repository Status\n\n"
        report += "| Repository | Status | Issues |\n"
        report += "|Data | --- | --- |\n"
        
        for repo in data.get('repositories', []):
            status = "✅" if repo.get('compliant') else "❌"
            issues = ", ".join(repo.get('issues', [])) or "None"
            report += f"| {repo.get('name')} | {status} | {issues} |\n"
            
        report += "\n## Recommendations\n"
        for rec in data.get('recommendations', []):
            report += f"- {rec}\n"
            
        return report

# Mock data provider for demonstration
def get_mock_compliance_data():
    return {
        "health_score": 92,
        "active_violations": 3,
        "compliant_repos": 14,
        "total_repos": 15,
        "repositories": [
            {"name": "stock-v3", "compliant": True, "issues": []},
            {"name": "payments-api", "compliant": False, "issues": ["Missing Branch Protection"]},
            {"name": "org-governance", "compliant": True, "issues": []}
        ],
        "recommendations": [
            "Enable branch protection on 'payments-api' immediately.",
            "Review stale branches in 'stock-v3'."
        ]
    }
