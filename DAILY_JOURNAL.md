# DrumMaster AI Daily Journal

## 2026-10-26 (Day 3)
- Added baseline testing tools in Analytics and AI Coach:
  - `Fast-Forward +4 Days (Test)`
  - `Clear Fast-Forward (Test)`
- Fixed baseline fast-forward behavior to accumulate additional unique historical days on repeated clicks.
- Implemented Timing Analyzer v3 improvements:
  - left/right hand trend cards
  - hand-aware drill prescription
- Updated Rudiment Trainer:
  - mode/category-dependent recommended practice text
  - loop toggle button beside Stop
  - shortened tempo slider column without changing module layout structure
- Updated adaptive scheduler (v0.5.1 behavior):
  - missed-block carryover into next day plan
  - fatigue-aware target shaping
- UI naming and cleanup:
  - app title set to `DrumMaster AI - BETA`
  - removed visible version tags from module subtitles
- Additional refinements:
  - Metronome:
    - added accent selector (none, beat 1/2/3/4)
    - applied live config updates to avoid audio reset when changing volume/settings
    - added inline Swing/Humanize helper text
  - Timing Analyzer:
    - reference click now uses metronome-engine click voice
    - left/right trend cards now show sample counts and consistency fallback (`-`) when insufficient samples
  - Rudiment Trainer:
    - randomized practice button now actively randomizes category/mode/pattern
    - animated sticking highlights active token during playback
    - loop + tempo live-change behavior improved for active playback
    - reduced startup latency by reusing a single AudioContext
- Additional feedback pass:
  - Metronome:
    - refined accent options to `No Accent`, `Beat 1 (Default)`, `Beat 1 + 4`
    - live accent switching while running
    - reduced disruptive behavior on control updates by switching to engine config updates (no stop/restart loop)
  - Timing Analyzer:
    - added reference BPM slider (40-240)
    - moved hit sequence heatmap under Timing Graph and centered it
    - added hand labels (L/R) to heatmap cells
    - added extra recommendation text for Trigger Sensitivity and Hit Cooldown
  - General UX:
    - updated play-state labels to show `Playing...` where relevant

### Next Planned Phase
- Continue v0.5.x refinement:
  - adaptive plan validation in real usage
  - targeted timing drill quality tuning
  - personal analytics depth improvements (non-social focus)

## 2026-11-05
- User confirmed Today Focus, session review, journal persistence, and rudiment selection/playback.
- Implemented v0.6.9: brighter journal text areas with borders, placeholders, and focus outlines.
- Expanded Stick Control: selectable generated patterns, lead-hand inversion, accent selection,
  dynamics and crescendo, live tempo/volume settings, active-stroke highlighting,
  and locally saved exercises with load/delete controls.
- Reused one audio context for Stick Control playback.
- Validation: 31 unit tests and production build passed.
- Next planned release: v0.7.0 Dynamics Trainer (calibration, target levels, consistency).
- Implemented v0.7.0 Dynamics Trainer: two-stage microphone calibration, eight relative
  dynamic targets, live meter, clipping warning, stroke-settling gate, target accuracy,
  and repeatability score. Stops/navigation save completed sessions and release the microphone.
- Analytics now derives dynamics consistency from measured session scores weighted by stroke count,
  rather than metronome/groove event counts. No audio recordings are stored.
- Validation: 37 unit tests passed; production build passed. Hardware microphone testing
  remains manual; browser E2E not run because Chromium is unavailable locally.
- Next proposed release: v0.7.1 Speed Trainer with timed drills and measured records.
- User verified all v0.7.0 Dynamics Trainer checks successfully.
- Implemented v0.7.1 Speed Trainer: 15-second sprint and 60-second endurance,
  four exercise labels, target BPM 60 (40–240 range), room-noise calibration,
  configurable rebound cooldown, optional headphone reference click, suggested sequence,
  full-window measured stroke rate, sixteenth-note-equivalent BPM and interval consistency.
- Completed drills with at least 12 hits and 80% consistency qualify for local personal records.
  Interrupted/hidden-tab sessions cannot qualify. Session metrics are saved to practice history;
  qualifying measured BPM contributes to Analytics best BPM. No audio recordings are saved.
- Validation: 43 unit tests and production build passed. Physical microphone and E2E testing remain manual.
- Next proposed release: v0.7.2 Independence Trainer playback and editable limb patterns.

## 2026-11-06
- User confirmed v0.7.1 Speed Trainer calibration, drills, records, interruption behavior,
  reference audio, and Analytics/Coach activity.
- Implemented v0.7.2 Independence Trainer: editable 16-step four-limb grid, Rock/Jazz/Latin/
  Fusion/Gospel presets, independent mutes, synthesized hi-hat/ride/snare/kick/pedal-hat,
  2:1 eighth-note swing, live tempo (60 default, 40–240), loop toggle and scheduled highlights.
- Added one locally saved exercise with load/delete, validated restoration, and optional
  profile metadata to preserve ride/ghost playback. Stopped/hidden-tab/navigation cleanup
  cancels scheduling and closes the audio context. Practice time/completed bars are recorded,
  not falsely represented as measured timing accuracy. Traditional Latin parts remain simplified studies.
- Validation: 49 unit tests and production build passed. Listening/mobile and browser E2E
  checks remain manual/unverified locally.
- Next proposed release: v0.7.3 Polyrhythm Trainer interactive playback and synchronized pulses.
- User verified v0.7.2 and requested stronger genre selection visibility and multiple saves.
- Implemented v0.7.3: Independence selected-genre border/background/highlight, named exercise
  library with selector, save-new/update-selected/load/delete, and legacy single-save preservation.
- Rebuilt Polyrhythm playback: all six ratios, complete least-common-multiple grids, actual
  Circle and Timeline views with audio-clock playhead, distinct click streams, independent
  mutes, live BPM/volume, loop toggle and safe stop/ratio-change/navigation/hidden-tab cleanup.
- Explicit tempo convention: one ratio cycle spans four reference quarter-note beats.
  Practice time/completed cycles recorded; no fabricated timing accuracy.
