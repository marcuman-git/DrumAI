# v1.0.0-rc.3 — remove invented rest glyphs

The highlighted symbols were generated per-instrument coverage rests, not detected noteheads. Composite staff rendering now shows shared silence once, retains explicitly reviewed/source-anchored rest glyphs, and hides inactive-voice coverage gaps while other instruments play. Legacy charts benefit without reanalysis; underlying timing and playback remain intact. Rest display intent is preserved through saves and MusicXML print-object flags. See REST_NOTATION_FIX.md.

---

# Consolidated musical timing update — v1.0.0-rc.2

Added source-evidence timing constraints, explicit ambiguity/anchors, mixed beams, preserved review metadata, connected stylized-head stem recovery, and safeguards against accidental grid conversion. Whole-bar timing regressions check184 heads across16 source/scale cases; five unmatched detections remain reported. See TIMING_UPDATE.md for workflow, evidence and limits.

---

# Combined candidate — 2026-11-26

v1.0.0-rc.1 combines the six local-app finalization tracks: source review, advanced reviewed timing/MusicXML,256-bar charts, input/persistence cleanup, complete local backup, and release documentation. Existing source/history workflows remain compatible. New-user demonstration progress and production coach injection controls were removed.

525 unit tests across151 files and production build pass. Full-app lint reports32 warnings and no errors; broader lint includes modules outside prior song-practice checks. Source regression report was rerun. Expanded rest sensitivity has12/12 known repeated-scale references,0 unmatched suggestions and0 quarter-rest mislabels in the selected development crops; this mode still requires fresh independent validation.

Chromium downloaded, but browser execution could not start because host libraries are unavailable and dependency installation failed. Physical mic/MIDI, audible output, browser/mobile and production offline/update checks remain pending in RELEASE_READINESS.md. No deployment was performed here.

---

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

### CI follow-up before v0.10.17
- Repeated GitHub Ubuntu mirror DNS failures blocked browser dependency installation before browser tests ran. Runner pinning and bounded retries did not resolve the reported network problem.
- Full-test workflow now uses matching official Playwright v1.64.1-jammy container with bundled Chromium and dependency libraries; verifies package/browser match and still runs unit tests, E2E and build. Network is still needed for container/npm downloads. User reported the workaround works; remote final test results are not independently observed here.

### v0.10.17 - Specific rhythm diagnostics and faster corrections
- Duration-aware review now reports missing/overlapping slot ranges per participating instrument, identifies affected event numbers and flags events crossing the bar end even when aggregate validation fails.
- Different instruments may overlap in time legitimately; conflict diagnostics concern coverage within the same instrument voice only.
- Jump-to-event controls select the relevant review instrument, highlight/scroll the event row and focus its onset field. Events now offer direct instrument correction. Selected-instrument-only filtering hides rows without deleting them.
- Fill next gap with manual rests explicitly fills only the first uncovered range of the selected voice using supported durations. It preserves existing notes and other voices, refuses event-limit overflow and is not automatic PDF rest detection. Existing full-voice manual gap fill remains available.
- Edits and gap fills invalidate prior source confirmation/drafts through the existing callback. No automatic overlap resolution or confirmation; manual source checks still required.
- Build and 244 unit tests across 77 files pass; changed-file lint clean. Browser E2E, physical playback and mobile interaction checks remain manual for this patch.
- No audio/schema/dependency/workflow changes in this release; previous false-region and manual-candidate-duration controls retained.
- Next proposed v0.10.18: undo/redo for duration-review edits, preserving explicit confirmation/invalidation rules. Faithful PDF measure/rest/dotted/tied/tuplet/32nd recognition and reviewed MusicXML conversion remain pending.

### v0.10.18 - Duration-review Undo/Redo (2026-11-12)
- Added bounded event-edit history (50 snapshots) for duration-aware review: additions, removals, initialization, instrument/onset/duration/kind edits and manual gap fills.
- Undo/Redo restores events only. Scan results, instrument/filter choices, source confirmation and existing sent drafts are not restored. Unaccepted rest hints are cleared during history navigation; users can rescan them.
- Every Undo/Redo invalidates the parent draft and requires explicit source confirmation again, including after restoring a structurally valid rhythm. No automatic confirmation or transfer to the chart.
- New edits clear redo; identical edits do not consume history. Deep-copied event objects prevent input mutations from changing saved snapshots. Invalid rhythms are retained for manual correction, not automatically accepted.
- History resets with the existing source/candidate-key remount workflow and is not persisted across refresh/navigation. Saved chart schemas and playback unchanged.
- Build and 251 unit tests across 78 files pass; changed-file lint clean. Browser E2E, mobile and physical playback checks remain manual.
- No package, audio, schema or test-workflow changes. Keep the working container-based full-tests workflow.
- Next proposed v0.10.19: clearer source-to-reviewed-event traceability and comparison workflow; automatic full-chart/PDF-to-MusicXML transcription remains experimental and pending.

### v0.10.19 - PDF reselection, cymbal hints, staff counting and source traceability
- Fixed the post-analysis selection dead end: Select another region clears prior crop/analysis and enables dragging again without re-rendering or changing chart notes. Clear region also re-enables selection.
- Added Reset PDF rendering to re-render the current page and clear crop/analysis. Rendering requests are aborted/reset safely when preparation restarts; page controls still preserve chart data.
- Added tentative isolated crossed-ledger evidence above the staff. Candidate review offers manual Crash mapping; no automatic instrument remap or universal crash/ride/hi-hat identity claim. Publisher/source legends remain authoritative.
- Staff displays Quarter/Eighth/Sixteenth count-label choices, preserving actual note data and playback. Crash head style supports crossed ledger (default) or circled cross. Reviewed event duration still determines note flags.
- User phrase '2 4' is ambiguous; requested clarification. Current implementation remains 4/4 and explicitly says display counting is not a 2/4 time-signature conversion. Actual meter support must change bar timing/data/reading together.
- Initialized review events retain temporary source candidate IDs through field edits and Undo/Redo. Inspect source buttons focus/scroll to source review. These links describe initialization provenance, not proven detection correctness.
- reviewedBar strips temporary source IDs before saved/chart JSON data; no persisted schema change or audio change.
- Build and 259 tests across 80 files pass. Targeted lint has no errors, retaining prior crop-effect advisory. Browser E2E, mobile selection/scroll and physical playback remain manual.
- No package or workflow changes. Upload dependency-first bundle before final full tests/deploy.
- Next proposed v0.10.20: meter-aware charts starting 2/4 alongside 4/4, with coordinated notation, duration validation, playback and saved-chart compatibility, subject to clarification. Broader verified PDF recognition and MusicXML conversion remain pending.

## 2026-11-13
### v0.10.20 - Crash recovery, symbol grouping and coordinated 2/4 charts
- Corrected clean-cross filtering that could reject an isolated crossed-ledger cymbal head as a dense core or beam. Controlled Crash regression passes; source-specific recognition remains experimental and requires manual verification.
- Staff count choices now derive quarter/eighth grouped symbols for grid bars, preserving every original onset. Fixed remaining renderer paths that read original grid data instead of derived notation. Dense passages retain shorter notes; reviewed durations always override display grouping. No inferred PDF duration claim.
- Added 2/4 alongside legacy 4/4: eight active slots, two-beat playback, meter-aware validation, grid and staff. Split each 4/4 bar into two 2/4 bars; join pairs to return. Conversion refuses crossing reviewed durations, oversized splits, odd joins and mixed reviewed/grid pairs. Section and review reset after conversion.
- Optional meter/beat metadata survives saves and chart JSON; legacy charts remain 4/4. Clear/add/duplicate preserve meter. Count-in intentionally remains four clicks.
- PDF drafts and MusicXML import still use 4/4. Append PDF drafts before meter conversion. No package or CI workflow changes.
- Build and 268 unit tests across 82 files pass; changed-code lint clean. Browser E2E, actual source PDFs, mobile and physical audio remain manual checks.
- Next proposed v0.10.21: meter-aware PDF duration review and MusicXML 2/4 import, with explicit source-meter selection and regression coverage.

## 2026-11-16
### v0.10.21 - Focused draft previews and 2/4 source/import support
- User feedback: draft counting should default to eighth counts and previews should not show absent instrument voices.
- Grid and duration-reviewed draft staves now initialize with eighth counting (1 & 2 & ...). Preview grid and staff include only participating voices. Reviewed durations remain authoritative; changing count display does not invent durations or discard onsets. Main chart display preferences remain unchanged.
- Added manual PDF source meter selection (2/4 or 4/4). Candidate alignment, draft construction, rhythm diagnostics, reviewed onset/rest positioning, gap fill, bar-end validation and confirmation use eight or sixteen sixteenth slots respectively. Meter changes clear draft and source confirmation and remount review history, without editing chart data.
- Draft append requires matching chart meter; mismatch shows guidance and disables append. Two-beat metadata survives append, save and JSON export through the existing chart schema.
- MusicXML import now accepts complete uniform 2/4 or 4/4 percussion charts, inheriting meter attributes across measures. Mixed meters, incomplete bars and existing unsupported notation are rejected. Imported notes remain onset-grid data; full encoded duration/voice engraving is not introduced by this release.
- Build and 274 unit tests across 82 files pass. Targeted lint has no errors; existing crop-reset effect warning retained. Browser E2E, physical audio and user-source PDF checks remain manual.
- No new packages, workflow changes, server uploads or app version labels.
- Next proposed v0.10.22: source-specific cymbal recognition confidence and clearer manual duration correction, with benchmark checks before claiming improved recognition accuracy. PDF-to-MusicXML conversion remains on the roadmap, not yet delivered.


