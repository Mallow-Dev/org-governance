import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
// @ts-ignore -- executable ESM contract intentionally has no build step.
import { validateIndex, renderIndex } from '../scripts/standards-index.mjs';

const original = JSON.parse(readFileSync('policies/standards-index.json', 'utf8'));
const copy = () => structuredClone(original);

test('canonical index and generated projection agree', () => {
  assert.equal(validateIndex(copy()).status, 'candidate');
  assert.equal(renderIndex(copy()), readFileSync('policies/policy-index.md', 'utf8'));
});
for (const [name, mutate] of [
  ['duplicate source', (v: any) => v.sources.push(v.sources[0])],
  ['unknown root field', (v: any) => { v.trustMe = true; }],
  ['missing owner', (v: any) => { delete v.sources[0].owner; }],
  ['unknown source field', (v: any) => { v.sources[0].skip = true; }],
  ['implementation claims normative authority', (v: any) => { v.sources[2].role = 'normative'; v.sources[2].repository = 'Mallow-Dev/standards'; }],
  ['wrong applicability owner', (v: any) => { v.authority.applicability = 'Mallow-Dev/standards'; }],
  ['candidate promoted to effective', (v: any) => { v.status = 'effective'; }],
  ['unapproved effective release', (v: any) => { v.effective_release = '1.0.0'; }],
  ['candidate normative source marked current', (v: any) => { const s = v.sources.find((s: any) => s.role === 'normative'); s.status = 'current'; }],
  ['unsafe source path', (v: any) => { v.sources[0].path = '../other'; }],
  ['ambiguous path', (v: any) => { v.sources[0].path = 'docs//authority.md'; }],
  ['empty sources', (v: any) => { v.sources = []; }],
  ['external surface invents authority', (v: any) => { v.external_surfaces[0].role = 'normative'; }],
  ['duplicate external surface', (v: any) => v.external_surfaces.push(v.external_surfaces[0])],
  ['markup injection', (v: any) => { v.sources[0].note = '<script>bad</script>'; }],
] as const) {
  test(`rejects ${name}`, () => { const value = copy(); mutate(value); assert.throws(() => validateIndex(value)); });
}
test('retired synchroniser fails without a token or provider access', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/sync-branch-protection.ts'], {
    cwd: process.cwd(), encoding: 'utf8', timeout: 10000,
    env: { PATH: process.env.PATH, HOME: process.env.HOME },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no provider writes performed/);
  const source = readFileSync('scripts/sync-branch-protection.ts', 'utf8');
  assert.doesNotMatch(source, /updateBranchProtection|new Octokit|dotenv\.config/);
  assert.doesNotMatch(readFileSync('github-settings/branch-protection-rules.yaml', 'utf8'), /required_approving_review_count|ci-tests|allow_force_pushes/);
});