- Validation: 57 unit tests, production build and targeted lint passed. Real-browser
  listening/mobile/E2E checks remain manual/unverified locally.
- Next proposed release: v0.7.4 Groove Library sequenced previews, loops and note highlighting.
- User verified v0.7.3; requested a two-line 7:8 grid to prevent controls-panel stretching.
- Implemented v0.7.4: Polyrhythm 7:8 now wraps each stream into two equal 28-step lines,
  keeps absolute step/highlight indexing, and constrains grid panels to prevent width overflow.
- Groove Library now uses simultaneous instrument-row patterns instead of frequency lists:
  Rock, Funk ghost notes, Jazz 2:1 swing, a simplified Latin shell study, Metal sixteenths,
  and a true 14-sixteenth-slot 7/8 Progressive bar. Added highlighted note/rest grids,
  live BPM/volume (60 BPM default, 40–240 range), loop toggle, safe audio lifecycle,
  and saved playlist add/remove/select. Playlist does not auto-advance.
- Practice time/completed bars are stored, not fabricated playing accuracy.
- Validation: 64 unit tests, production build, and targeted lint passed. Browser E2E,
  physical listening and mobile layout checks remain unverified locally.
- Next proposed release: v0.7.5 Odd Time Trainer with grouping controls and playable exercises.
- User verified v0.7.4 and reported playing playlist entries continuing after removal,
  playlist playback not selecting the genre, clipped outer grid highlights, and genre-button scaling.
- Implemented v0.7.5 Groove fixes: removal stops the corresponding active/pending playback,
  playlist Play selects the matching genre, padded grid edges/row gaps show full highlight rings,
  fixed-height non-shrinking genre buttons and position-only card layout avoid scale animation.
- Added lazy-loaded Odd Time Trainer: all six meters (5/4, 7/8, 9/8, 11/8, 13/16, 15/16),
  valid grouping choices, group-aware counting cards, Click/Groove/Fill studies, live BPM/volume,
  Click/Fill group accents, Loop and clean stop/change/hidden-tab/navigation lifecycle.
  Quarter-note BPM convention is explained and bar duration calculated from denominator.
- Reuses the existing v0.7.4 grooveAudio instrument service. Practice time/completed bars are
  logged to Analytics/Coach sources; playback is not represented as measured accuracy.
- Validation: 70 unit tests, production build, and targeted lint passed. Listening/mobile/E2E
  browser checks remain manual/unverified locally.
- Next proposed release: v0.7.6 Practice Pad Mode guided drills and session tracking.
- User verified v0.7.5; reported a residual All-to-Rock layout shift and requested two-row
  counting groups for 13/16 and 15/16 without horizontal scrolling.
- Implemented v0.7.6: stable document scrollbar gutter and disabled Groove card layout
  animation; /16 odd-meter views now split whole groups over two responsive compact rows,
  retain exact unit indices, and use an explained abbreviated legend.
- Practice Pad Mode now has four guided routines, large hand cues and sticking highlights,
  lead inversion, live tempo (60 default, 40–240), quarter/eighth/sixteenth subdivisions,
  1–45 minute countdown, live volume, start/pause/resume/stop, and completed-session feedback.
- Active segments save practice events and time; paused/hidden time is excluded by closing
  the active segment and starting another on Resume. Cues are explicitly not detected hits.
  Audio and active segments are safely stopped on navigation; microphone is not used.
- Validation: 76 unit tests, production build, and targeted lint passed. Listening/mobile
  and browser E2E checks remain manual/unverified locally.
- Next proposed release: v0.7.7 Session export and local backup/restore.
- User verified v0.7.6 and requested beginner-friendly module ordering.
- Implemented v0.7.7: 15-step suggested practice navigation (pulse, pad, timing, control,
  rudiments, reading, grooves, dynamics, ears, coordination, fills, songs, speed, odd meter,
  polyrhythm) with Dashboard/Coach/Analytics supporting the path. Nothing is locked.
- Analytics now provides completed-session CSV and per-session JSON, plus local practice
  history backups for events/journal only. UI explicitly excludes profile/settings/exercises/
  playlists/record caches/media, and notes privacy of exported reflections.
- JSON imports have schema/size/count/type checks, preview + explicit merge confirmation,
  existing-ID preservation and duplicate protection. Events/journal share a write queue;
  IndexedDB restore commits both together. Restore remounts journal so reflections refresh.
- Validation: 86 unit tests, production build and targeted lint passed. Browser file-download,
  file-picker, mobile and E2E checks remain unverified locally.
- Next proposed release: v0.7.8 Song Practice editable drum charts and chart playback.
- User verified v0.7.7 exports, backup validation, merge/no-duplicate behavior, and journals;
  requested stronger local-file picker highlighting and dependency-first upload instructions.
- Implemented v0.7.8: larger cyan backup file selector; editable 4/4 Song Practice charts
  with rest/normal/ghost/accent cells, up to 16 bars, duplicate/remove bars, live note edits,
  tempo/volume, full-chart looping and synchronized active-bar/column highlights.
- Added multiple named chart saves with update/load/delete and standalone validated chart
  JSON import/export. Charts are separate from practice-history backups and song audio.
  PDF recognition is not implemented in this editor foundation release.
- Song Practice now separates Drum Chart and Audio Tracks tabs; old playback stops on switch.
  Count-in accepts optional cancellation and validates tempo; Pause/switch/navigation cancels it.
  Expiring blob audio URLs are no longer presented as persistent tracks; audio files must be
  selected again after reload. Object URLs are revoked on module cleanup.
- Validation: 92 unit tests, production build, and targeted lint passed. Browser file download,
  local file pickers, real audio/tab switching and mobile/E2E checks remain manual.
- Next proposed release: v0.7.9 Local PDF chart reference alongside the editor (not automatic transcription).

### v0.7.9 - Local PDF chart reference
- User confirmed v0.7.8 chart editing, playback, saves, imports, exports and count-in cancellation.
- Slightly reduced the backup picker padding and native button size while retaining cyan contrast.
- Added local PDF selection with extension/header/20 MB checks, browser-native inline preview,
  local-open fallback and removal beside the chart editor (stacked below 2xl widths).
