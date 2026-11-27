# Testing

Run `npm ci`, `npm run test:unit`, and `npm run build`. Browser tests: `npx playwright install --with-deps chromium`, then `npm run test:e2e`. Existing GitHub Actions and Docker workflows remain available; upload the entire release before running them.

The source regression report runs from the repository root: `node tools/realSourceRecognitionBenchmark.mjs REAL_SOURCE_VALIDATION.json`. These labelled-source crops and rendering scales measure covered cases; they do not establish general transcription accuracy. Expanded rest scanning has a separate unit regression using previously examined Baba crops; these cases are development data for that mode.

Verify advanced MusicXML round trips, triplet/fine timing, simultaneous voices, grace/articulation metadata, repeat endings and fractional meter conversion. Verify old charts still load, structural edits preserve source references, and unapplied review edits require confirmation.

Check full backup export/restore, malformed imports, unrelated storage exclusion and transaction failure recovery. Keep the automatic safety copy when testing replacement restores. Compare profile, libraries, chart notes and history after reloading.

Before stable release, complete `RELEASE_READINESS.md`: physical audio, microphone, MIDI hotplug/latency, navigation cleanup, browser/mobile accessibility, offline launch and update behavior. Device-free tests cannot certify those checks.

## Rc4 playback alignment

Run `npm run test:unit`, `npm run build` and `npm run test:e2e` after the complete upload. See `PLAYBACK_ALIGNMENT.md` for screenshot-specific, imported timing, mute/grace, source and mobile checks. Browser launch needs the Playwright Chromium Linux dependencies; local rc4 browser execution was blocked by libatk-1.0.so.0. Unit audio tests verify scheduling, not physical loudspeaker output.

## Rc5 continuous drummer score

See `DRUMMER_SCORE.md`. The updated browser regression checks the mobile score, excerpt, loop range, note selection, zoom and Play/Stop. Unit tests isolate automatic workspace storage between tests; new persistence tests verify restore within a test. Local browser launch is blocked by missing Linux runtime libraries.
