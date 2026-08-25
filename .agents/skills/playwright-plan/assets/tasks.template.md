# Playwright Tasks: <module>

## Change Identity

- Change ID: `<lowercase-kebab-case>`
- Work Item: `<WORK-ITEM-ID>`
- Module: `<module>`
- Status: `implementing`

## Status

- `[ ]` pending
- `[x]` complete
- `[-]` blocked with reason

## Tasks

- [ ] `TASK-001` <actionable task>
  - Covers: `<case IDs / screenshot IDs>`
  - Files: `<expected paths>`
  - Register: `<work-item/case/module tags and test-index entry>`
  - Verify: `<focused command or check>`

## Completion Checklist

- [ ] Every approved case ID is implemented.
- [ ] Every executable case is registered in the test index.
- [ ] Retired cases are archived with reason and date instead of deleted or left active.
- [ ] Every required screenshot ID is produced and verified.
- [ ] Focused tests pass.
- [ ] Broader affected tests pass.
- [ ] Sensitive and generated artifacts are not accidentally committed.
- [ ] The change is ready for `playwright-archive` after user approval.