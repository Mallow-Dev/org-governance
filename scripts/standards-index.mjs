#!/usr/bin/env node
/** Canonical authority-index validator and renderer. No network or provider writes. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const GOVERNANCE = 'Mallow-Dev/org-governance';
const ENGINEERING = 'Mallow-Dev/org-engineering-standards';
const ROLES = new Set(['governance', 'normative', 'implementation', 'proposal', 'guidance', 'historical']);
const STATES = new Set(['candidate', 'current', 'transitional', 'historical']);
const DISPOSITIONS = new Set(['retain', 'implement-only', 'migrate', 'supersede', 'reference-only']);
const SEMVER = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function exactKeys(value, expected, context) {
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error(`${context}: object required`);
  const actual = Object.keys(value).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) throw new Error(`${context}: missing or unknown fields`);
}
function text(value, context) {
  if (typeof value !== 'string' || !value.trim() || /[\r\n\x00-\x1f|<>]/.test(value)) throw new Error(`${context}: safe non-empty single-line text required`);
}

export function validateIndex(index) {
  exactKeys(index, ['schema_version', 'catalogue_version', 'status', 'effective_release', 'authority', 'sources', 'external_surfaces'], 'index');
  if (index.schema_version !== '1.0.0' || !SEMVER.test(index.catalogue_version)) throw new Error('unsupported schema or catalogue version');
  // This implementation delivers a candidate, never self-authorises effective policy.
  if (index.status !== 'candidate' || index.effective_release !== null) throw new Error('effective policy requires a separately approved publication contract');
  exactKeys(index.authority, ['applicability', 'requirements', 'packages', 'deployment', 'provider_evidence'], 'authority');
  const expected = {
    applicability: GOVERNANCE,
    requirements: ENGINEERING,
    packages: 'Mallow-Dev/standards',
    deployment: 'Mallow-Dev/ops-deploy-standard',
    provider_evidence: 'Live GitHub and provider state',
  };
  for (const key of Object.keys(expected)) if (index.authority[key] !== expected[key]) throw new Error(`authority mismatch: ${key}`);
  if (!Array.isArray(index.sources) || !index.sources.length) throw new Error('sources must not be empty');
  const ids = new Set();
  const locations = new Set();
  for (const source of index.sources) {
    exactKeys(source, ['id', 'title', 'repository', 'path', 'role', 'status', 'owner', 'disposition', 'note'], 'source');
    for (const key of Object.keys(source)) text(source[key], `source.${key}`);
    if (!/^[a-z][a-z0-9-]*$/.test(source.id) || ids.has(source.id)) throw new Error(`invalid or duplicate source ID: ${source.id}`);
    ids.add(source.id);
    if (!/^Mallow-Dev\/[A-Za-z0-9_.-]+$/.test(source.repository)) throw new Error('repository must be in Mallow-Dev');
    if (!/^[A-Za-z0-9_.*/-]+$/.test(source.path) || source.path.startsWith('/') || source.path.split('/').some(p => p === '..' || p === '.' || !p)) throw new Error('unsafe source path');
    const location = `${source.repository}:${source.path}`;
    if (locations.has(location)) throw new Error(`duplicate source location: ${location}`);
    locations.add(location);
    if (!ROLES.has(source.role) || !STATES.has(source.status) || !DISPOSITIONS.has(source.disposition)) throw new Error('unknown role, lifecycle or disposition');
    if (source.role === 'normative' && source.repository !== ENGINEERING) throw new Error('normative engineering authority is not an implementation repository');
    if (source.role === 'normative' && source.status !== 'candidate') throw new Error('candidate index cannot promote normative requirements to current policy');
    if (source.role === 'governance' && source.repository !== GOVERNANCE) throw new Error('governance applicability authority mismatch');
    if (['implementation', 'guidance', 'historical', 'proposal'].includes(source.role) && source.disposition === 'retain' && source.role !== 'guidance') throw new Error('non-authoritative material needs an explicit non-normative disposition');
  }
  if (!Array.isArray(index.external_surfaces) || !index.external_surfaces.length) throw new Error('external surfaces required');
  const surfaceIds = new Set();
  for (const surface of index.external_surfaces) {
    exactKeys(surface, ['id', 'surface', 'role', 'rule'], 'external surface');
    for (const key of Object.keys(surface)) text(surface[key], `surface.${key}`);
    if (surfaceIds.has(surface.id) || ids.has(surface.id)) throw new Error('duplicate external surface ID');
    surfaceIds.add(surface.id);
    if (!['projection', 'proposal', 'execution-evidence', 'local-declaration', 'historical'].includes(surface.role)) throw new Error('external surfaces cannot create normative authority');
  }
  return index;
}

