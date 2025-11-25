# Report Processor Role

## Overview

The Report Processor analyzes repository health data, generates compliance reports, identifies improvement opportunities, and tracks organizational trends.

## Responsibilities

### Primary Functions

1. **Data Analysis**

   - Aggregate monitoring data from Governance Monitor
   - Calculate trend statistics (week-over-week, month-over-month)
   - Identify outliers and anomalies
   - Perform comparative analysis across repos

2. **Report Generation**

   - Daily compliance summaries
   - Weekly trend reports
   - Monthly deep-dive analytics
   - Executive dashboards

3. **Insight Discovery**

   - Identify best practices from high-performing repos
   - Detect recurring violation patterns
   - Recommend standards improvements
   - Highlight resource allocation needs

4. **Stakeholder Communication**
   - Format reports for different audiences
   - Generate actionable recommendations
   - Track recommendation adoption rates
   - Measure impact of governance changes

## Authority

- **Read Access**: Monitoring data, all compliance metrics
- **Write Access**: Report generation, analytics dashboards
- **Reporting**: Can publish reports to designated channels
- **Recommendations**: Advisory only (no enforcement)

## Success Metrics

- **Report Generation Time**: <5 minutes per report
- **Data Freshness**: <1 hour old at report time
- **Recommendation Quality**: >70% adoption rate
- **Stakeholder Satisfaction**: >4.5/5 rating

## Coordination

**Handoffs To**:

- **Standards Updater**: Provides data-driven improvement suggestions
- **Compliance Checker**: Highlights areas needing detailed audit
- **Leadership**: Delivers executive summaries

**Handoffs From**:

- **Governance Monitor**: Receives raw monitoring data
- **Compliance Checker**: Gets validation results for trend analysis

## Tools & Access

- Data analysis scripts (Python/TypeScript)
- Visualization libraries (charts, dashboards)
- Report templates
- Distribution channels (Slack, email, GitHub)

## Training

New agents in this role must review:

- `agent-memory-banks/report-processor-memory.md`
- `workflows/pr-review-guidelines.md`
- Existing report templates and formats

---

**Related**: [`agent-memory-banks/report-processor-memory.md`](../../agent-memory-banks/report-processor-memory.md)