- PDF reference persists between Song Practice tabs but is not saved, uploaded or transcribed;
  object URLs are revoked on replacement/removal/navigation and stale file reads are ignored.
- Existing chart playback still unmounts/stops on Audio Tracks selection. No new dependencies.
- Validation: production build, 95 unit tests and targeted lint passed. Actual native PDF viewing
  and mobile fallback require manual browser checks; E2E was not run locally.
- Next proposed version: v0.8.0 Song Practice chart workflow refinement (bar labels and practice-section looping).

### v0.8.0 - Bar labels and section practice
- User confirmed v0.7.9 PDF viewing and chart behavior, but invalid-file feedback was not visible.
- File picker now permits selecting files for explicit validation; rejected PDF selections show
  a prominent amber alert immediately below the picker, above the preview. Existing PDF remains.
- Added editable per-bar labels and start/end practice range. Playback and loop operate only on
  selected bars; loop toggles live and finishes the selected section when disabled.
- Label/range fields are optional for old chart compatibility, validated and persisted in named
  saves and chart JSON. Adding/duplicating/removing bars resets range to full chart; duplication
  preserves labels. Range selection and labels are locked during playback.
- Production build and 98 unit tests passed. E2E and actual native PDF/browser playback need
  deployment checks. No dependencies added. Next proposed: v0.8.1 chart count-in and rests workflow.

### v0.8.1 - Chart count-in and rest guidance
- User confirmed v0.8.0 labels, section playback, loops, persistence and invalid-file alerts.
- Changed warning prefix to File not loaded.
- Added optional count-in Off (default), 4 beats or 8 beats, saved and exported with charts.
  Legacy charts default to Off. Count-in occurs once, before the selected section; uses a
  980 Hz reference click at current chart volume and tempo. Stop/navigation closes audio.
- Practice session creation is deferred until the first chart slot, excluding count-in time.
  Cancelling during count-in creates no session. Loop never repeats count-in.
- Added live count-in beat and slot-count guidance; entirely silent slots show Rest - keep
  counting, no stroke. Explained sixteenth-slot duration and per-instrument rests.
- Production build and 101 unit tests passed. Browser/E2E playback checks remain manual.
- Next proposed v0.8.2: chart step editing workflow (clear bar and undo/redo safeguards).

### v0.8.2 - Chart editing safeguards and layout
- User confirmed v0.8.1 but requested a full-width PDF reference above editor/controls and
  clearer eight-beat count-in rather than two displayed 1-4 preparations.
- PDF reference now occupies its own row. Chart editor/controls retain their separate layout below.
- Count-in visualization advances continuously 1-8 for eight beats (audio already had eight clicks).
- Added Clear current bar with explicit confirm/cancel, retaining labels and other bars.
- Added bounded 50-edit undo/redo, disabled during playback; includes note and structural edits.
  New edits clear redo. Saving/loading/importing resets edit history; saved charts/history unaffected.
- Derived safe selected bar after undo/redo of structural changes to avoid out-of-range rendering.
- Validation: production build, 105 unit tests and targeted lint passed; browser/E2E checks manual.
- Next proposed v0.8.3: chart bar copy/paste and per-instrument row editing shortcuts.

### v0.8.3 - Bar and instrument-row shortcuts
- User confirmed v0.8.2 safeguards and requested 1-4 count display for both preparation options.
- Restored per-bar 1-4 counting; two-bar count-in displays bar 1/2 then bar 2/2, with no 1-8 display.
- Added editor-local bar copy/paste including label; row copy/paste across instruments; Clear,
  Quarter, Eighth, Sixteenth and Offbeat eighth row-pattern shortcuts.
- Replacements require explicit confirm/cancel, preserve other bars/rows, tempo and section,
  and enter existing undo/redo history. Shortcut controls disabled during playback.
- Copy buffers are independent snapshots, never OS clipboard; discarded on leaving editor.
  Loading/saving/importing, undo/redo and bar navigation dismiss pending replacement dialogs.
- Validation: production build, 108 unit tests and targeted lint passed. Browser/E2E checks manual.
- Next proposed v0.8.4: chart playback instrument mute/solo and balance controls.

### v0.8.6 - Combined v0.8.4/v0.8.5/v0.8.6
- User confirmed v0.8.3 shortcuts and requested all enabled count-in options count 1-4 once.
  Both stored values 4/8 now produce four preparation clicks once; legacy 8 option is labeled.
- Added live per-instrument mute, solo and volume (mute wins; multiple solos permitted), reset mix,
  default unity instrument gains with unchanged master 30% default. Notes remain intact.
- Added repetition target 1-100 cycles and optional +1-10 BPM ladder every 1-16 completed cycles,
  capped at 240 BPM. Training starts with Loop On, stops at target, and Loop Off ends current cycle.
  Completed cycles count actual playback boundaries and are recorded with completed bars; no
  measured accuracy is inferred. Count-in remains excluded from practice session time.
- Added style and difficulty tags, saved-chart search and whole-chart duplication into editor.
  Original saves remain unchanged until explicitly updated; copy requires Save as new.
- Optional mix/training/tag fields validate and round-trip in chart saves/JSON; older charts remain
  compatible. Chart JSON export now refuses invalid/blank titles rather than creating invalid imports.
- Validation: production build, 113 unit tests, targeted lint passed; browser/E2E checks manual.
- Delivery: six files, dependency-first upload order. No npm dependencies or new folders.
- Next proposed v0.8.7: conventional drum-notation foundations alongside the editable grid.

### v0.8.7 - Notation foundations and tempo ladder clarity
- User confirmed v0.8.6 except tempo ladder increase was not apparent.
- Enabling ladder now enables repetition training automatically. Added explicit active/inactive
  ladder guidance with the next cycle threshold, including target-ending-before-increase caveat.
- Fixed stale scheduler configuration for the first slot of a new cycle after a BPM increase.
- Added responsive SVG percussion staves alongside the grid: independent Hi-hat/Snare/Kick
  voices, 4/4, sixteenth-note/rest slots, x hi-hat heads, ghost parentheses and accent marks.
  Audio-clock active slot highlights all three staves, including rests and the final column.