export function renderIndex(index) {
  validateIndex(index);
  const lines = [
    '# Mallow Standards - organisation policy index', '',
    `Catalogue interface: \`${index.catalogue_version}\`. **Candidate; no effective release is published by this index.**`, '',
    '<!-- Generated by scripts/standards-index.mjs. Edit policies/standards-index.json, not this projection. -->', '',
    '## Start here', '',
    'This is the single governance index. It routes to the existing authorities; it is not a new independent engineering policy.', '',
    '- Applicability, repository classes, governance profiles and exceptions: `org-governance`.',
    '- Normative engineering requirements and control contracts: `org-engineering-standards`.',
    '- Shared packages and deployment tooling implement requirements; their defaults cannot redefine policy.',
    '- Live GitHub/provider reads prove actual enforcement. Source text proves intent, not deployment or adoption.', '',
    'The engineering [STANDARDS.md](https://github.com/Mallow-Dev/org-engineering-standards/blob/develop/STANDARDS.md) projection and candidate bundle provide the integrated reader/consumer view after their implementation PR lands. Until then, use the linked source documents. Never treat an open PR or mutable default-branch link as an effective immutable release.', '',
    '## Source catalogue', '',
    '| ID | Source | Role | Lifecycle | Disposition | Owner |',
    '|---|---|---|---|---|---|',
  ];
  for (const source of index.sources) lines.push(`| \`${source.id}\` | \`${source.repository}/${source.path}\` | ${source.role} | ${source.status} | ${source.disposition} | ${source.owner} |`);
  lines.push('', '## Source-specific boundaries', '');
  for (const source of index.sources) lines.push(`**${source.title}:** ${source.note}`, '');
  lines.push('## Other places instructions appear', '', '| Surface | Role | Operating rule |', '|---|---|---|');
  for (const surface of index.external_surfaces) lines.push(`| ${surface.surface} | ${surface.role} | ${surface.rule} |`);
  lines.push('', '## Change and adoption contract', '',
    'A standards change must identify its control IDs, authority, applicability, implementation, evidence, migration impact and approval boundary. A changed index must pass `npm run standards:check`. Detailed private controls and provider snapshots remain in the private engineering repository and Durable Results, not this public repository.', '',
    'Implementation state is not policy lifecycle or repository adoption. Unknown evidence stays UNKNOWN. Candidate bundles are advisory; declaring them effective is rejected by the current tooling. Human approval, source merges and formal publication remain separate gates.', '',
    'The legacy classic-branch-protection synchroniser is retired. `npm run sync:protection` fails without making a network request. Its former configuration is retained in Git history, not as an actionable source. No source reconciliation authorises weakening or automatically rewriting live rulesets.', '');
  return lines.join('\n');
}

function main() {
  if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Node.js 24.x is required');
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const args = process.argv.slice(2);
  if (args.length > 1 || !['check', 'render', 'validate'].includes(args[0] ?? 'check')) throw new Error('Usage: node scripts/standards-index.mjs [check|render|validate]');
  const index = validateIndex(JSON.parse(readFileSync(resolve(root, 'policies/standards-index.json'), 'utf8')));
  const rendered = renderIndex(index);
  const output = resolve(root, 'policies/policy-index.md');
  if (args[0] === 'render') writeFileSync(output, rendered);
  else if (args[0] !== 'validate' && readFileSync(output, 'utf8') !== rendered) throw new Error('generated policy index drift; run npm run standards:render');
  console.log(`PASS standards index: ${index.sources.length} sources; ${index.external_surfaces.length} external surfaces; candidate only`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
