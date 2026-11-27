# v1.0.0-rc.5 — continuous drummer score and efficient practice workspace

## Delivered in one combined update

The default Song Practice chart workspace is now a continuous, dark percussion score. Multiple bars flow into responsive rows, with numbered bars, existing section labels, a selected starting position and automatic playback following. The design is based on the supplied platform screenshot; it uses this app's own score renderer and timing model.

- **Practice-first layout:** score, Play/Stop, tempo, counting, volume and Loop are together. Edit and import opens the detailed editor. PDF/source tools are below the score in an expandable section; source-reference navigation opens them and now passes the request to the matching viewer.
- **Direct score navigation:** click a note position or keyboard-focus it and press Enter/Space; Play score starts there. Fractional reviewed onsets are retained. Earlier events projected into the same grid slot are not replayed. Stop retains the current score position for the next start.
- **Loop selection:** choose Select loop bars, click the first and last bar, then play. The range is normalized if chosen backwards. The first chosen loop bar becomes the starting point. Whole song restores the full range without forcing Loop on. Existing pickups, ties, count-in and repetition/tempo ladder remain available.
- **Responsive score:**60/80/100/125/150% zoom, a keyboard-focusable scrolling region, optional automatic following, dark notation and no repeated per-bar settings panels. Count selection follows the existing authoritative timing rules; it does not rewrite reviewed durations.
- **Compact drummer controls:** mix boxes show participating drum voices; Mute/Solo work live and individual volume sliders remain removed. The main volume stays available. Shown drum voices has its own compact selector. Repetition and tempo training are expandable in practice view.
- **Remembered workspace:** a validated copy of the latest chart is saved locally, including unsaved edits. Per-song position, count mode, Loop, zoom, follow, volume and shown voices are retained for the latest20 song identities. Tempo, range and instrument mix remain part of the chart. Saving a new named score preserves its current view settings. Invalid/corrupt saved data is ignored; failed storage is reported. Automatic copies are bounded to12 MB. JSON export remains the portable backup. Undo history remains visit-specific.
- **Quick song access:** open saved drum charts and Save score directly in practice view. The detailed editor's existing collection, export and review features remain available.
- **Multi-track MusicXML:** choose the percussion part from a score with several tracks, preview it, then confirm replacement. Instrument IDs are resolved within the selected part rather than across unrelated tracks. Existing meter, duration, overlap, tie and supported-voice checks run before a chart is accepted. Other tracks are not turned into drum sounds.
- **Back in Black excerpt:** Load Back in Black excerpt creates four manually encoded bars from the supplied screenshot: two quarter-note hi-hat intro bars, then two eighth-note groove bars at94 BPM. This is an explicit four-bar excerpt, not a full-song transcription. Loading is undoable through Edit and import; Save score retains the excerpt.

## What remains assisted

PDF symbol recognition still requires review where identity or musical timing is uncertain. This release does not introduce Guitar Pro file parsing, compressed MusicXML, mixed-meter/tempo maps, arbitrary audio-to-drum transcription, automatic sticking/lyrics extraction, or a fully transcribed Back in Black library entry. Supported full percussion tracks can be imported through MusicXML; the existing chart limit is256 bars. Ordinary structured import is much more autonomous than screenshot recognition, but it still exposes validation failures rather than guessing timings.

## Validation

569 unit tests across164 files pass. Production TypeScript/Vite build passes. Source recognition regression guards pass. Existing whole-bar evidence retains232 repeated-scale references across20 cases; six unresolved72-DPI Highway durations still require explicit review and six unmatched suggestions remain reported.

New tests cover selected fractional starts without an earlier grid-projected attack, four-bar score display, loop-range selection, per-song settings and chart restoration, corrupt storage/quota handling, source-excerpt timing, selected percussion-part import and preview confirmation. Existing playback/tie/pickup/counting, recognition, input and recovery checks remain passing. Source lint uses an exact source copy and unchanged app configuration because the workspace is skipped by the local linter:0 errors,32 existing warnings.

The standalone SCORE_PREVIEW.html was exercised using JSDOM: all three count modes retain four SVG bars, eight quarter-note heads and24 eighth-note heads. It is a silent visual preview, not a browser/audio certification.

The updated mobile Playwright test covers the excerpt, note navigation, loop selection, zoom and Play/Stop. Local Chromium launch is blocked by missing libatk-1.0.so.0 and other Linux runtime libraries. Browser/mobile, audible output, hardware input calibration and production offline/update checks must be verified on a supported host/device.

## Upload and try

Install the complete rc5 file set over complete rc4. The update includes the compact Instrument mix follow-up. Preserve all repository-relative destinations, including src/test/setup.ts and the updated test files. No new dependencies, workflow changes or chart-schema changes. Keep validation files outside app source.

1. Open Song Practice → Drum Chart. Practice score is the default; click Load Back in Black excerpt.
2. Verify four bars at94 BPM. The first two have four quarter hi-hats each; the next two have eight eighth hi-hats, two snares and two kicks each. Across the excerpt there are32 main attacks. Switching counts changes labels while keeping those note values.
3. Select loop bars3–4. Click a note position, play, stop and resume. Check correct notes, tempo, bar transitions and following. Try an explicitly reviewed fractional onset.
4. Change zoom, count labels and shown voices. Save score, reload the module/browser, and open saved songs. Verify each song's position/settings and chart survive. JSON export protects the score outside this device.
5. Open Edit and import. Import a multi-part MusicXML score, select Drums, preview and confirm. Compare its notation and playback audit with the source. Recheck pickup/tie/count-in and deliberate grace strokes.
6. Open Analyze PDF / source tools for image-based review. Source navigation must open the matching local PDF and retain its review context. Uncertain candidates still need correction before import.
7. Run unit tests, build and the browser suite on GitHub after every file is uploaded. Test mobile scrolling/keyboard focus, muted/solo kit voices, Loop/Stop, microphone/MIDI calibration and offline reopening on your devices.
