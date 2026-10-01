# Mallow governance execution entry point

Read `policies/standards-index.json` and its generated `policies/policy-index.md`
projection before interpreting organisation instructions. Governance owns
applicability, profiles, exceptions and this index; normative engineering
requirements belong in `Mallow-Dev/org-engineering-standards`.

Run `npm ci`, `npm test` and `npm run standards:check` on Node.js 24.
Use `npm run standards:render` after changing the canonical index. Do not edit
its generated Markdown independently. Do not run the retired protection sync.

An implementation, green local test, draft policy or prose approval is not proof
of provider enforcement. Read live controls before consequential operations.
Preserve the public/private boundary: private engineering requirements, provider
snapshots, credentials and durable evidence must not be copied into this public
repository. No independent approval, protected merge or provider mutation is
implied by a source change.