- Foundation scope: literal sixteenth slots only; no tuplets, merged note durations or PDF OCR.
  No new notation dependencies, avoiding dynamic renderer failures seen in earlier releases.
- Validation: production build, 116 unit tests and targeted lint passed. Actual rendering/mobile
  scroll and audible tempo change still require deployed-browser verification; no local E2E run.
- Next proposed v0.8.8: PDF transcription preparation (supported notation/import-review workflow
  and recognition test cases), not automatic PDF-to-notes transcription yet.

### v0.8.8 - Fit staff and manual transcription-review preparation
- User confirmed v0.8.7 playback/ladder/notation; requested no horizontal scroll for musical staff.
- SVG staff now scales within available width without its former 1000px minimum; the full bar
  is visible. Symbols become smaller on narrow screens; editable grid remains independently scrollable.
- Added manual PDF-to-chart review preparation panel, supported-notation rules and limitations,
  optional reference name, page and bar notes, Pending/Uncertain/Reviewed flags, completion gate.
- No PDF note recognition, OCR or parsing added; no recognition confidence inferred. Review does
  not create practice metrics or prevent playback used to check uncertain entries.
- Note-content signatures invalidate reviewed bars when notes change; source changes reset flags.
  Structural bar edits reset workflow. Review is optional, validated, persisted in saves/chart JSON,
  and normalized to Pending on save/export if content changed. Older charts remain valid.
- Added review validation, round-trip, uncertainty, playback-lock, fit-staff and editing regressions.
- Production build, 122 unit tests and targeted lint passed; browser/E2E checks remain manual.
- Next proposed v0.8.9: local PDF inspection and recognition feasibility checks, not a promise
  of production-quality automatic transcription.

### v0.8.9 - Single staff and local PDF structure inspection
- User confirmed v0.8.8 and requested Hi-hat/Snare/Kick combined on a single musical staff.
- Combined simultaneous strokes vertically on one five-line percussion staff with shared stems;
  entirely silent columns show one sixteenth rest. Instrument-specific rests remain in the grid.
  Ghosts, accents, active-column highlighting and fit-to-container behavior preserved.
- Added optional local PDF inspection using pdfjs-dist 6.5.438, loaded on demand: actual page count,
  first-ten-page text character and image-operation counts, cautious feasibility assessment.
  No PDF scripts executed, OCR, note recognition, uploaded bytes or persisted extracted text.
- Added cancellation, 30-second timeout and safe failure guidance; PDF reference/chart remain intact.
  Reference removal/replacement/navigation cancels inspection. Results are temporary.
- Delivered package.json and lockfile together plus Vite offline precache support for worker .mjs.
  PDF parser chunk remains below 500 kB; worker is a separate locally cached asset.
- Validation: production build, 128 unit tests passed; targeted lint has no errors and one pre-existing
  PDF reference fast-refresh export warning. Real parser smoke check passed on local one-page text
  fixture (standard-font-resource warning only). Browser/PWA worker path and actual file types
  still require manual deployed testing; local E2E not run.
- Next proposed v0.9.0: local PDF page rendering and notation-region selection for future recognition.

### v0.9.0 - Local PDF page/region workflow and simplified editor
- User confirmed v0.8.9 and requested removal of manual review preparation and Bar/Row Shortcuts.
- Removed both panels and their editor state/imports; Undo/Redo and Clear current bar remain.
  Legacy review data/helpers remain compatible, but no manual-review UI is presented.
- Added on-demand local PDF page raster rendering with page navigation, cancellation and timeout.
  Canvas bounded to 1400px width / approximately 4 megapixels; embedded fonts render locally,
  system font fallback allowed; no PDF scripts/interactive annotations/OCR/recognition executed.
- Added mouse/touch normalized rectangular region selection, reverse-drag/clipping support,
  clear selection and local region PNG/JSON export. JSON describes displayed-page coordinates
  and rotation. No generated notes, saved region, or practice metric changes.
- Closing/replacing/removing PDF and navigation cancel worker/render resources. Selection Off
  restores touch scrolling. Existing native PDF preview and structure inspection remain available.
- Removed obsolete editor regressions for removed UI and added absence/render/region tests.
- Validation: production build, 132 unit tests passed; targeted new-code lint passed. Real canvas
  rendering, crops, worker/PWA behavior and mobile selection require deployed browser checks.
  No new npm dependencies or root files; next proposed v0.9.1 staff-line detection prototype
  on selected notation regions, not automatic PDF-to-notes conversion.

### v0.9.5 - Combined v0.9.1-v0.9.5 experimental recognition prototype
- User requested bundling all five research-dependent recognition stages.
- Added bounded local thresholding, projection-based five-line staff grouping and deskew search
  (-3 to +3 degrees automatically; manual -5 to +5), multiple staff selection and manual geometry.
- Added oval/cross template note candidates at standard Hi-hat/Snare/Kick positions, strength
  scores explicitly not probabilities, and diagnostic stem/flag/barline hints.
- Added candidate overlays, opt-in acceptance, manual slot-center guides, assumption acknowledgement,
  and editable 16-slot draft preview. Empty slots are guessed rests; rhythms, rest glyphs, tuplets,
  irregular spacing, flams/drags/ties/repeats/dynamics are not automatically interpreted.
- Narrow conversion assumes one evenly spaced 4/4 bar; accepted candidates must align with manual
  slot centers. No detected candidates means no generated draft; blank scans do not invent notes.
- Confirmed draft is handed to editor as a pending insertion. Add detected bar appends without
  replacing existing bars, is disabled during playback/capacity overflow, and supports Undo.
- Removed review and shortcut panels remain removed. No new dependencies or root configuration.
- Validation: production build, 138 unit tests passed (clean, scaled, skewed, stacked synthetic
  fixtures, cross/oval candidates, confirmation gate, insertion/undo). These are not real-score
  accuracy benchmarks. Real charts, mobile overlays and browser/E2E tests remain manual.
