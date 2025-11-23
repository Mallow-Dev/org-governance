# Organizational Governance Repository

> **Single Source of Truth** for organizational standards, workflows, policies, and best practices.

## Purpose

This repository serves as the centralized documentation hub for all development standards, workflows, and policies across the organization. It provides:

- ✅ **Version-controlled** standards and policies
- ✅ **Single source of truth** for all organizational documentation
- ✅ **Discoverable** and easily referenced guidelines
- ✅ **Auditable** change history for compliance
- ✅ **AI-accessible** context for agents and automation

## Repository Structure

```
org-governance/
├── workflows/              # Development workflows (Git, CI/CD, releases)
├── standards/              # Coding standards and best practices
│   └── code-style-guides/  # Language-specific style guides
├── templates/              # Reusable templates (PRs, issues, repos)
│   └── issue-templates/    # GitHub issue templates
├── policies/               # Organizational policies and governance
├── github-settings/        # Declarative GitHub repository settings
└── mcp/                    # MCP (Model Context Protocol) integration
```

## Quick Links

### Workflows

- [Git Branching Strategy](workflows/git-branching-strategy.md) - Branch naming, merge strategy, release process
- [PR Review Guidelines](workflows/pr-review-guidelines.md) - Code review standards
- [Release Process](workflows/release-process.md) - How to create releases
- [Hotfix Procedures](workflows/hotfix-procedures.md) - Emergency fix workflow

### Standards

- [Conventional Commits](standards/conventional-commits.md) - Commit message format
- [API Design Standards](standards/api-design-standards.md) - RESTful API guidelines

### Templates

- [Pull Request Template](templates/pull-request-template.md)
- [Issue Templates](templates/issue-templates/)
- [Repository Structure](templates/repository-structure.md)

### Policies

- [Code of Conduct](policies/code-of-conduct.md)
- [Security Policy](policies/security-policy.md)
- [Contribution Guidelines](policies/contribution-guidelines.md)

## Usage

### For Developers

1. **Reference before starting work**: Check relevant workflow docs
2. **Follow standards**: Adhere to coding standards and conventions
3. **Use templates**: Leverage templates for PRs and issues
4. **Propose changes**: Submit PRs to update docs as needed

### For AI Agents

1. **Query via MCP**: Access governance docs through MCP server
2. **Validate work**: Check if work follows organizational standards
3. **Self-correct**: Adjust based on policy violations

### For Project Managers

1. **Onboarding**: Share relevant docs with new team members
2. **Compliance**: Ensure teams follow established processes
3. **Updates**: Keep documentation current with process changes

## Contributing

To update or add documentation:

1. Create a feature branch from `main`
2. Make your changes
3. Submit a PR with clear description of changes
4. Get approval from relevant stakeholders
5. Merge to `main` and tag with version

## Versioning

This repository uses semantic versioning for documentation:

- **Major** (v2.0.0): Significant policy or workflow changes
- **Minor** (v1.1.0): New standards or templates added
- **Patch** (v1.0.1): Clarifications, typo fixes, minor updates

Current Version: **v1.0.0**

## MCP Integration

This repository is designed to be consumed by AI agents via the Model Context Protocol (MCP). See [mcp/README.md](mcp/README.md) for integration details.

## License

MIT License - See [LICENSE](LICENSE) for details

## Maintenance

This repository is maintained by the organization's technical leadership. For questions or suggestions:

- Open an issue in this repository
- Contact the technical governance team

---

**Last Updated**: 2025-11-23  
**Maintained by**: Organization Technical Leadership
