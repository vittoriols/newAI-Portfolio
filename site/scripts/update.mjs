// Updates the whole site in one go.
//
//   npm run update                     preview: imports, checks, build, local preview
//   npm run update -- --linkedin <zip> also compares a LinkedIn export (add --apply to write it)
//   npm run update:publish             same checks, then commit and push to master (= deploy)
//   npm run update:publish -- --worker also redeploys the AskMe Worker
//
// Nothing is published without your confirmation. A failing test or build
// stops everything before the commit.

import { spawnSync, spawn } from 'node:child_process';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const publish = args.includes('--publish');
const withWorker = args.includes('--worker');
const apply = args.includes('--apply');
const linkedinArg = args.includes('--linkedin') ? args[args.indexOf('--linkedin') + 1] : null;
const isWindows = process.platform === 'win32';
const repo = path.resolve('..');
// With a shell (Windows), arguments with spaces need quotes.
const q = (s) => (isWindows ? `"${s}"` : s);

const results = [];
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const color = { ok: '\x1b[32m', warn: '\x1b[33m', fail: '\x1b[31m', skip: '\x1b[90m' };

function step(title) {
  console.log(`\n${bold(`▸ ${title}`)}`);
}

function record(name, status, note = '') {
  results.push({ name, status, note });
}

// Runs a command with live output. Returns true when it succeeds.
// On Windows npm and npx are .cmd files and need a shell: the command is then
// passed as a single line, with arguments quoted by q().
function spawnArgs(cmd, cmdArgs) {
  return isWindows ? [[cmd, ...cmdArgs].join(' '), []] : [cmd, cmdArgs];
}

function run(cmd, cmdArgs, opts = {}) {
  const [c, a] = spawnArgs(cmd, cmdArgs);
  const r = spawnSync(c, a, { stdio: 'inherit', shell: isWindows, cwd: opts.cwd ?? process.cwd(), env: process.env });
  return r.status === 0;
}

function capture(cmd, cmdArgs, cwd = repo) {
  const [c, a] = spawnArgs(cmd, cmdArgs);
  const r = spawnSync(c, a, { encoding: 'utf8', shell: isWindows, cwd });
  return (r.stdout ?? '').trim();
}