- Next proposed v0.9.6: real-chart validation/tuning and better detection diagnostics before claiming
  broader recognition. Reliable duration/rest interpretation and production OMR remain unfinished.

### v0.9.6 — broader cymbal candidates and strict local MusicXML import
- Widened cross-head search above the staff, retained positional candidate labels, and added explicit candidate-to-editor-row mapping. Clefs are structural, not playable notes.
- Added local uncompressed score-partwise MusicXML preview/confirmation and editable chart import. Supports one percussion part, up to 16 complete 4/4 bars, sixteenth-aligned timing, GM hi-hat/snare/kick, voices via backup/forward and chords.
- Rejects unsupported instruments, malformed/DTD documents, ties/grace notes/tuplets, pickup bars and repeats rather than silently transcribing them incorrectly. Crash/Ride still lack dedicated chart rows.
- Existing saved charts remain unchanged; confirmation replaces only the working editor chart. PDF candidates remain opt-in and editable.
- Production build and 144 unit tests passed. Browser/E2E tests were not run. Real-chart recognition accuracy remains unverified; requested the user's missed-symbol PDF for validation.
- Proposed next: v0.9.7, explicit extended-kit schema migration and real-chart recognition regression fixtures, subject to receiving sample notation.

### Roadmap agreement: recognition before conversion
- Recorded the agreed sequence in ROADMAP.md: validate and improve recognition on the four supplied PDFs first.
- Deferred PDF-to-MusicXML conversion until recognition is ready, retaining the agreed select/detect/compare/correct/export workflow.
- PDF input remains supported; all processing stays local and uncertainty must remain visible.

### v0.9.7 - Recognition efficiency and real-chart regressions
- Removed unused oval scoring during cross-head searches; precomputed template offsets and reused pixel coordinates across skew trials.
- Added dense-row staff fallback for tight crops. The Baba O'Riley reference crop now detects a staff where v0.9.6 failed.
- Added a one-crop analysis cache with threshold/skew/crop invalidation, memoized barline hints and processing-time feedback. Crop/source changes clear pending candidates and drafts.
- Froze candidate-output regressions from small local first-page crops of all four supplied PDFs. These are thresholded render fixtures, not annotated musical truth or full-song accuracy benchmarks.
- Local median end-to-end benchmarks: Back in Black 48.45 -> 29.93 ms; Highway to Hell 52.43 -> 30.74 ms; Feel Good Inc. 63.30 -> 39.31 ms. Identical candidate output on these previously successful crops. Baba now detects a staff; its old failure time is not a comparable speed benchmark.
- Production build and 150 tests across 56 files passed. Targeted lint has no errors and one state-reset-in-effect advisory. Browser/E2E and device timing remain unverified locally.
- Release intentionally avoids extended-kit schema migration; dedicated cymbal rows remain proposed for v0.9.8. Conversion remains deferred until recognition is validated more deeply.

## 2026-11-08

### v0.9.8 - Wider filled-head recognition and compatible cymbal chart rows
- Inspected the user's screenshot: below-bottom-line kicks were outside the previous fixed search position. Expanded filled-head search over half-space positions within and below the staff, with explicit instrument suggestions requiring verification.
- Added summed-row oval scoring, bounded candidate caching and weaker-shoulder suppression while retaining equally strong neighboring heads.
- Added a one-bar screenshot fixture with six manually checked filled-head centers. All six are detected within the test tolerance, including three below-staff kicks. The screenshot contains previous overlays; this is not a full raw-PDF accuracy benchmark.
- Added dedicated Crash/Ride rows, combined staff symbols, instrument mix controls and distinct synthesized playback. New chartKit foundation keeps legacy three-row bars/mixes valid, defaulting absent cymbals to rests/full balance without overwriting saves. Review signatures remain compatible until cymbal notes are added.
- Extended strict MusicXML GM mapping for Crash/Ride; unsupported tom/other-instrument import still fails explicitly. PDF candidates still require manual cymbal mapping; no automatic instrument-identity guarantee.
- Delivered all modified consumers and dependency files together, plus unchanged existing real-chart fixture dependency to prevent missing-file upload errors.
- Local median fresh staff+candidate scan benchmarks versus v0.9.7: about 11-21% faster across four chart crops despite wider position search. Cached candidate-only scans skip scoring. Browser/device speeds unverified.
- Production build and 160 tests across 57 files passed. Targeted lint has no errors and one pre-existing crop-state reset advisory. Local E2E/audio listening/mobile tests remain manual.
- Next proposed v0.9.9: improve true-head versus stem/beam/text discrimination and circled-cross symbol labeling, followed by rhythm/rest interpretation. PDF-to-MusicXML conversion remains deferred.

### v0.9.9 - Repeat scans, tentative rhythm hints, cymbal voice contrast and drum-key roadmap
- Read and rendered the supplied one-page Master Drum Key locally. Added a collapsed reference/support catalog and detailed roadmap entries for tom/bass variants, extras, articulations, section modifiers and rolls. These entries do not claim full recognition/playback support.
- Fixed primary repeated scans resetting manual geometry to automatic geometry. Added fresh-pixel detection bypassing caches, visible scan count, and fresh timing feedback for manual rescans. Changing geometry clears stale candidates and tentative values.
- Added a wider stem/beam inspection window around heads, checking upward/downward stems and simple beam bands. Candidate labels now include possible quarter/eighth/sixteenth/unknown values. Missing flags, dotted/tied notes and overlapping voices can mislead them. Three-plus beams remain unknown.
- Duration labels are diagnostics only: the current draft still maps onsets using manually checked slot guides and renders literal sixteenth slots. Accurate duration-aware transcription remains unfinished.
- Ride playback now combines a short high-frequency attack with inharmonic 2800/4100 Hz partials; Crash remains a longer broad noise wash. Both remain synthesized rather than acoustic samples. Shared Jazz/independence Ride sounds consequently change too.
- MusicXML chooser now matches the cyan PDF picker styling; tests retain preview/cancel/confirm and disabled-state checks.
- Production build and 166 tests across 59 files passed. Controlled rhythm fixtures establish only simple stem/beam behavior, not real-PDF classification accuracy. Local browser E2E, cymbal listening and mobile overlays remain unverified.
- Targeted lint has no errors and the existing crop-state-reset advisory.
- Next proposed v0.10.0: additional drum-voice mapping from the key and further rhythm validation. Conversion remains deferred until recognition/review are dependable.