### v0.10.22 delivered (2026-11-17)
- Added eighth/quarter/sixteenth source onset guides. Eighth guides map eight hits to slots 1,3,5,7,9,11,13,15 rather than stretching the last onset to slot 16; the sixteenth editing grid is retained.
- Expanded analysis crops with 35% vertical context above/below and a small horizontal margin, clipped to the page. Original selected crop exports remain unchanged. Verify guides in the expanded scan.
- Added above-line/on-line/ambiguous cymbal position evidence in supplied key profiles. Cross centers ignore staff ink; Hi-hat heads that touch the top line are distinguished from centered Ride heads. Generic mapping remains manually verified.
- Eighth staff defaults and controlled editor count selection now drive playback status labels immediately. Silent intermediate slots remain timed and highlighted. Count-in remains its separate preparation setting; note onset timing is unchanged. Corrected 2/4 practice-history boundaries to use actual bar slot count.
- Review initialization starts with an explicit eighth-duration assumption; tentative hints are opt-in, and manual candidate durations take priority. Existing reviewed durations are retained. Added flag/beam and separate evidence guidance.
- Controlled benchmark: 48/48 labelled cymbal heads recovered in 12 cases (scale 1/2, skew 0/+2/-2 degrees, Hi-hat centers at -0.5/-0.25 staff spaces). This is synthetic key-profile coverage, not real-PDF instrument accuracy. Existing local chart regressions pass.
- Build and 291 unit tests pass. Explicit changed-source lint passes. Browser tests could not launch due to missing system libraries; dependency installation requires administrator access unavailable to this account. Physical audio/source checks remain manual.
- No dependency, chart schema or CI changes.


### v0.10.23 delivered (2026-11-17)
- Added manually labelled real-source validation: five supported cymbal heads from the supplied Master Drum Key PDF and three crossed-ledger Crash heads from the original feedback score crop. Circled/unsupported cymbal identities are excluded, not guessed as truth.
- Corrected cross-center fitting for thin 45-degree engraving as well as flatter crosses. Improved short isolated-ledger support to retain the real key's Crash glyph without treating extended beams as ledgers.
- Beam hints track local slopes and count thick/occluded bands; short separated flag clusters are counted for both stem directions. Beam and flag evidence are shown separately in candidate review.
- Connected-component dot evidence retains the visibly dotted source note as unknown. Stems reaching the crop edge remain unknown with guidance to expand the scan.
- Local validation: 8/8 labelled real-source cymbal identities recovered; 11/11 source duration checks pass (nine sixteenths, one quarter, one unsupported dotted-note safeguard). Recorded v0.10.22 baseline recovered 6/8 cymbals and 6/9 double-beam durations, and mislabeled the dotted note straight eighth. These are partial local checks, not full-PDF accuracy or complete transcription.
- Build and 298 unit tests pass, including existing real-chart regressions and all twelve controlled cymbal cases. Browser/physical-audio verification remains manual because the environment lacks Chromium system libraries. No packages, schema or workflow changes.


### v0.10.24 delivered (2026-11-17)
- Added ring-around-head evidence and explicit review controls for circled, ambiguous and crossed-ledger cymbal candidates. Circled heads are not interpreted as open-hi-hat markers above a note. China/other unsupported identities remain manual and should be left unchecked if no supported voice matches.
- Added Cymbal heads filter and inspection/voice-mapping shortcuts. Filtering preserves hidden selections. Mapping only changes the suggestion, resets draft/confirmation through the existing flow and now labels the manual mapping clearly.
- Added Beam context preview with wider neighboring context, separate beam/flag readout and optional amber duration-window/stem overlay. Clean source view hides every overlay. Original source pixels and reviewed values remain unchanged.
- Corrected preview bounds and scan overlays to project all four hint corners through source skew, rather than shifting the entire window at one x coordinate. Temporary hint metadata now includes detected stem x/end positions.
- Expanded labelled local-source cases with the supplied key's circled China symbol and another original feedback score bar. Benchmark: 10/10 supported cymbal references, 14/14 duration cases and 2/2 circled-symbol references requiring manual identity review. This is partial local coverage, not general recognition accuracy or full-song transcription.
- Build and 308 unit tests pass; changed-source lint passes. Browser/physical-audio checks remain manual due to unavailable browser system libraries. No package, persisted schema or CI changes.


### v0.10.25 delivered (2026-11-17)
- Added per-scan cymbal identity review records: unreviewed, verified as current voice, or unsupported/excluded. Voice mapping clears verification. Rescanning/source changes clear records. Review status is independent of acceptance and durations and is not saved in chart data.
- Checked circled/ambiguous heads require explicit identity verification before grid draft construction or duration-reviewed confirmation. Unsupported candidates are unchecked and disabled, including Select all. Ordinary unflagged heads retain existing general source confirmation.
- Identity-review changes preserve duration events but clear confirmation/drafts. Mapping still resets review as before. Verified identity removes resolved identity warnings while separate duration/articulation warnings remain.
- Added pinned focused-source comparison using candidates from the current scan, including filtered candidates. Paired previews share clean/wide/beam controls without copying acceptance, mapping, identity records or durations. Each panel fits its own source bounds. Pins reset with source/scan changes.
- Fixed incomplete propagation of onset-guide spacing into draft construction and rhythm diagnostics. Eight eighth-guide hits now remain at grid steps 0,2,4,6,8,10,12,14 in the sent draft.
- Added original fourth feedback score crop: two Crash references and dotted-eighth, beamed-sixteenth and quarter duration cases. Local benchmark: 12/12 supported cymbal references, 17/17 duration cases, 2/2 circled-symbol review references. Partial local coverage, not general recognition accuracy.
- Build and 317 unit tests pass. Browser and physical-audio checks remain manual because required browser system libraries are unavailable. No package, persisted chart schema or workflow changes.


### v0.10.26 combined release (2026-11-17)
- Incorporates the five proposals formerly planned as v0.10.26–v0.10.30 into one release.
- Source legend reference notes, checked-candidate review totals, local JSON source-review save/restore. Restore requires matching crop pixels, source/page, scan settings and candidate geometry, restores mapping/selection/duration edits, and clears identity and source confirmations. Sessions are separate from chart saves and require the original crop to be loaded and scanned first.
- Dedicated China, Splash and Ride bell rows for editing, staff notation, mix/playback, JSON and GM MusicXML imports. Distinct synthetic sounds; no automatic symbol identity claim. Their manual mapping requires identity verification before PDF draft confirmation.
- Reviewed dotted eighth (3 slots), dotted quarter (6 slots), and ties between adjacent same-voice notes within a bar. Tied continuations render heads/curves but do not trigger a second drum strike. Invalid ties, gaps, overlaps and overflows cannot confirm/export. Ties across bar/meter split boundaries remain unsupported and are rejected.
- MusicXML export from source-confirmed bar review and from complete reviewed chart bars; grid-only bars cannot export guessed durations. XML uses separate GM instruments/voices, dots, ties, rests, accents/ghost heads, meter and tempo. Import retains supported complete per-voice reviewed metadata and tied onset suppression.
- Added visually labelled Ride bell, Splash and China key crops for manual identity-policy and export/import checks. Added clean lower system from 2 musical charts.png with circled/plain-cross and dotted-eighth/sixteenth source evidence; unknown cymbal identity remains withheld without a legend.
- Validation: 326 unit tests across 88 files and production build pass. Original source benchmark remains 12/12 cymbal identities, 17/17 durations and 2/2 circled-symbol cases, with four additional focused source-evidence checks and three separate manual identity cases. Partial local coverage, not general recognition accuracy.
- No package/workflow changes. Saved event data extends schema 1 with dotted durations and optional tieFromPrevious; legacy charts remain readable. Browser and physical-audio checks remain manual due to missing browser system libraries.


