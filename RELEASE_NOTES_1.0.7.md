# KajerSathi Release 1.0.7 — Initialization Repair

## Critical fix
- Restored the missing `#avro-bijoy` internal textarea buffer required by `AvroConverter.init()`.
- The visible SutonnyMJ live preview remains the user-facing output; the restored textarea is visually hidden and used as the converter's internal ANSI data buffer.
- Removed the stale reference to the retired manual font-upload input.
- Initialized `Tabs` before tool modules.
- Wrapped each module initialization in isolated error handling so one tool's initialization error does not prevent navigation or other tools from starting.
- Bumped service-worker cache version to force clients to fetch the repaired files.

## Validation
- JavaScript syntax checked with Node.
- Verified statically referenced element IDs exist in the HTML (excluding dynamic selector `pw-bars span`).
- Verified ZIP archive integrity.
- Browser interaction testing is still required after deployment; syntax and static checks do not prove camera, download, or every UI action works.