### v0.10.0 - Expanded kit and explicit drum-key mapping
- Expanded Song Practice to twelve voices: existing five plus Kick 2, Floor tom 2/1, Tom 3/2/1 and Pedal hi-hat. Editing, combined staff, mix, saved charts and JSON round trips support these rows; missing legacy rows remain rests without altering saves.
- Added distinct synthesized tom pitches, second-bass tuning and short pedal-hi-hat sound. Adjacent staff heads are offset for readability.
- Extended strict MusicXML GM mappings and added a locally validated twelve-voice test document. Middle GM tom variants share Tom 2; open/bell/extra-cymbal articulations remain collapsed or unsupported.
- Added an opt-in supplied Master Drum Key position profile. Generic recognition remains the default; profile changes discard only unconfirmed detection state. Suggestions require manual verification.
- Added controlled rhythm-hint and mapping regressions. Duration transcription remains experimental and does not automatically set note lengths.
- Production build and 173 unit tests across 59 files passed. Targeted lint has no errors and one existing crop-state reset advisory. Browser E2E, physical audio and mobile checks remain manual.
- Next proposed v0.10.1: duration/rest recognition foundations and uncertainty-aware rhythm review. Reviewed PDF-to-MusicXML conversion remains later roadmap work.

### v0.10.1 - Instrument visibility and cautious rhythm review
- Added device-persistent instrument visibility checkboxes plus Show all/Show basic kit. Selection filters editor rows and combined staff only; hidden notes are neither deleted nor muted and remain saved/exported. Mix controls still include the complete kit.
- Added pure rhythm-review checks for accepted candidate durations, out-of-guide positions, same-instrument overlaps and bar-end overflow. Empty onset slots are explicitly unverified rather than recognized rests; engraved spacing may not be proportional to time.
- These checks do not apply durations or modify chart notes. Automatic rest-symbol detection, ties, dots, tuplets and duration-aware transcription remain unfinished.
- Production build and 177 tests across 60 files passed. Targeted lint has no errors and one existing crop-effect advisory. Browser/audio/mobile checks remain manual.
- Packaged new foundations first, optional staff prop next, then consumers and tests to minimize incomplete-upload dependency failures.
- Next proposed v0.10.2: manually editable onset placement and duration evidence in recognition review; continue real-chart validation before automatic rest recognition/conversion.

### v0.10.6 - Combined v0.10.2-v0.10.6 recognition/review bundle
- Added editable note/rest events with instrument selection, manual onset slots and quarter/eighth/sixteenth durations. Accepted candidates initialize review, with unknown durations explicitly defaulted to sixteenth pending user correction.
- Added short isolated-flag evidence alongside existing stem/beam hints. Controlled fixtures pass; accurate first-pass real-PDF duration recognition remains unproven.
- Added experimental scaled rest-shape templates with bounded scanning, explicit hint acceptance and manual rest entry. Blank/controlled fixtures are tested; arbitrary fonts, scans and text can cause misses/false positives. Manual gap fill is explicitly an assumption, not recognition.
- Added per-instrument coverage, overlap, overflow and supported-event validation. Simultaneous different instruments are allowed. Unsupported ties/dots/tuplets/rolls remain manual and are not transcribed.
- Added duration/rest-aware combined-staff preview and explicit confirmation into the existing draft append workflow. Edits invalidate confirmation. Notes trigger at their grid onsets; duration notation does not choke sustained acoustic sound.
- Reviewed events survive chart saves and JSON round trips. Ordinary grid edits clear event metadata for that bar, with visible explanation; old grid-only charts remain valid. Invalid/inconsistent metadata is rejected.
- Build and 184 unit tests across 63 files passed. Targeted lint has no errors and one pre-existing crop-effect advisory. Browser E2E, real-PDF recognition accuracy, mobile layout and physical audio remain unverified.
- Delivered type dependency first, then chart model and logic, then consumers and tests. No packages or new directories required.
- Next proposed v0.10.7: real-PDF recognition benchmarks, improved rest/flag discrimination and review usability before broader notation/conversion.

## 2026-11-09

### v0.10.7 - Bulk candidate selection and review safeguards
- Added Select all candidates and Clear candidate selection with selected/total count and slot-alignment exclusion count.
- Build draft preview explicitly uses checked, aligned candidates only. Multi-candidate UI regression proves an unchecked Snare is excluded while the selected Kick remains.
- Changing individual or bulk selection clears the existing draft and acknowledgement, preventing stale preview submission. Bulk selection does not silently verify candidates.
- Reduced experimental rest-template collisions near accepted noteheads. Controlled rest regression verifies exclusion; this can suppress a nearby true rest and does not establish real-PDF accuracy.
- Build and 188 tests across 64 files passed, including existing real-chart regressions. Targeted lint has no errors and one existing crop-effect advisory. Browser E2E/mobile/real-PDF user checks remain manual.
- Next proposed v0.10.8: candidate overlay identification, review navigation and more rest/flag validation against manually checked source bars.

## 2026-11-10

### v0.10.8 - Numbered overlay and candidate navigation
- Added numbered HTML controls above the PDF canvas, aligned to detected positions with skew correction. Amber marks unchecked candidates, green checked candidates and cyan focused candidates. Numbers can be hidden to reduce clutter.
- Added matching numbered candidate rows with Focus, Previous, Next and Jump controls. Focus scrolls the matching row into view and does not check/map candidates or discard drafts.
- Bulk/individual selection and mapping continue to invalidate confirmation; existing checked-only and slot-alignment filtering remains unchanged.
- Build and 191 tests across 65 files passed, including navigation boundaries, non-contiguous candidate IDs, empty scans, overlay/list linkage and draft preservation while focusing.
- Targeted lint has no errors and one existing crop-effect advisory. Browser/mobile crowding and overlapping number labels require user checks. Recognition accuracy is unchanged; existing real-chart regression tests pass but are not an overall accuracy benchmark.
- Next proposed v0.10.9: candidate filtering by checked/unchecked/unknown duration plus focused-symbol review improvements, without losing hidden selections.