### v0.10.27 delivered (2026-11-17)
- Cross-bar tie review now validates the preceding reviewed bar, using the existing tieFromPrevious field. The chart editor offers explicit source-verified boundary-tie controls and a previous-bar comparison. Incoming/outgoing arcs and tied grid markers distinguish continuations from rests.
- 4/4 → 2/4 conversion splits crossing reviewed durations into supported fragments, ties note continuations and leaves rest fragments silent. Joining preserves ties and fills explicitly absent voices with rests. Onsets and total timing survive conversion; joined notation may retain tied fragments rather than reconstructing the original dotted symbol.
- Full-chart playback suppresses continuation strikes across bars. Starting or looping a selected section at a continuation sounds its initial head once so the section can be practised independently. Grid edits discard duration review and turn tied heads into fresh grid strikes. Deleting or duplicating bars detaches incoming ties when the preceding-bar relationship changes; orphan continuations after preceding-grid edits become fresh strikes. These edits are undoable.
- MusicXML import/export preserves supported cross-bar chains, dots, rests, separate voices and dynamics. Rest-only reviewed voices retain metadata using unambiguous voice mapping from surrounding measures. Invalid, interrupted and dangling ties are rejected. Standalone bar review still cannot confirm an incoming tie without chart context.
- Source session restore shows saved scan requirements and offers Apply saved settings, rescan and restore. It validates the exact original crop/source/page and supported settings before scanning, then checks candidate geometry before restoring mapping, selection and duration edits. Identity, source and region confirmations remain cleared. Existing version-one sessions remain supported.
- Added an independently inspected Highway To Hell PDF source: eight visually labelled crossed heads with single-beam eighth durations. Instrument identities are withheld because this score has no accompanying cymbal legend. Tightened minimum ring radius to exclude plain cross/staff/stem junctions while retaining the existing labelled ring cases.
- Validation: 340 unit tests across 91 files, production build and local source benchmark pass. Benchmark retains 12/12 labelled cymbal identities, 17/17 original duration cases, 2/2 circled-symbol references and four lower-system checks, plus 8/8 new eighth values and 8/8 new plain-cross exclusions. Three extra key identities are manual mapping/round-trip cases, not automatic accuracy claims. Lint has five nonblocking React state-in-effect warnings.
- No package/workflow or chart-schema-number changes. Browser/physical audio remain manual due to unavailable browser system libraries. Tuplets, half-note reviewed durations and automatic full-song transcription remain outside this release.


### v0.10.28 delivered (2026-11-17)
- Added direct reviewed-duration editing in the chart editor for bars that already have confirmed/imported duration metadata. Local drafts support voice, onset slot, sixteenth/eighth/quarter/dotted duration, note/rest, dynamics and ties, plus event removal and explicit next-gap rest filling. Grid-only bars retain their existing grid flow.
- Coverage diagnostics identify gaps, overlaps and overflow event numbers, with inspect-event controls. Tie diagnostics identify orphan incoming/internal ties and edits that break continuations into the next bar. Applying requires valid supported rhythm and fresh source verification. Outgoing ties may detach only after an explicit source-verified acknowledgement; unaffected voices retain their ties.
- Applied edits atomically rebuild onset arrays and reviewed metadata, clear stale chart review, retain compatible JSON/MusicXML data and participate in chart Undo/Redo. Invalid drafts do not change playback or saves. Draft edits reset when navigating to another bar or changing chart bars, so apply/discard before switching. Review controls disable during playback.
- Added fresh 108/144/216 DPI renders from the supplied Highway To Hell PDF, reusing eight visually labelled single-beam note coordinates. Across three DPIs: 24/24 eighth-value checks and 24/24 plain-cross checks. These are eight repeated musical references at three rendering scales, not 24 independent notes; instrument identities remain withheld without a source legend.
- The 216 DPI cases exposed stem placement/attachment gaps that returned unknown values. Stem-position search now scales with staff spacing and allows a proportional initial attachment gap only inside the head footprint; continuity beyond the head remains strict. Existing dotted-note withholding, beam/flag, clipped-stem and ring cases remain intact.
- Validation: production build, 350 unit tests across 94 files and local source benchmark pass. Original benchmark remains 12/12 labelled supported cymbal identities, 17/17 original durations, 2/2 circled-symbol references, four lower-system checks and eight additional base-DPI score checks. Three key identity cases remain manual mapping/round-trip evidence. Lint has five nonblocking React state-in-effect warnings.
- No package, workflow or persisted chart-schema changes. Browser and physical-audio checks remain manual. The scale benchmark checks duration/symbol evidence at labelled coordinates; it does not claim automatic notehead detection or general recognition accuracy.


### v0.10.29 delivered (2026-11-17)
- Added a focused Source reference panel in Play Chart: local PDF filename and per-bar page, persisted through existing chart review JSON. Show source reference requests a matching user-selected local PDF, navigates its browser iframe/page link, and scrolls to the viewer. Missing/mismatched files prompt for the correct local file; source text is never fetched as a URL. Pending requests retry after selecting the matching file. Browser PDF viewers remain responsible for page validity and support.
- Appended PDF drafts retain their source/page and require an existing source filename to match. A chart has one source filename; use separate charts for different PDFs. Duration and boundary-tie edits retain references and invalidate only affected review signatures. Structural bar/meter operations still reset source review metadata; recheck and restore references after rebar operations. PDF binaries remain local and are not saved.
- Added independent Undo draft edit / Redo draft edit with up to 50 local snapshots, including invalid intermediate rhythms. History moves and fresh edits clear source verification and outgoing-tie acknowledgement; branch edits clear redo. Discard resets local history to applied events; Apply participates in existing chart Undo/Redo. Switching bars, chart bars or saved source/page resets unapplied drafts. Controls disable during playback.
- Added twelve visually labelled Back in Black PDF references at fresh 108/144/216 DPI: quarters, eighths, sixteenths, full/partial beams, shared stems and a standalone flag. Results are 32/36 duration checks, 35/36 beam/flag/none checks and 36/36 uncircled checks. All 24 duration/evidence checks at 144/216 DPI pass. Four 108-DPI duration failures remain visible: two missing thin stems return unknown, two short-beam neighbours return sixteenth for eighth. These twelve notes repeat across scales; instrument identities remain withheld without a source legend.
- Benchmarks exposed short secondary beams and long shared stems. Beam inspection now checks short bands alongside a longer primary beam and separates a real flag at all scales. Stem tracing covers shared stems up to seven staff gaps and uses direct column support to resolve equal-length candidates. Original source checks remain 12/12 supported cymbal identities, 17/17 durations, 2/2 circled symbols and 24/24 Highway scale durations/symbols. New mixed failures are reported separately; established checks and high-DPI mixed cases gate regressions.
- Validation: production build, 359 unit tests across 96 files and local source benchmark pass. Lint has six nonblocking warnings (one existing Fast Refresh export warning and five state-in-effect warnings, including PDF navigation synchronization). Browser and physical-audio checks remain manual. No package, workflow or persisted schema changes.


### v0.10.30 delivered (2026-11-17)
- Improved low-resolution thin-stem recognition by retaining a supplementary faint-ink mask from source RGBA pixels, using the selected threshold or 210 whichever is higher. Head/staff/beam detection remains at the user-selected threshold. Only stem tracing below ten-pixel staff spacing can use faint ink, and broad gray regions are excluded. Binary-only legacy fixtures continue to work.
- Beam support now requires ink attached near the stem; a neighbouring short secondary beam cannot supply a disconnected band. Previously failing 108-DPI Back in Black cases now pass: two faint stems and two short-beam neighbours. Mixed source benchmark is now 36/36 durations, 36/36 beam/flag/none labels and 36/36 uncircled symbols across fresh 108/144/216-DPI renders. These twelve source notes repeat across three scales, not 36 independent examples. General recognition accuracy and automatic head detection remain unestablished.
- Preserved source references through Add blank bar, Duplicate bar, Remove bar and 4/4-to-2/4 split or reverse join. Structural operations retain the chart source name, map per-bar pages/notes and reset verification/signatures. Blank bars receive page 1 awaiting source review; duplicates retain the selected reference. Joined bars retain every distinct page from both halves, with combined review notes capped at the existing 500-character limit. Splits conservatively retain all linked pages on both halves because exact PDF placement cannot be inferred.
- Added optional additionalPages to existing bar-review JSON. It is validated and round-trips with schema 1; older single-page charts require no migration. Same-bar edits and chart Undo/Redo preserve these references. Clear additional source pages lets the user simplify a split bar after checking its actual mapping.
- Added explicit source-page comparison: select a comparison page, open two local PDF viewers and links, view retained pages individually, or return to the primary single-page view. Comparison navigation does not edit saved references or chart notes. Matching filename validation protects both viewers; missing/mismatched source requests never navigate a different file. Layout uses two columns on larger screens and stacked viewers on narrow screens. Browser PDF fragment support/page limits remain device-dependent.
- Validation: 368 unit tests across 96 files, production build and local source benchmark pass. All established real-source checks remain passing: 12/12 supported cymbal heads, 17/17 original durations, 2/2 circled symbols and 24/24 Highway scale durations/symbols, plus existing extra/manual source cases. Lint retains six nonblocking React warnings. Browser/physical audio checks remain manual. No new packages or workflow changes.