// The newest LinkedIn export in Downloads, if no path was given.
function findLinkedinExport() {
  if (linkedinArg && !linkedinArg.startsWith('--')) return path.resolve(linkedinArg);
  const downloads = path.join(os.homedir(), 'Downloads');
  if (!existsSync(downloads)) return null;
  const zips = readdirSync(downloads)
    .filter((f) => /LinkedInDataExport.*\.zip$/i.test(f))
    .map((f) => ({ f: path.join(downloads, f), t: statSync(path.join(downloads, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  return zips[0]?.f ?? null;
}

function summary() {
  console.log(`\n${bold('Summary')}`);
  for (const r of results) {
    const label = { ok: 'done', warn: 'warning', fail: 'FAILED', skip: 'skipped' }[r.status];
    console.log(`  ${color[r.status]}${label.padEnd(8)}\x1b[0m ${r.name}${r.note ? `  (${r.note})` : ''}`);
  }
}

async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`${question} [y/N] `)).trim().toLowerCase();
  rl.close();
  return answer === 'y' || answer === 'yes' || answer === 's' || answer === 'si';
}

async function main() {
  console.log(bold(publish ? 'Site update: check and publish' : 'Site update: local preview'));

  // 1. Credly
  step('Badges from Credly');
  const credlyOk = run('npm', ['run', '--silent', 'import:credly']);
  record('Credly import', credlyOk ? 'ok' : 'warn', credlyOk ? '' : 'Credly did not answer: the saved badges are used');

  // 2. LinkedIn (only if an export is available)
  step('Roles from LinkedIn');
  const zip = findLinkedinExport();
  if (!zip) {
    console.log('No LinkedIn export found in Downloads: skipped. Pass one with --linkedin <file.zip>.');
    record('LinkedIn comparison', 'skip', 'no export');
  } else {
    console.log(`Export: ${zip}`);
    const ok = run('npm', ['run', '--silent', 'import:linkedin', '--', q(zip), ...(apply ? ['--write'] : [])]);
    record(apply ? 'LinkedIn import (applied)' : 'LinkedIn comparison', ok ? 'ok' : 'warn', apply ? '' : 'add --apply to write the changes');
  }

  // 3. Worker tests
  step('AskMe Worker tests');
  const testsOk = run('npm', ['test', '--silent']);
  record('Worker tests', testsOk ? 'ok' : 'fail');
  if (!testsOk) { summary(); process.exit(1); }

  // 4. AskMe test questions (needs a Groq key in the environment)
  step('AskMe test questions');
  if (process.env.GROQ_API_KEY) {
    record('AskMe answers', run('npm', ['run', '--silent', 'askme:check']) ? 'ok' : 'warn', 'see the answers above');
  } else {
    console.log('GROQ_API_KEY is not set in this terminal: skipped.');
    record('AskMe answers', 'skip', 'set GROQ_API_KEY to run them');
  }

  // 5. Build
  step('Build');
  const buildOk = run('npm', ['run', '--silent', 'build']);
  record('Build', buildOk ? 'ok' : 'fail');
  if (!buildOk) { summary(); process.exit(1); }

  // What changed in the content since the last commit.
  const changes = capture('git', ['status', '--porcelain', '--', 'site']);
  const changed = changes ? changes.split('\n') : [];

  if (!publish) {
    summary();
    console.log(`\n${bold('Changes not yet published')}: ${changed.length ? '' : 'none'}`);
    changed.slice(0, 30).forEach((l) => console.log(`  ${l}`));
    if (changed.length > 30) console.log(`  ... and ${changed.length - 30} more`);
    console.log(`\n${bold('Preview')}: http://localhost:4321/newAI-Portfolio/  (Ctrl+C to stop)`);
    console.log('If it convinces you: npm run update:publish\n');
    const [c, a] = spawnArgs('npm', ['run', '--silent', 'preview', '--', '--port', '4321']);
    spawn(c, a, { stdio: 'inherit', shell: isWindows });
    return;
  }

  // 6. Publish: commit and push to master
  step('Publish');
  const branch = capture('git', ['branch', '--show-current']);
  if (branch !== 'master') {
    console.log(`You are on "${branch}": the site is published only from master.`);
    console.log('Merge this branch into master first (or open a pull request), then run the command again from master.');
    record('Publish', 'skip', `branch ${branch}`);
    summary();
    process.exit(1);
  }

  const allChanges = capture('git', ['status', '--porcelain']);
  if (!allChanges && !withWorker) {
    console.log('Nothing to publish: the site is already in line with the repository.');
    record('Publish', 'skip', 'no changes');
    summary();
    return;
  }

  if (allChanges) {
    console.log('These changes will be committed and pushed:');
    allChanges.split('\n').forEach((l) => console.log(`  ${l}`));
    if (!(await confirm('\nPublish them?'))) {
      record('Publish', 'skip', 'cancelled');
      summary();
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    const ok = run('git', ['add', '-A'], { cwd: repo })
      && run('git', ['commit', '-m', q(`Update site content ${date}`)], { cwd: repo })
      && run('git', ['push', 'origin', 'master'], { cwd: repo });
    record('Commit and push', ok ? 'ok' : 'fail', ok ? 'GitHub Actions publishes in about a minute' : '');
    if (!ok) { summary(); process.exit(1); }
  }

  // 7. Worker (only on request)
  if (withWorker) {
    step('AskMe Worker deploy');
    record('Worker deploy', run('npx', ['wrangler', 'deploy'], { cwd: path.resolve('worker') }) ? 'ok' : 'fail');
  }

  summary();
  const remote = capture('git', ['remote', 'get-url', 'origin']).replace(/\.git$/, '');
  if (remote.startsWith('https://github.com/')) console.log(`\nFollow the deploy: ${remote}/actions`);
}

main().catch((err) => {
  console.error(`update failed: ${err.message}`);
  process.exit(1);
});
