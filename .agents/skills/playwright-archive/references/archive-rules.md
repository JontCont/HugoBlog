# Archive Rules

## Unit of Archive

- Archive one **change**, not one task.
- A change has one owning work item, one immutable lowercase kebab-case change ID, and one primary module.
- A change may contain many tasks, test cases, screenshot IDs, specs, and validation runs.
- Use a new change ID for a later enhancement to the same module.

## Default Layout

```text
docs/playwright/
├── changes/
│   └── auth-login-coverage/
│       ├── discussion.md
│       ├── proposal.md
│       └── tasks.md
└── archive/
    └── 2026-07-27-auth-login-coverage/
        ├── discussion.md
        ├── proposal.md
        ├── tasks.md
        └── archive-summary.md
```

Follow an established repository convention when it provides equivalent active and archive locations.

## Archive Gate

Required before archive:

- Work item, change identity, and module agree across artifacts.
- Required tasks are checked complete.
- Waived or blocked tasks include reason and approval.
- Every approved case ID is implemented or explicitly removed from scope.
- Active cases exist in the test index and pass `playwright-run` resolution by work item.
- Retired cases use index `status: archived`, `archivedAt`, and `archiveReason`.
- Screenshot IDs are created, updated, unchanged, omitted with approval, or blocked with reason.
- Focused and affected broader tests have recorded results.
- Sensitive generated artifacts are not committed accidentally.

## Workflow Archive vs Test Archive

- **Workflow archive** means the module-scoped change is complete and its planning artifacts move to history.
- **Test archive** means a specific case must no longer execute.
- Completing a workflow normally leaves newly implemented tests `active`.
- Never mark all cases archived simply because their implementation change was archived.

## Naming and Collisions

- Destination name is `<YYYY-MM-DD>-<change-id>` using the archive date.
- Do not overwrite an existing archive directory.
- Preserve original filenames and add only `archive-summary.md` unless the project convention requires metadata.
- Keep case IDs and change IDs immutable for traceability.