### v0.10.31 delivered (2026-11-19)
- Addressed feedback image image_1795079861455.png: overlapping hi-hat candidate labels on the first Back in Black groove and an unavailable Build draft preview button. Generic cross-head fitting now refines vertical centers too, then retains the strongest close cross candidate while collapsing overlapping same-instrument shoulders. Nearby distinct head coverage and filled-head regressions remain checked. The provided screenshot contains overlays, so recognition benchmarks use fresh unannotated renders of the corresponding supplied PDF passage rather than treating overlay pixels as notation.
- Build draft preview no longer requires source acknowledgement before displaying provisional checked/aligned onsets. Identity, alignment and actual multi-bar/staff safeguards remain. Sending still requires source acknowledgement and valid identity/region checks. Unchecked candidates remain excluded. This lets users inspect a provisional preview before verifying it.
- Added rendered local PDF comparison with actual document page-count bounds, Previous/Next, direct page selection, and 50/75/100/150/200% zoom per pane. Rendering is bounded to about four million pixels and a maximum scale of three. A staging canvas plus abort guards prevents stale render commits during page/zoom/file changes; PDF tasks are destroyed. Chart references and the recognition crop are unchanged by viewer navigation. Browser PDF fallbacks remain in collapsed details for unsupported/damaged/password-protected files.
- Added eight visually labelled cross heads from the supplied Back in Black first complete groove bar, freshly rendered at 108/144/216 DPI. With generic profile, clean heads and tolerance 2: 24/24 head recoveries, exactly eight cross suggestions per scale and zero unmatched suggestions. Instrument identity is withheld without a source legend. These are eight notes repeated at three scales, not 24 independent examples; automatic duration accuracy for this added head benchmark is not asserted.
- Validation: 374 tests across 98 files and production build pass. Existing source checks remain 12/12 supported cymbal heads, 17/17 original durations, 2/2 circled symbols, 24/24 Highway scale values/symbols and 36/36 mixed-duration values/evidence. Explicit-file lint retains six nonblocking React warnings. Build emits a nonblocking shared static/dynamic renderer-import notice. Browser and physical-audio validation remains manual. No new packages, workflow changes or persisted chart-schema changes.


### v0.10.32 delivered — combined five proposed phases (2026-11-19)
- Folded the previously proposed v0.10.32–v0.10.36 work into this single release. No intervening phase uploads are required; this set follows complete v0.10.31.
- Source-crop comparison: original unannotated pixels appear beside the current draft staff with independent source zoom. Candidate overlays remain separate. Fit guides to checked head range supplies a provisional first/last range; it never infers timing. Uneven engraved spacing or mixed onset gaps prompts manual onset review. Source focus/zoom/filtering does not invalidate an already staged review.
- Duplicate and ambiguous-head review: possible overlap filter, explicit source comparison and Keep/exclude actions work for close same-shape alternatives. Both heads may be real; no automatic identity transfer is performed. Existing Hi-hat/Ride/Crash and circled-cymbal source-legend controls remain. Manual selection, mapping, identity and duration corrections keep a bounded 50-entry audit trail. Version-one source-review sessions optionally save/restore this trail; identity and source confirmation still require rechecking after restoration.
- Rhythm context: nearby stem endpoints are compared only when an actual ink path links them outside staff lines. Connected-path context can distinguish shared-beam evidence from locally detected flags; a short flag without a confirmed path remains isolated-flag evidence. It does not force unsupported dots or user-reviewed musical values. Candidate controls link beam neighbours for side-by-side source inspection. Dotted values and adjacent ties remain manual reviewed-duration features; tuplets and automatic expressive-notation interpretation remain unsupported.
- Multiple-bar review: select one staff on one PDF page, opt into passage review, set 2–8 explicit boundaries over the original crop, and review each sliced bar separately. Uneven bar widths are supported. Each bar stages only after its source verification. Completely silent bars have a separate source-confirmed path with an explicit warning that repeats/slashes are not silence. Every staged bar must share a meter; final ordered-passage verification is required before sending. Any candidate/settings/source/guide/duration edits invalidate the affected staged bar and final verification. Boundary edits discard the local passage review.
- Ordered append: Add detected bars atomically appends the whole verified passage, retains page/source references per bar, and participates in existing chart Undo/Redo. Mixed meters, a mismatched existing source, or exceeding sixteen chart bars blocks the entire append without partial consumption. Staged passage data is temporary; append and save the chart to retain it. Single-bar drafts and legacy charts continue to work.
- Publisher validation: added four visually labelled eighth pickup crosses from supplied Feel Good Inc., Will’s Drum Lessons (transcribed by Will Beavis), at fresh 108/144/216 DPI. 12/12 duration checks, 12/12 beam/flag evidence and 12/12 uncircled-symbol checks pass. These four notes repeat at three scales, not twelve independent musical references. Existing Back in Black/Highway and source-key benchmarks remain passing. Known-coordinate duration/symbol tests do not establish automatic head detection, instrument identity or general recognition accuracy.
- Validation: production build and 390 unit tests across 104 files pass. Local benchmark passes: 12/12 new publisher durations/evidence; 24/24 first-groove head recoveries with zero unmatched crosses; 36/36 mixed durations/evidence; 24/24 Highway scale values/symbols; 12/12 supported cymbal identities, 17/17 original duration cases and 2/2 circled-symbol cases. Lint retains six nonblocking React warnings; build has the existing shared static/dynamic renderer-import notice. Browser and physical-audio checks remain manual. No new packages, workflow changes or persisted chart-schema version changes.


### v0.10.33 delivered — combined next five proposed phases (2026-11-19)
- Combined the previously proposed v0.10.33–v0.10.37 work into one release after complete v0.10.32. No intervening phase uploads are required.
- Passage recovery: snapshots save explicit bar boundaries, latest compatible candidate sessions/correction history, staged bar copies and original source-crop coordinates, without PDF pixels. Restoring checks the selected source/page/crop fingerprint, displays unverified saved previews, clears boundary/final confirmation and offers source recheck/restaging. Candidate sessions can reproduce scan settings and restore manual corrections through the existing source-session controls. Saved previews remain independent copies until replaced by the current staged review.
- Recover saved crop reconstructs the original normalized rectangle on the saved PDF page, avoiding another pointer drag. The local PDF renderer validates actual page bounds; reconstructed pixels must match the snapshot before bar copies restore. Different rendering/font results can require a fresh review. Generation/abort guards discard stale file loads.
- Dense-note recognition: smaller head templates now reduce horizontal suppression as well as template size, including the weaker-cross shoulder guard. Use dense-head template (70%) is an explicit source-review aid, not increased confidence. Controlled tests retain two close small heads while suppressing a single head’s shoulders. Below seven-pixel staff spacing, short-beam checks allow one-pixel engraving bands and shorter horizontal support while keeping attached-stem evidence.
- Added fresh 72/90/108-DPI Back in Black mixed-duration renders. Results: 35/36 durations, 36/36 beam/flag-kind checks. All 90/108-DPI values pass; one 72-DPI left partial beam remains labelled eighth instead of sixteenth. This is twelve source notes repeated at three scales, not 36 independent examples. Existing larger-scale source checks remain passing; general recognition accuracy is unestablished.
- Source traceability: reviewed events can retain original normalized PDF head anchors, and chart review records retain per-bar source crops. View source for event and View source crop navigate the matching local PDF and render the original rectangle with an optional head outline. These are provenance, not proof of current duration/voice. Added/rest events without candidate provenance use the bar reference. Timing/voice edits, tie changes, meter splits/joins and JSON preserve valid source anchors/crops. Changing the source filename clears crop/event links; source/page/crop changes reset local source verification. Chart JSON import capacity increases from 512 KB to 2 MB for annotated longer charts; schema 1 and old charts remain compatible. MusicXML does not carry these PDF links.
- Adjacent-bar rhythm review: inspect both staff previews and original source pages/crops, review supported duration fragments, and source-verify tie versus fresh strike. Combined fragment lengths are shown; orphan incoming ties block a valid send until preceding bars are restored or explicit source-checked detachment is chosen. Reviewed-bar editors remain available for coverage/overflow correction. Leading silence prompts pickup-source review within the supported 2/4 or 4/4 bar; automatic shortened pickup timing, tuplets and repeat expansion are not introduced. Order/reference edits reset continuity verification.
- Longer-passage collection: enable Collect multiple staffs and pages, review each local region separately, and add verified sections to an ordered sixteen-bar collection. Sections retain their original pages/crops, can move earlier or be removed, and preview before one final source-verified send/atomic editor append. Collection state survives region/page changes and view toggles for the same selected PDF. Saving stores ordered bars, provenance and available individual/passage recovery data; restoration matches a full local-file fingerprint and clears verification. Recover section review resumes its saved crop/session; edits made later in collection previews must be rechecked against the recovered candidate state. Removing/replacing the PDF ends the live collection; save first to recover later.
- Validation: production build and 407 unit tests across 111 files pass. Tests cover crop/head-anchor mapping and JSON/meter retention, snapshot pixel/coordinate guards and unverified restaging, automatic saved-crop reconstruction, file-key collection restoration, per-page ordering, source event navigation, controlled dense heads, cross-section tie recovery and explicit orphan detachment. Lint has twelve nonblocking React synchronization/export warnings; build retains the shared static/dynamic PDF renderer-import notice. No new packages/workflow changes or chart-schema version migration. Browser/physical-audio checks remain manual.
- Established source suite still passes: 12/12 publisher durations/evidence, 24/24 first-groove head recoveries with zero unmatched crosses, 36/36 mixed values/evidence, 24/24 Highway scale values/symbols, 12/12 supported source-key cymbal heads, 17/17 original durations and 2/2 circled symbols, plus supplementary/manual source cases.