### v0.10.9 - Safe candidate filtering and focused inspection
- Added All/Checked/Unchecked/Unknown-duration filters with shown/total counts. Filtering changes only rows and navigation, not acceptance, verification, saved data or full checked-candidate draft building.
- Focused candidates hidden by a filter remain inspectable, with a warning and Show all action. Previous/Next/Jump operates on visible rows.
- Added a magnified original-pixel preview with candidate-head outline and tentative duration text. Crop bounds clip at image edges and account for skew; only focused-region pixels are copied.
- Build and 195 unit tests across 67 files passed, including hidden-selection draft preservation, filtered navigation, missing-duration handling and clipped/skewed preview bounds.
- Browser E2E/mobile/actual preview readability remain unverified. Recognition algorithms and saved chart format are unchanged.
- Next proposed v0.10.10: instrument-filtered review, clearer uncertainty indicators and more manually checked real-chart recognition validation.

### v0.10.10 - Open hi-hat, notation-guide profile and cautious clef exclusion
- The two Word documents appeared during the turn. Read both texts and inspected their embedded drum-key images locally. They explicitly describe no universal notation standard, two-bar percussion clefs, lower floor-tom placement, a plain open-hi-hat circle and a crossed half-open marker.
- Added a separate Supplied beginner notation guides profile based on both diagrams: floor tom at 2.5 staff spaces, high/mid toms above snare, bass at 3.5, pedal at 4.5. Extended Master Drum Key stays separate; generic remains default.
- Added an optional Open hi-hat row with staff circle, synthesized longer tail, mix/visibility/JSON compatibility and GM MusicXML open-hi-hat mapping. Existing Hi-hat stays closed. Half-open and automatic choke behavior are not implemented.
- Added conservative hollow-circle suggestions and possible two-bar percussion-clef detection near the crop beginning. Clef exclusion can be disabled; other clefs/false symbols need manual rejection. Real-PDF detection remains unproven beyond regression preservation.
- Added instrument-filtered review and explicit unknown-duration badges. Hidden selections still participate in drafts.
- Build and 204 tests across 68 files passed. Controlled tests cover clef versus long stems, hollow versus filled markers, both floor toms and beginner-guide floor mapping, open-row round trips and MusicXML, plus longer audio tail. Physical listening/mobile/real-source accuracy still require user testing.
- Package audio first with staging-safe Open hi-hat parameter, then symbol helper/chart model and consumers. No new dependencies or folders required.
- Next proposed v0.10.11: improve open/half-open articulation evidence and document-grounded real-chart validation before expanding automatic transcription claims.

### v0.10.11 - Calibrated floor-tom heads and articulation evidence
- Identified two algorithmic limitations: generic lower heads map to Snare/Kick rather than floor toms, and head scoring uses a fixed vertical position/template size. Without a failing user crop, the exact real-PDF miss is not proven.
- Added explicit floor-tom staff-offset calibration, bounded vertical tolerance (0-4 px) and notehead-size control (60-140%). Calibrated positions replace competing suggestions at the same offset. Generic default stays strict; source-derived profiles use 2 px tolerance in the UI. Every geometry change clears selection/draft confirmation and needs rescanning.
- Candidate caches include calibration/size settings. Controlled narrow/displaced floor-tom tests verify recovery and cache separation while old default regressions remain intact.
- Expanded open-circle search to bounded above-head positions and added crossed-circle half-open evidence. Half-open remains a tentative annotation with closed-hi-hat playback, not a new articulation sound or automatic choke state.
- Build and 207 tests/68 files passed. Targeted lint has no errors and the pre-existing crop-effect advisory. Actual failing PDF crops, physical listening and mobile checks remain manual; no aggregate accuracy/performance gain claimed.
- References: previously reviewed Word guides inform source-dependent positions and plain/crossed circles. Further document-wide notation work remains on roadmap.
- Next proposed v0.10.12: annotate failing source bars and improve discrimination between true heads, staff lines, stems and text; continue articulation validation.

### v0.10.12 - Actual feedback-bar validation and multi-bar safeguard
- Inspected feedback for v0.10.12 .png. The supplied lower selection spans five bars, while the existing draft assumes one evenly spaced sixteen-slot bar. Source kick heads are below the bottom staff line, unlike the default guide/key kick position. Dots, mixed beam counts and variable engraving spacing remain unsupported for automatic faithful transcription.
- Isolated the third source bar into a binary regression fixture with eleven manually checked filled-head centers: snare, toms, floor tom and kick. Included annotated crop for user review; no full-song ground truth claim.
- Added optional clean-head scoring: exclude staff/wide beam rows from oval evidence, penalize off-center mass and suppress weaker neighboring shoulders. Default API behavior remains compatible; UI enables the reversible Reduce beam/stem candidates option.
- On this one source bar, with Master Drum Key/tolerance 2/Kick offset 4.5/Snare offset 1.5, candidates fell from 57 to 22 while retaining all eleven checked filled heads. Remaining extras include cymbal/pedal suggestions. This is not an overall precision/accuracy benchmark.
- Added source snare/kick calibration; filled overrides no longer remove cross-shaped pedal suggestions at the same height.
- Added distinct internal-barline hints and blocked both direct/duration-reviewed draft creation when two or more interior boundaries suggest multiple bars. User must crop one bar or set guides within one bar. Hints are not reliable full measure parsing and may miss or falsely flag bars.
- Build and 211 tests/69 files passed. Targeted lint has no errors and the pre-existing crop-effect advisory. Physical audio/browser E2E/mobile checks remain manual.
- Next proposed v0.10.13: reduce remaining cymbal/pedal false positives and strengthen beam/dotted-rhythm uncertainty guidance using the feedback source.

