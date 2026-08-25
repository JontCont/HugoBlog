#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const options = {
  manifest: 'tests/playwright-test-index.json',
  workItems: [],
  cases: [],
  modules: [],
  tags: [],
  titles: [],
  specs: [],
  all: false,
};

for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];
  if (argument === '--all') {
    options.all = true;
    continue;
  }

  const keyByArgument = {
    '--manifest': 'manifest',
    '--work-item': 'workItems',
    '--case': 'cases',
    '--module': 'modules',
    '--tag': 'tags',
    '--title': 'titles',
    '--spec': 'specs',
  };
  const key = keyByArgument[argument];
  if (!key || index + 1 >= args.length) {
    throw new Error(`Unknown or incomplete argument: ${argument}`);
  }

  const value = args[index + 1];
  index += 1;
  if (key === 'manifest') {
    options.manifest = value;
  } else {
    options[key].push(value);
  }
}

const hasSelector = options.workItems.length
  || options.cases.length
  || options.modules.length
  || options.tags.length
  || options.titles.length
  || options.specs.length;
if (!hasSelector && !options.all) {
  throw new Error('At least one selector or --all is required.');
}

const manifestPath = path.resolve(options.manifest);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (manifest.version !== 1 || !Array.isArray(manifest.tests)) {
  throw new Error('Unsupported test index. Expected version 1 with a tests array.');
}

const seenCaseIds = new Set();
const tests = manifest.tests.map((entry, index) => {
  const requiredStrings = ['caseId', 'module', 'title', 'spec', 'status'];
  for (const field of requiredStrings) {
    if (typeof entry[field] !== 'string' || !entry[field].trim()) {
      throw new Error(`tests[${index}].${field} must be a non-empty string.`);
    }
  }
  if (entry.workItem !== undefined && (typeof entry.workItem !== 'string' || !entry.workItem.trim())) {
    throw new Error(`tests[${index}].workItem must be a non-empty string when present.`);
  }
  if (seenCaseIds.has(entry.caseId)) {
    throw new Error(`Duplicate caseId: ${entry.caseId}`);
  }
  seenCaseIds.add(entry.caseId);

  const normalizedSpec = entry.spec.replaceAll('\\', '/');
  if (path.isAbsolute(entry.spec) || normalizedSpec.split('/').includes('..')) {
    throw new Error(`Unsafe spec path for ${entry.caseId}: ${entry.spec}`);
  }
  if (!Array.isArray(entry.tags) || !entry.tags.every(tag => typeof tag === 'string' && tag.startsWith('@'))) {
    throw new Error(`Invalid tags for ${entry.caseId}.`);
  }
  if (!['active', 'archived'].includes(entry.status)) {
    throw new Error(`Invalid status for ${entry.caseId}: ${entry.status}`);
  }
  if (entry.status === 'archived') {
    if (typeof entry.archivedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.archivedAt)) {
      throw new Error(`Archived case ${entry.caseId} requires archivedAt in YYYY-MM-DD format.`);
    }
    if (typeof entry.archiveReason !== 'string' || !entry.archiveReason.trim()) {
      throw new Error(`Archived case ${entry.caseId} requires archiveReason.`);
    }
    if (entry.replacedBy !== undefined && (typeof entry.replacedBy !== 'string' || entry.replacedBy === entry.caseId)) {
      throw new Error(`Invalid replacedBy for archived case ${entry.caseId}.`);
    }
  }

  return { ...entry, spec: normalizedSpec };
});

for (const test of tests) {
  if (test.status === 'archived' && test.replacedBy && !seenCaseIds.has(test.replacedBy)) {
    throw new Error(`Archived case ${test.caseId} references unknown replacement ${test.replacedBy}.`);
  }
}

const matchesAny = (actual, expected) => !expected.length || expected.includes(actual);
const selected = tests.filter(test => {
  if (test.status !== 'active') {
    return false;
  }
  const titleMatches = !options.titles.length
    || options.titles.some(title => test.title.toLowerCase().includes(title.toLowerCase()));
  const tagMatches = !options.tags.length
    || options.tags.some(tag => test.tags.includes(tag));
  return matchesAny(test.caseId, options.cases)
    && matchesAny(test.workItem, options.workItems)
    && matchesAny(test.module, options.modules)
    && matchesAny(test.spec, options.specs.map(spec => spec.replaceAll('\\', '/')))
    && titleMatches
    && tagMatches;
});

if (!selected.length) {
  const requestedArchivedCases = tests.filter(test => test.status === 'archived' && options.cases.includes(test.caseId));
  if (requestedArchivedCases.length) {
    const details = requestedArchivedCases.map(test => {
      const replacement = test.replacedBy ? `; replaced by ${test.replacedBy}` : '';
      return `${test.caseId} archived ${test.archivedAt}: ${test.archiveReason}${replacement}`;
    });
    throw new Error(`Archived test cases cannot be executed. ${details.join(' | ')}`);
  }
  throw new Error('No indexed tests matched the supplied selectors.');
}

const result = {
  manifest: path.relative(process.cwd(), manifestPath).replaceAll('\\', '/'),
  count: selected.length,
  caseIds: selected.map(test => test.caseId),
  specs: [...new Set(selected.map(test => test.spec))],
  tests: selected,
};

console.log(JSON.stringify(result, null, 2));