### v0.10.34 delivered (2026-11-19)
- Fixes the remaining 72-DPI partial beam with a narrower two-pixel attached-stem sample below seven-pixel staff spacing. Strict dark-ink attachment remains required; short evidence only augments an established beam.
- Adds four manually labelled lower oval notes in the existing dense Back in Black mixed-beam passage, rendered at 72/90/108 DPI. Their shared stems exceed the former seven-gap tracing cap; tracing now permits nine gaps with the same continuity checks. Small suite: 48/48 values and evidence kinds, representing sixteen notes repeated at three scales. These are added voices in the existing source passage, not a new independent publisher/passage. Identity is withheld without a source legend. Established source suites remain passing.
- Adds explicit source-verified first-bar pickup timing to chart editor: select the number of silent sixteenth slots to skip. Notes, reviewed events and source links stay intact. Playback/highlighting begin at the actual offset; loops repeat the shortened first bar, later selected sections use full bars, count-in is separate. Optional schema-1 pickupOffset persists in save/load and JSON. Offsets that would skip any strike are rejected; live note conflicts restore full timing on the next start/loop and block save until pickup is turned off or corrected. Remove-bar resets pickup. Meter conversion requires turning pickup off and rechecking after conversion. No automatic pickup detection, tuplets or arbitrary meters.
- Production build and 410 unit tests / 112 files pass. Tests cover one-second pickup at 60 BPM, loop cycle timing, later-section offset, JSON retention, two-beat support, invalid/hidden-strike rejection and meter safeguard. Explicit-file lint retains twelve nonblocking React warnings. Browser/physical-audio verification remains manual. No package or workflow changes.


### v0.10.35 delivered (2026-11-19)
- Added an independently visually labelled dense passage from the supplied Baba O’Riley score, page 1, section F: sixteen oval heads in four double-beam groups, with accents below. Fresh 72/108/144/216-DPI crops yield 64/64 duration, evidence-kind and symbol checks; 64/64 within-group context links with zero cross-group links. This is sixteen source notes repeated at four scales, not 64 independent examples. Publisher/instrument identity is withheld without an accompanying source legend. Known-coordinate checks do not establish general candidate detection accuracy.
- Beam context now rejects links containing a continuous gap longer than the scaled limit, rather than accepting a high average ink ratio across separate groups. Mixed/partial beam durations remain individual hints. Continuous vertically shared stems now link heads at distinct heights; the same bounded narrow faint-stem support used by tracing is allowed below ten-pixel spacing, while broad gray backgrounds are excluded. Candidate navigator offers Compare shared-stem head alongside existing beam-neighbour comparison. Neither context links nor adjacent heads assign instrument identity or copy duration values.
- Added separately labelled shared-stem pair checks in the existing Back in Black dense crop: four pairs at 72/90/108 DPI, 12/12 links with individual durations retained. Existing source suite remains passing, including 48/48 smaller-scale duration/evidence checks. Controlled tests reject duplicate heads, disconnected stems and broad faint backgrounds.
- First-bar pickup comparison is available inside adjacent-bar source review and for a single collected bar. It shows the first staff, source inspection where a navigation callback/reference is available, selectable comparison tempo and full versus shortened timing excluding count-in. Selecting a silent-slot offset requires an explicit source check; silent bars and bars starting with a strike offer no shortened candidate. Bar/reference changes clear confirmation/offset, including changes later reverted. Staged passages now supply source/page/crop metadata to continuity comparison.
- Comparison does not mutate bars, source provenance, saved pickupOffset, final-send verification or playback. After sending, explicitly choose the verified offset in the chart editor only when that passage is the chart’s first bar. Appending later bars does not establish a chart pickup. Native shortened staff notation and automatic pickup detection remain outside this phase.
- Validation: 418 unit tests across 115 files and production build pass. Source report gates the new dense value/symbol/group checks and shared-stem pairs alongside all established suites. Explicit-file lint retains twelve nonblocking React warnings; build retains the shared static/dynamic PDF renderer-import notice. Browser and physical-audio checks remain manual. No new packages, workflows, schema migrations, external uploads or deployment.


### v0.10.36 delivered — combined Recognition and evidence review (2026-11-19)
- Incorporates the five proposed recognition/evidence phases 36–40 into one upload after complete v0.10.35. There are no separate v0.10.37–v0.10.40 phase uploads in this bundle. The next proposed actual release v0.10.37 is the remaining five workflow phases 41–45.
- Pickup test timeout: the reported combined playback/loop test passed locally in approximately 2.3 seconds of test execution, but its setup repeatedly queried the entire editor grid and cycled many notes through three clicks. Replaced that setup with a valid saved pickup-chart fixture and split one-second completion and repeated one-second cycles into independent tests. The two revised tests initially completed in approximately one second combined here, without increasing the default five-second timeout or changing playback behavior. Final full suite and single-worker focused check pass. A slower CI host can differ; no global timeout increase was introduced.
- Flags: adds a bounded connected-curve check extending beyond the former short scan. It requires attached ink, excludes head/under-head accents and staff-line paths, and only supplies one/two flags when existing beam/flag checks found none. It recovers two 108-DPI double-flag values in the newly labelled source. It never replaces established beam bands or an existing flag count; disagreement instead provides review guidance. Broader replacement regressed known values and is excluded from the delivered implementation.
- Beam context: connected and interrupted paths are separate. Sloped paths are checked in both directions; long gaps are rejected, small interrupted paths offer source comparison only and never copy durations. Navigator can compare interrupted beams. Shared-stem duration differences and rendering/flag-evidence warnings appear in Needs review and the new Evidence review summary. Selection, voice mapping and manual durations remain independent.
- Cymbal guidance: a source-key checklist separates rings around crosses, separate articulation circles, ledger strokes and top-line center positions. No matching legend means identity remains unreviewed or excluded. Added labelled circled/plain crosses from Baba O’Riley alongside the established China/source-key cases; no instrument identity is inferred for this score without a legend. Existing identity/source confirmation rules remain in effect.
- Source benchmarks: independently labelled Baba O’Riley intro flags/sloped beams and bar 28 mixed/dotted/cymbal rhythm comprise 21 source heads rendered at 72/108/144/216 DPI: 70/84 expected duration-hint outcomes versus v0.10.35’s 68/84, 84/84 shape/ring checks. Dotted eighths intentionally remain unknown in straight-value hints. Four intentionally clipped crop variants add 32/32 clipped-stem abstentions. These repeat source heads/crops at scales, not independent musical examples. Every remaining wrong duration/evidence hint is listed in MIXED_SOURCE_FAILURES.md and the JSON report.
- Benchmark baseline stores the measured v0.10.35 outputs against independent source labels. Gates prevent any formerly correct value/evidence/symbol case from regressing, require the labelled improvement, verify dotted/clipped abstentions and preserve the established suites: 64/64 dense durations/context, zero cross-group links; 12/12 shared-stem pairs; 48/48 small-scale values/evidence; 36/36 existing mixed values/evidence; all publisher/key/first-groove/Highway checks pass. Known-coordinate benchmarks do not establish general head detection or universal instrument confidence.
- Validation: production build and 428 unit tests across 120 files pass. Tests cover detached-curve/accent rejection, sloped/interrupted/staff-line paths, source-baseline regression, dotted/clipped crops, shared-stem warning independence, summary selection independence and source-key guidance. Twelve existing nonblocking React lint warnings and the shared PDF renderer-import build notice remain. Browser and physical-audio checks remain manual. No packages, workflows, schema migration, external upload or deployment changes.