### v0.10.13 - Multi-staff guard, cross filtering and instrument visibility
- Inspected third bar.png, 2 musical charts.png and one bar.png locally. They show overlay-obscured source notes, beam false positives, missed thick crosses and silent first-staff inspection. These screenshots are diagnostic references, not clean recognition ground-truth inputs.
- Instrument Mix follows Shown Instruments; hidden notes and saved mix settings remain intact. Show all to edit hidden mix settings; Reset instrument mix still resets the entire kit.
- Block direct and duration-reviewed draft creation when more than one staff is detected or at least one interior barline hint is present. Detected staff selection remains inspection-only for multi-staff crops. Guard is conservative and heuristic: missed staffs/barlines remain possible, and stems can produce false warnings.
- Cross scoring now checks long beam support around the head, preserves thick crosses with surrounding contrast, and removes weaker neighboring cross suggestions. No universal accuracy claim; the checked prior source fixture retains eleven filled heads and two cymbal crosses with 22 total candidates (remaining false positives).
- Tentative isolated dot evidence marks duration unknown and displays a review warning. Dotted, tied, tuplet and 32nd-note transcription remains unsupported. No unsupported duration is automatically applied to chart playback.
- Build and 216 unit tests across 70 files pass. Targeted lint has no errors and the existing set-state-in-effect advisory. Physical audio, mobile and browser E2E checks not executed here.
- Next proposed v0.10.14: clean source-crop benchmarking for missed cymbal/floor-tom heads and explicit duration/voice uncertainty review; multi-bar transcription stays deferred until measure parsing is reliable.

### v0.10.14 - Head-recovery benchmarks and candidate review guidance
- Added a one-to-one head matcher with maximum matching, so duplicate suggestions cannot inflate recovered-head counts. Misses and unmatched suggestions are reported separately; no precision/global accuracy claim from partially labelled references.
- Benchmarked the existing isolated source fixture: all 11 checked filled heads plus 2 position/shape-checked cymbal crosses recovered. Raw 57 candidates/44 unmatched; clean-head mode 22 candidates/9 unmatched. Cymbal identity, rests, durations and whole songs are not validated by this benchmark. No new clean PDF or new exhaustive annotations were supplied this turn.
- Added Needs review filter and per-candidate reasons: uncertain durations, possible unsupported dots, more than two beams, nearby competing instrument suggestions and unsupported half-open playback. Proximity is fixed at four pixels and is heuristic, not instrument confidence or a diagnosis of false notes.
- Rhythm Review summarizes checked candidates needing review. Filter never unchecks hidden selections or modifies mappings/durations; manually verified simultaneous voices may legitimately be close together.
- No detection-score, audio, chart schema, package or workflow changes. Existing v0.10.13 instrument visibility and multi-staff safeguards remain.
- Build and 225 unit tests across 73 files pass; changed-file lint has no warnings/errors. Browser E2E and physical audio/mobile tests not run.
- Next proposed v0.10.15: clean PDF crop regression expansion and candidate-to-source review improvements before changing recognition scoring. Measure parsing, faithful dots/ties/tuplets/32nds and reviewed PDF-to-MusicXML conversion remain on the roadmap.

### v0.10.15 - Clean source comparison and controlled benchmark expansion
- Focused candidate inspection adds Clean source view (hide outline) and Wider context. Both operate on original local crop pixels without changing acceptance, instrument mapping or chart data.
- Preview scaling now preserves source aspect ratio within canvas limits, avoiding distortion of large/wide beam context. Expanded bounds stay clipped to original image; skew-coordinate handling remains intact.
- Added a fully labelled synthetic head fixture and four scale/skew regressions (1x/2x, 0/+2/-2 degrees) covering snare, below-staff kick, floor tom and hi-hat. All four recover four reference heads, with remaining unmatched suggestions reported honestly.
- Existing real source benchmark still recovers 13 checked heads with nine unmatched clean-mode candidates. No new clean PDF source samples or exhaustive real-song labels were added this turn. Synthetic results are not a real-PDF accuracy estimate.
- Detection scoring, durations, chart schema, audio, packages and workflow remain unchanged. Candidate uncertainty and multi-staff safeguards from prior releases remain.
- Build and 232 unit tests across 75 files pass; targeted lint clean. Browser E2E/mobile/physical audio checks remain manual.
- Next proposed v0.10.16: faster review of uncertain candidate groups and source-dependent instrument-position validation; continue real-chart benchmark expansion when clean crops and verified source labels are available.

### v0.10.16 - Actionable duration review and false-region recovery
- Inspected issue one bar.png locally. Full-height stems attached to detected heads can be mistaken for internal measure boundaries by the previous vertical ink heuristic.
- Added bar-region review: discount interior boundary hints near candidate heads, retaining independent boundaries. Conservative heuristic only; missed heads or heads close to true barlines can still mislead it.
- False-region confirmation offers an explicit recovery path after verifying exactly one bar on one staff. Actual multi-bar/staff selections must be recropped. Confirmation resets on scanning, staff selection and guide changes; it is not automated measure validation.
- Build Draft explains missing verification, selection, invalid guide order, region warnings or complete onset misalignment. Checking candidate boxes alone is not the final source-verification checkbox.
- Added per-candidate Manual duration selection with Quarter/Eighth/Sixteenth. Changing instrument alone does not review duration. Manual values update initialization hints, invalidate stale drafts and reset final verification. Actual duration metadata requires Duration-aware review -> Initialize accepted notes -> correct onset/gaps/overlaps -> Confirm reviewed bar; direct grid draft uses checked onsets only.
- Added Review uncertain candidates shortcut and source head offset from selected staff for manual drum-key comparison. Dots, ties, tuplets, >2 beams and half-open playback remain unsupported; their caution is not resolved merely by selecting a supported value.
- Manual duration changes reset the duration-aware review panel to prevent sending events initialized with stale hints. Detection confidence is not increased by manual edits.
- Build and 236 unit tests across 76 files pass. Lint has no errors, retaining the pre-existing effect advisory. Browser E2E, physical audio and mobile checks remain manual.
- Next proposed v0.10.17: streamline duration-aware event editing and make remaining gap/overlap corrections more specific; retain experimental recognition and the PDF-to-MusicXML roadmap.
