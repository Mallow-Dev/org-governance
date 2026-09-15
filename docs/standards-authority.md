# Mallow standards authority

This contract separates governance applicability from normative engineering requirements and their implementations.

| Source | Owns | Does not independently own |
|---|---|---|
| [`Mallow-Dev/org-governance`](https://github.com/Mallow-Dev/org-governance) | Applicability, repository classes, governance profiles, branch/governance policy, approval boundaries, exceptions and the policy index | Detailed normative engineering requirements or provider runtime truth |
| [`Mallow-Dev/org-engineering-standards`](https://github.com/Mallow-Dev/org-engineering-standards) | Normative engineering requirements, schemas and engineering-policy adoption guidance | Organisation applicability/exception policy or executable package/runtime truth |
| [`Mallow-Dev/standards`](https://github.com/Mallow-Dev/standards) | Executable shared configuration and packages implementing approved requirements | Independent policy definition |
| [`Mallow-Dev/ops-deploy-standard`](https://github.com/Mallow-Dev/ops-deploy-standard) | Conforming deployment/reference tooling | Independent policy definition or live deployment truth |

The Notion **Mallow Standards** area is a human-readable portal/index. It must link to the version-controlled source, owner, status and review date and must not become a competing policy authority.

## Conflict resolution

- For whether a requirement applies, which governance profile is active, or whether an exception is valid, `org-governance` wins.
- For what the applicable engineering requirement says, `org-engineering-standards` wins.
- An implementation package or deployment example cannot weaken or supersede either source.
- Live GitHub and provider reads prove actual enforcement/deployment state; prose alone is not runtime evidence.

Report unresolved contradictions instead of silently choosing a convenient source. A change spanning applicability and normative content requires coordinated review in both authority repositories.