### v0.10.37 delivered — combined Review and chart workflow (2026-11-20)
- Combines the remaining five proposed workflow phases 41–45 into one actual release after complete v0.10.36. No separate intervening phase uploads.
- Source-verified pickup comparison can travel with a staged passage or ordered collection. Its offset is tied to the current first-bar notes, source filename, page and crop. Changes or restored history clear verification. Create new chart from reviewed draft uses only this reviewed material and applies the verified first-bar offset; source anchors/crops and page provenance are retained. Appending a passage preserves the existing chart pickup. Malformed/stale offsets are rejected; no automatic pickup detection is added.
- New chart creation and append enter a validated Undo/Redo history path. This prevents the old structural-edit orphan protection from detaching valid internal ties in newly added passages; edited/deleted old boundaries keep the existing protection. New chart creation can be undone before saving. Saving/loading/importing still starts a new chart edit history.
- Playback workflow: selected-section summary shows beats, per-cycle duration, first played slot and separate one-time count-in. Later sections use full-bar timing, even when the chart begins with a pickup. Grid count labels now follow the selected Quarter/Eighth/Sixteenth mode; all underlying notes/slots remain available. Chart correction summary lists current per-bar review status, grid/reviewed duration mode, original source page and retained crops. These are review aids, not measured accuracy.
- Collection history retains up to twenty edits within a four-million-character budget per past/future side: source sections, ordering/removal, and reviewed duration/voice/tie changes. Candidate review-session strings and section boundary recovery data remain with their sections. Save ordered collection includes bounded history; oldest past/farthest future entries are trimmed if the eight-million-character export limit requires it. Restore validates every state against the selected local PDF, retains original metadata and clears source/pickup confirmation. Undo/Redo always requires final source recheck. Late recovery responses are discarded after edits or file changes.
- Passage snapshots retain up to twenty boundary-plan history entries. Undo/Redo restores uneven boundary plans but clears staged source verification; split and review bars again. Saved candidate sessions/bar copies remain available through explicit snapshot/section recovery. This does not add individual identity-correction Undo to the candidate panel; its existing correction log/session recovery and duration-event Undo remain.
- Collection validation identifies source/meter mismatches, unsupported bar data, voice gaps/overlaps/overflow and orphan incoming ties. First-bar pickup review remains available for a single collected bar. Source references and interpretation remain separately reviewable; collection/source/candidate recoveries remain local JSON, not PDF backups.
- Validation: 441 unit tests across 124 files and production build pass. New end-to-end checks cover collection → verified pickup → new chart → Undo/Redo → save, with anchor/crop retention. Further checks cover JSON timing, append offset isolation, internal ties, bounded history/recovery, cleared verification, late async recovery rejection, boundary-plan Undo and count-label independence. Lint retains twelve existing nonblocking React warnings; the shared PDF renderer-import build notice remains. Browser and physical-audio checks remain manual.
- Recognition behavior is unchanged: new mixed-source values remain 70/84 versus the earlier 68/84 baseline, 84/84 source shapes, and 32/32 clipped abstentions. Dense 64/64, shared-stem 12/12, small-scale 48/48 and all established suites remain passing. Known-coordinate source benchmarks do not establish universal recognition confidence; v0.10.36’s listed thin-flag/partial-beam errors remain.
- No new packages, workflows, chart-schema migration, external upload or deployment. Schema-1 chart pickupOffset remains compatible; reviewed pickup transfer and optional collection/boundary history are transient/recovery metadata. Old charts and version-1 recovery files remain supported.


### v0.10.38 delivered — targeted recognition fixes and recovery sizing (2026-11-20)
- Filled-oval stem tracing now permits only one missing pixel beyond the head footprint. This prevents a stem from jumping a two-pixel gap into a boxed section label below it. Cross-head attachment keeps its former gap allowance. Recovers two false quarter-to-eighth hints in the 72/108-DPI Baba bar-28 crop. Real disconnected/damaged stems can still require manual review; this is not a universal duration guarantee.
- At staff spacing below seven pixels, a secondary beam can occupy rows otherwise excluded as staff-line ink. A supplementary check requires an already detected primary beam and exactly two separated attached bands with at least two dark rows each. A single thin staff row cannot supply a second beam. Recovers five 72-DPI partial/double-beam duration hints while retaining established source checks.
- Connected-curve tracing uses bounded narrow faint-ink support below ten-pixel spacing, excluding broad gray backgrounds. It recovers the previously missed 108-DPI eighth flag. Existing beam/flag values are not overwritten by this fallback; disputed double-flag evidence remains manual.
- Mixed-source result improves from v0.10.37’s 70/84 to 78/84 expected duration-hint outcomes, versus the original 68/84 baseline. All 84 source shape/ring checks pass and no formerly correct labelled outcomes regress. Four clipped crop variants remain 32/32 unknown. This reuses 21 visually labelled heads at four scales, not 84 independent examples. Six wrong duration values and one additional beam/flag-kind mismatch remain explicitly listed in MIXED_SOURCE_FAILURES.md. No cymbal identity is claimed without a source legend.
- Established suites remain passing: dense 64/64 values/context with no cross-group links, shared-stem 12/12 pairs, small-scale 48/48 values/evidence, existing mixed 36/36, and all publisher/key/Highway/first-groove checks. Benchmark gates now require at least 78/84 on the mixed source set, plus all existing regression and clipped/dotted checks.
- Workflow hardening: ordered collection export now measures actual UTF-8 file bytes, rather than JavaScript string length, before applying the eight-million-byte import limit. Current sections take priority; oldest past/farthest future history is trimmed as needed. A collection that cannot fit without losing current sections rejects export. This prevents Unicode recovery text from producing a file that the existing import-size gate refuses. Version-1 snapshots, source checks and cleared recovery verification remain compatible.
- Validation: 445 unit tests across 125 files and production build pass. New regressions cover labelled staff-overlap beams, section-label contamination, narrow faint curves versus broad gray blocks, thin staff-line negative evidence and UTF-8 recovery export/import. Lint retains twelve existing nonblocking React warnings; shared PDF renderer-import notice remains. Browser and physical-audio checks remain manual. No packages, workflows, schema migration, external upload or deployment changes.


### v0.10.39 delivered — corroborated double flags and disagreement review (2026-11-20)
- Connected-curve tracing can bridge thin excluded staff rows with bounded horizontal movement, so a diagonal flag crossing a staff line is not disconnected by a same-column-only bridge. Ink on staff rows is still excluded; no arbitrary background path is added. This recovers the labelled 72-DPI eighth flag.
- Curve inspection now reports maximum ray bands and a separate corroborated two-flag count. Two flags require agreement across consecutive sampling columns, scaled to staff spacing. Below ten-pixel staff spacing each band keeps a two-row support requirement; larger renders permit thinner supported bands. The 216-DPI single eighth has a two-band ray outlier but no adjacent-column corroboration and retains Eighth.
- Corroborated two-flag curves can correct a weaker local one-beam/one-flag result, while established two-beam results remain unchanged. Recovers both 144-DPI and both 216-DPI double-flag values. Low-resolution fallback and clipped/dotted priorities remain intact. This is a bounded local interpretation, not general recognition confidence.
- Candidate review displays the independent local beam, short flag, connected curve and corroborated counts. Overlapping beam/curve evidence and different flag counts receive actionable source-review guidance. Manual duration choices remain separate and are never rewritten by review guidance. Source reports retain these separate measurements for inspection.
- Mixed-source expected duration outcomes improve from 78/84 to 83/84, versus the original 68/84 baseline. Five more values are recovered. All 108/144/216-DPI expected values pass in this labelled set. One 72-DPI double flag remains Eighth instead of Sixteenth; another 72-DPI double flag has the correct Sixteenth value but is still classified as beam evidence. Both are explicit in MIXED_SOURCE_FAILURES.md. Instrument identity is withheld without a source legend. Twenty-one source heads are repeated at four scales, not 84 independent examples.
- All 84 source shape/ring checks and 32 clipped-stem abstentions pass. Established suites remain passing: dense 64/64 values/context with no cross-group links, shared-stem 12/12, small-scale 48/48, existing mixed 36/36, and publisher/key/Highway/first-groove cases. New gates require at least 83/84, correct labelled single flags and high-resolution double flags, and all existing regressions. Known-coordinate results do not establish universal detection or instrument accuracy.
- Validation: 449 unit tests across 125 files and production build pass. Tests include corroborated double curves, the real single-flag ray outlier, high-resolution source branches, manual-duration independence and existing detached/accent/gray-background negatives. Lint retains twelve nonblocking React warnings; the shared PDF renderer-import build notice remains. Browser and physical-audio checks remain manual. No package, workflow, schema, external-upload or deployment changes.


