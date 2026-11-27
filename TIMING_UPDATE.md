# v1.0.0-rc.2 — consolidated musical timing update

## What changed

The new resolver uses source order, simultaneous head columns, individual note values, connected beam timing, voice non-overlap, bar length and explicit onset anchors. Pixel distances are not treated as proportional musical time. Quarter durations do not force quarter-beat onsets; syncopated anchors remain supported. Mixed secondary beams retain each event's own duration.

Unknown, dotted or clipped values require explicit duration review. Source hints remain tentative until checked. Multiple compatible timings show alternatives and remaining candidate onsets. A bounded search may ask for additional anchors rather than guessing. Connected beams are treated as consecutive events only when that option is enabled; turn it off when a rest intervenes. Proposed gap rests are assumptions of silence, not recognized glyphs.

The resolver preserves current event edits by default. Explicit column merging/splitting handles displaced simultaneous heads; duplicate same-instrument detections require correction. Applying a proposal is one undoable review edit and clears final confirmation. Source references, fine onsets, durations and ties survive staging, chart creation/append, meter conversion and JSON round trips.

Reviewed draft and chart grid cells are now read-only. Use the duration editor to change their notes. Explicit chart conversion removes duration/tie review and is undoable; conversion is blocked when the sixteenth grid cannot represent finer onsets. Reviewed notation now draws beams and partial secondary stubs from actual event values, breaking beams at rests and beat boundaries.

Stylized crosses with displaced stem attachments gain a fallback through connected head ink. It retains detected head coordinates and does not borrow a nearby stem through a staff line.

## Use the update

1. Select one bar on one staff, analyze it, check genuine noteheads and reject duplicate/false detections. Verify uncertain instrument identities.
2. In **Resolve detected symbols into musical timing**, choose explicit durations for unresolved heads. Keep existing edits enabled to retain prior work.
3. Merge or separate columns where the source requires simultaneous or distinct onsets. Enter a known onset slot for ambiguous passages. Slots use the existing sixteenth units: beat2 is slot5; its eighth offbeat is slot7.
4. Select **Analyze musical timing**. Inspect the source and the proposed staff. If timing is ambiguous, add an anchor or compare earliest/latest placements. Check every proposed rest and disable consecutive-beam timing if silence intervenes.
5. Verify the proposal, then **Apply timing proposal to review**. Make remaining duration/tie corrections, verify the complete source bar, and **Confirm reviewed bar**.
6. Send the reviewed draft to the editor. Use reviewed-duration editing; grid cells cannot erase the review. Save/export, then test playback and looping.

## Validation and limits

543 unit tests across157 files and production build pass. Whole-bar regressions cover184 checked physical heads across16 source/scale cases: Back in Black and Feel Good Inc intro, mixed-rest and partial-beam bars at72/108/144/216 DPI. Onset and duration are checked together. Manual row identities are benchmark input, and the mixed bar includes a reviewed eighth rest at slot9. Five unmatched detector suggestions remain reported for rejection. These are development/regression cases, not proof of arbitrary-score accuracy.

The standalone TIMING_EXAMPLES.html comparison viewer shows four original source crops beside timing-derived notation. The complete source report preserves unresolved recognition cases outside these timing examples. Source automatic hints currently cover quarter/eighth/sixteenth values; advanced durations and unclear dots/flags remain explicit review choices. No tie, tuplet or grace identity is invented from spacing.

Physical listening and microphone/MIDI checks remain required. Browser execution still needs a host with Chromium libraries. This is one consolidated update over the complete v1.0.0-rc.1 release, with no dependency or workflow additions.
