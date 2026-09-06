# Organizational Governance Repository

> **Governance authority** for applicability, repository classes, governance profiles, branch/governance policy, exceptions, approval boundaries, and the organisation policy index.

## Purpose

This repository is the organisation governance layer. Detailed normative engineering requirements live in [`Mallow-Dev/org-engineering-standards`](https://github.com/Mallow-Dev/org-engineering-standards); executable shared configuration lives in [`Mallow-Dev/standards`](https://github.com/Mallow-Dev/standards); deployment/reference tooling lives in [`Mallow-Dev/ops-deploy-standard`](https://github.com/Mallow-Dev/ops-deploy-standard).

This repository provides:

- ✅ **Version-controlled** standards and policies
- ✅ **Authoritative applicability and exception rules** for organisation governance
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

## Standards authority and precedence

See [Standards authority](docs/standards-authority.md) for the complete source-of-truth contract.

When documents conflict:

1. This repository wins for applicability, repository classification, governance profiles, branch/governance policy, approval boundaries and exceptions.
2. `Mallow-Dev/org-engineering-standards` wins for the normative engineering requirement itself.
3. `Mallow-Dev/standards` and `Mallow-Dev/ops-deploy-standard` are implementation/tooling layers and must conform to the first two sources rather than redefine them.
4. Live GitHub/provider state is the evidence authority for what is actually enforced or deployed.

Older engineering guidance retained here remains historical or transitional unless the policy index explicitly identifies it as current. Do not copy a detailed engineering requirement here merely for convenience; link to its normative source.

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

## Repository classes

The default branch-protection rules apply to normal product and runtime repositories. The only lightweight exemption is the exact repository-name prefix **agent-plugin-**. It keeps pull requests, one approval, admin enforcement, conversation resolution, no force-pushes, and no branch deletion, while requiring the repository's **plugin-validation** check instead of the default two approvals, CODEOWNER review, application CI, and security-scan checks. Repositories beginning with **agent-** but not **agent-plugin-** remain on the normal rules.

The live synchronizer in `scripts/sync-branch-protection.ts` selects this class by the exact prefix and applies the matching `main` rules.

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