### v0.10.40 delivered — five combined implementation scopes (2026-11-20)
- Combines the proposed v0.10.40–v0.10.44 scopes into one actual release after complete v0.10.39: low-resolution evidence/source validation; dense head detection; source-key cymbal review; dotted/rest/tie corrections; final checklist and end-to-end regressions. No separate intervening uploads.
- Low-resolution flags: a single resolved curved band below seven-pixel staff spacing receives explicit guidance to compare a clearer/larger source before assuming no second branch. Existing mixed durations remain 83/84; one 72-DPI double-flag value and one evidence-kind mismatch are unresolved, not silently declared fixed. Clipped/dotted priorities and all existing flag/beam regressions remain.
- Dense passage head scan is opt-in. Neighbouring head ink is no longer treated as long horizontal support unless it joins immediately outside the template. Small staff spacing can use two useful head rows, a higher oval score threshold reduces weak accents, and close equal-score shoulders are consolidated without globally changing standard mode. Generic dense scans use the selected head tolerance. Scan changes clear candidates/confirmation; saved source sessions retain the mode. Existing eighteen-field scan settings stay compatible; only dense mode adds a validated nineteenth field.
- Automatic head recovery is benchmarked separately from musical-value hints. Reused dense/mixed/publisher cohorts: dense mode recovers 160/160 labelled heads versus standard 112/160. Dense mode also retains 121 unmatched candidates across those crops; these are not asserted true heads or established false positives. Full recovery is not full precision. Default/standard scan behavior and established first-groove checks remain unchanged.
- Added independently visually labelled Feel Good Inc page-1 intro groove (Will Beavis / Wills Drum Lessons): eight crossed and four simultaneous oval heads, rendered at 72/108/144/216 DPI. Head recovery is 47/48 (one 72-DPI cross remains missed), with 12/12 at each larger scale; known-coordinate duration/evidence/symbol checks are 48/48. Twelve heads repeat at four scales, not 48 independent examples. Instrument identity is withheld without an accompanying source legend.
- Cymbal review: supplied Drum Key types.pdf label/position examples distinguish Hi-hat, Ride, Crash and China within that key only. Nearby cymbals from the current scan can be pinned for comparison and remain explicitly unverified. Identity verification can retain the user’s source-reference text; changing legend notes clears identity confirmation and source draft confirmation. Mapping/rescanning/session restoration still clears verification. No universal cymbal assignment is added.
- Rhythm source audit compares reviewed event durations with candidate hints, possible dots and rest/note provenance, and explains within/cross-bar tie continuation or orphan ties. It preserves manual choices and does not replace coverage/overflow/source gates. Available in PDF duration review and chart reviewed-bar editing. Editor event IDs are scoped per component, so diagnostic navigation among simultaneous bar previews focuses the correct bar.
- Final chart review checklist shows per-bar source status, duration mode, dotted events, continuations and pickup timing, with explicit navigation that never marks a bar reviewed. Existing source/section/count-in/loop checks remain.
- End-to-end regression uses real detected source heads followed by deliberate user mapping/onset/rest correction, source-session recovery, anchor attachment, new-chart creation, ties, meter split/join and JSON. Existing collection/pickup/save/playback tests remain. Additional tests cover dense/default head modes, old/new session settings, changed-legend verification, dotted/rest/tie guidance, scoped editor navigation and checklist independence.
- Validation: 460 unit tests across 130 files and production build pass. All established source suites remain passing: mixed 83/84 with no original-correct regressions; source shapes 84/84; clipped 32/32; dense values/context 64/64; shared-stem 12/12; small-scale values/evidence 48/48; publisher/key/Highway/first-groove cases. Explicit-file lint retains twelve existing nonblocking React warnings and build retains the shared PDF renderer-import notice. Browser and physical-audio checks remain manual. No package/workflow/chart-schema changes, external uploads or deployment.


### v0.10.41 delivered (2026-11-23)
- Dense oval shoulder consolidation reduces unmatched candidates from 121 to 112 while preserving 160/160 labelled heads; standard mode remains unchanged. Unmatched ink still requires manual review.
- Higher-detail PDF rendering clears analysis and preserves optional renderZoom in source crops and passage references. Recovery restores saved render quality; legacy crops default to standard. Crop dimensions and downsampling guidance are shown. Source images cannot gain missing ink by magnification.
- Independent automatic-head-position duration validation is now reported separately: Feel Good intro 44/48 duration values versus 48/48 at labelled coordinates; head recovery 47/48. Existing mixed-source duration 83/84 and evidence-kind discrepancy remain unresolved. No new independently labelled source examples are claimed.
- Includes the previously delivered dense/mixed/publisher/intro fixture dependencies to repair CI missing realDenseSourceFixtures imports. Upload these alongside changed tests; do not remove benchmark coverage.
- 463 tests across 130 files and production build pass. Browser/rendering and physical-audio verification remain manual. No external deployment or package/workflow changes.


### v0.10.42 combined recognition and source-validation release (2026-11-23)
- Combines bounded attachment recovery, low-resolution ambiguity guidance, automatic-position validation and new mixed-passage source benchmarks in one upload after v0.10.41.
- Stem search retains its original attachment range first. Only unresolved short stems receive a bounded wider search; existing resolved geometry remains unchanged. A recovered stem receives explicit manual-review guidance. Intro automatic-position durations improve 44/48 to 45/48, including the displaced 216-DPI oval. Two displaced 108-DPI crosses and one missed 72-DPI head remain.
- Review reasons explain missing continuous stems and uncorroborated two-ray curve counts, including the risk of a single flag appearing as two bands. These messages do not confirm candidates or overwrite manual durations.
- New independently visually labelled Feel Good Inc page-1 bar-36 crop includes four quarter-note heads, three beamed eighth heads and two single-flag eighth heads; instrument identity withheld. Nine physical heads rendered at four scales produce 36 scale checks, not 36 independent heads. The eighth rest is excluded from head references. Local source PNGs are review artifacts only.
- New passage: automatic heads 35/36; duration values 34/36 at both labelled and detected positions. Known-coordinate misses are the shared-stem single flag at 108 DPI; automatic-position failures are one missed 72-DPI cross and one 108-DPI single flag overcount. This validation exposes errors rather than asserting complete accuracy.
- Existing cohorts preserved: dense heads 160/160, unmatched112; mixed durations83/84; all established dense/shared/small/publisher/groove suites pass. Original low-resolution double-flag and evidence-kind discrepancies remain unresolved.
- Validation: 466 unit tests across 131 files and production build pass. Explicit-file lint retains existing nonblocking React warnings. Browser and physical audio checks remain manual. No package/workflow changes or external deployment.


### v0.10.43 screenshot timing correction (2026-11-23)
- Prioritizes the four supplied module screenshots: eight detected cymbal heads plus two snare and two kick heads became a five-cymbal, off-grid draft because crop-edge guides were interpreted as onset centers and unaligned checked heads were filtered out. Short-note/rest display then correctly reflected the incorrect draft. No automatic instrument-identity accuracy is claimed.
- New explicit Build regular eighth onset preview groups checked simultaneous source heads into eight regular columns and maps them to slots0,2,4,6,8,10,12,14. The screenshot pattern retains all12 strokes; quarter/sixteenth and2/4 variants use the corresponding expected column count. This is a user-selected regular-onset assumption, not duration recognition.
- Clustering uses a staff-scaled bound, requires a complete expected column count and regular-enough spacing, and rejects duplicate same-voice heads rather than merging them silently. Rests, pickups and mixed rhythms still need manual duration/onset review. Original physical source coordinates are retained. Confirmation resets when building the new preview; transfer remains explicit and gated by source/identity/region checks.
- Existing guide-based preview now blocks when any checked candidate would be lost to slot alignment. Fit onset guides or use regular/manual mapping before previewing.
- Tests reproduce the twelve-head screenshot pattern, verify eighth staff symbols retain all onsets, reject missing/duplicate/uneven columns, cover2/4 and unchanged source coordinates, and exercise preview/confirmation/transfer in the component.
- Validation:470 unit tests across132 files and production build pass. Existing nonblocking lint warnings remain. Browser and physical audio checks remain manual. No package/workflow changes or external deployment. Previously proposed flag discrimination/cross-centering research remains pending; this release addresses the reported conversion failure.


### v0.10.44 delivered — combines proposed phases 44–46 (2026-11-23)
- One release after complete v0.10.43 combines displaced cross-head/flag corrections, editable uneven-spacing onset columns, and detected/reviewed/chart comparison. Proposed phases45/46 are included, not separate releases.
- Dense-scan cross refinement searches nearby centers only when bilateral diagonal support improves strongly, ignores staff-line paths, and retains already supported centers. Default/standard recognition remains unchanged. Both displaced108-DPI Feel Good intro crosses now supply correct duration evidence: automatic-position durations45/48 →47/48, matching47 recovered heads. The72-DPI missed intro head remains. Reused dense/mixed/publisher head references remain160/160, unmatched candidates112 →106; unmatched ink is still not claimed proven false or accepted.
- Isolated single flags can split into two ray bands at the outer curve tip. A continuous single inner run plus one outer double ray returning to a single ray is treated as a split tip only when recovering a curve without established local beam/flag evidence. A true inner second branch is retained. New Feel Good mixed passage known-coordinate durations34/36 →36/36; automatically recovered durations34/36 →35/36, matching35 recovered heads. Original Baba mixed83/84 duration and one evidence-kind discrepancy remain unresolved. Hints remain tentative; manual duration choices are not overwritten.
- Edit source onset columns in duration-aware review: staff-scaled spatial groups initialize simultaneous heads, each column has an editable slot, and individual heads can be separated or columns merged. Apply uses every checked head exactly once and rejects same-voice onset merging. Mixed engraving, rests and pickups can be assigned explicitly rather than forced to regular spacing. Applying moves current reviewed events while retaining duration/dynamic/rest/tie/source metadata; same-candidate tie segments preserve relative offsets, with out-of-bar moves rejected. Added candidates use the chosen starting duration or explicit tentative/manual hints.
- Pending column edits prevent reviewed confirmation until applied or discarded. Applied edits enter existing event Undo/Redo and source-session history; unapplied column changes are temporary. Columns follow current reviewed timing when no edits are pending. No new saved-chart/source-session schema. Existing coverage, overflow, identity and source confirmation checks still apply.
- Original crop, complete reviewed staff and draft chart staff are compared side by side. A per-head table shows original source x, assigned/reviewed voice and slot, and draft result. Exact matches are reserved before nearest unmatched same-voice strokes are paired as potentially shifted hits. Missing, merged and unassigned heads are highlighted; additional strikes and explicit reviewed rests/ties are identified separately. Inspection selects the source candidate without changing the chart or confirming it. Comparison does not infer true PDF timing or automatically repair events. Supports4/4 and2/4 source review.
- Tests cover real cross centers versus detached stem/staff ink, single tip split versus true double flag, uneven/simultaneous column moves, split/merge collisions, pending confirmation, retained durations/rests/ties, existing session recovery, comparison matching/merges/rests/ties/navigation,2/4 staff comparison, and a real detected-source →manual timing→reviewed chart→anchored JSON regression. Nine source heads in the latter test are deliberately assigned timing; instrument suggestions are not asserted verified identities.
- Recognition changes can change dense-scan candidate coordinates or counts. An older dense source session that no longer matches must be rescanned/reviewed; strict source matching is retained. Existing saved charts/anchors remain compatible.
- Validation:487 unit tests across137 files and production build pass. Existing nonblocking React lint warnings and shared PDF renderer import notice remain. All established source suites stay passing, including dense/shared-stem/small/publisher/groove suites. Browser comparison controls and physical audio remain manual. No package/workflow changes, external upload or deployment.


### v0.10.45 delivered — combines proposed phases47–48 (2026-11-23)
- Shared-stem/beam-group interpretation and broader source/playback validation are combined into one actual release after complete v0.10.44.
- Missing local beam evidence can be recovered through an already confirmed ink path. A continuous shared stem can supply a consistent peer beam count; a horizontal primary beam supplies only a tentative eighth value, never a copied secondary count from a neighbouring mixed-duration note. Local dots, clipping, unresolved stem directions and manually reviewed candidate values are excluded from recovery. Source warnings explain recovered evidence. Broken stems and unconnected groups do not supply duration evidence.
- Shared stems and beam groups review shows checked linked heads, stacked pairs, mixed/unresolved hints and existing reviewed note durations. Keep individual durations is the default. Explicit group-duration actions update source-linked note events only; manual rests, onsets, dynamics, ties and references remain. Such actions enter review history and clear confirmation; existing gap/overlap/overflow/tie/source gates still apply. Nearby ink and group membership do not imply uniform duration or instrument identity.
- Accepted rest hints now use the chosen final onset guide step instead of always mapping the right guide to the final sixteenth slot. Eighth/quarter guide examples end at slots15/13 respectively in4/4, allowing a final eighth/quarter rest to fit correctly before manual verification. Gap filling still assumes silence rather than detecting PDF rests.
- New independently visually labelled Feel Good Inc page-1 final verse bar includes13 physical heads, four beam groups, four vertically stacked pairs, and a short secondary beam across mixed eighth/sixteenth onsets. Four rendering scales72/108/144/216 produce52 repeated-scale head/value checks, not52 independent notes. Both known-coordinate and automatic-position durations52/52; heads52/52 with0 unmatched; all16 repeated-scale shared pairs linked and no cross-group links. Instrument identity is withheld without a source legend.
- Real-rest benchmark labels the separate eighth-rest glyph in the earlier Feel Good mixed bar. Existing rest templates miss it at all four scales(0/4); this limitation is explicitly reported, not counted as manual silence or hidden behind correct note counts. One physical rest repeats at four scales. No general rest OCR improvement is claimed.
- End-to-end playback regressions use real detected verse heads followed by deliberate trial-kit/onset/duration review, rest gap filling, source anchors, chart transfer and saved JSON. Mocked audio scheduling captures all13 source-labelled onsets at their expected offsets; the4/4 bar repeats after4seconds at60BPM, and Stop schedules no further hits. Fractional secondary-beam onsets retain their timing; explicit rest events do not trigger strikes. Animation is simulated with a deterministic test clock; browser/physical audio remains manual.
- Additional tests cover contextual primary/shared-stem recovery versus broken ink, manually reviewed hints, independent mixed group values, explicit group actions/rest/tie retention, confirmation invalidation, real-rest benchmark gaps, and eighth/quarter rest-guide mapping.
- Validation:500 unit tests across143 files and production build pass. Existing source suites stay passing: reused dense heads160/160 with106 unmatched; intro automatic values47/48; earlier mixed automatic35/36 and known36/36; original mixed83/84; all dense/shared/small/publisher/key/groove suites. Original72-DPI head misses and Baba flag/evidence discrepancies remain unresolved. Existing nonblocking React lint warnings and shared PDF renderer import notice remain. No package/workflow/chart-schema changes, external uploads or deployment.


### v0.10.46 delivered — five connected scopes in one release (2026-11-23)
- Combines source-derived rest recognition, editable rest-source review/anchors, low-resolution head recovery, threshold/faint inspection masks, and separate-source plus playback validation after complete v0.10.45. One upload; no package/workflow/chart-schema changes.
- A visually labelled Feel Good Inc bar36 eighth-rest glyph supplies a source-derived shape template. Matching considers expected ink, empty surroundings, staff-row exclusion, nearby noteheads, scaled shape variations and side margins. Generic templates remain available. This is an experimental match, not a probability or general rest OCR. Development-score recovery improves0/4 →4/4 across rendering scales(one physical rest repeated four times).
- Separate Baba intro rest validation labels three eighth-rest glyphs plus a quarter-rest negative for eighth identity. Recovery3/12, at144 DPI only;0 unmatched and0 quarter-to-eighth mislabels in those selected crops. Nine scale cases remain missed. These glyphs were not used to derive the template; no success is claimed across other publishers or fonts. Thirteen physical heads in the separate rest-free verse crop remain free of rest suggestions at all four scales. Blank/broad backgrounds remain rejected.
- Rest source comparison offers original crop inspection, editable onset slot and duration, selected voice, and explicit acceptance. A rest crossing the bar end is blocked before adding. Acceptance retains a normalized physical source anchor when crop provenance is present, without assigning a notehead candidate ID. Existing coverage, source confirmation, history, ties, save/JSON and meter checks remain. Rest hints are not automatically accepted or assigned a voice.
- Dense scans below seven-pixel staff spacing can use narrow faint pixels for cross-diagonal support. Broad faint rows are excluded. Weak cross intersections centered on staff lines are suppressed in this low-resolution mode to prevent the new gray support from adding shoulders/stem intersections. Standard mode remains unchanged. The head benchmark now includes the available faint pixel plane, matching the actual app input.
- Both previously missed72-DPI Feel Good heads recover: intro head/value48/48, mixed head/value36/36. Verse52/52 with0 unmatched remains. Reused dense heads160/160 with106 unmatched and standard112/160 remain unchanged. This is cohort recovery, not full precision or verified instrument identity. Older dense source sessions may require fresh review if the corrected candidate set no longer matches. Saved charts remain compatible.
- Symbol inspection can switch Original source / Selected threshold mask / Faint stroke mask. Masks show which source strokes survive contrast thresholds, not the final full recognition pipeline. They do not rescan, confirm or change durations. Clean source view restores original pixels without overlays.
- Curved-flag sampling correctly treats out-of-crop pixels as zero rather than a truthy object. An edge regression prevents phantom attached curves. The existing Baba72-DPI double-flag value and evidence-kind errors remain unresolved; original mixed duration83/84 remains.
- Tests cover development and separate-source rest results, quarter negatives, rest-free/blank/background negatives, rest preview and explicit anchor/duration/slot acceptance, overflow rejection, contrast-mask immutability, broad faint head rejection, crop-edge flag samples, improved head/value expectations, and a detected real rest through manual timing→chart→mocked playback. The latter preserves nine source note strikes and silence during the printed rest interval; existing verse13-onset/Loop/Stop tests remain.
- Validation:509 tests across145 files and production build pass. Existing source suites remain passing; independent-scale metrics and unresolved rest/flag cases are reported separately. Existing nonblocking React lint warnings and shared PDF renderer import notice remain. Browser inspection controls and physical audio remain manual. No external upload or deployment.

### v1.0.0-rc.4 — combined playback alignment and five improvements (2026-11-27)

- Fixed eighth-mode cursor advancement through silent sixteenths without changing clock/bar length. Named scheduled voices, sounding-cell highlights and an auditable attack list expose hidden/grace events. Grace strokes now respect mute/solo/volume. Reviewed event scheduling remains authoritative.
- Added same-center competing-identity protection, explicit distinct-head selection, difficult-duration alternatives, conversion-issue filtering, labelled/focusable mobile grid and a mobile regression.
- Added Highway complete-bar timing evidence at four scales.232 timing references across20 source cases; six72-DPI durations require explicit review, six unmatched detections remain reported. Existing source guards pass.
- 561 unit tests across161 files, production build and lint with0 errors/32 existing warnings pass. Browser launch blocked by missing libatk runtime; hardware/audio/offline checks remain pending. Complete install/testing details in PLAYBACK_ALIGNMENT.md. One rc4 upload over complete rc3; no dependency additions, workflow or chart-schema changes.
