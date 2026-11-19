# DrumMaster AI Roadmap

## Agreed PDF recognition and conversion sequence

Recognition improvements take priority. PDF-to-MusicXML conversion comes afterward; exporting XML is not a guarantee of transcription accuracy.

### Progress through v0.9.8

- Added efficiency improvements and candidate regressions on four local chart crops.
- Added a focused screenshot test for six filled heads, including below-staff kicks; whole-chart accuracy remains unverified.
- Added dedicated Crash/Ride chart rows, mix controls, playback and compatible legacy-chart handling.
- Broader instrument identification, symbol discrimination and reliable rhythm/rest interpretation remain unfinished.

### Progress through v0.9.9

- Primary repeat scans preserve manual staff geometry; a fresh-pixel detection action bypasses caches.
- Added wider stem/beam inspection with explicitly tentative quarter/eighth/sixteenth labels. These hints do not assign chart timing.
- Improved the distinction between synthesized Crash wash and Ride stick/metallic attack.
- Analyzed the supplied Master Drum Key and recorded drums, cymbal variants, extras, modifiers, section controls and rolls in a collapsed support catalog.

### Master Drum Key expansion backlog

- Separate Bass 1/2, Floor tom 1/2, Tom 1/2/3 and additional toms with dedicated chart rows, sound mapping and saved-chart compatibility.
- Hi-hat foot, Ride bell, Crash 2, Splash and China variants; click sticks, rim, electronic pad, tambourine and cowbell.
- Cross-stick, rimshot, marcato and chart-level flam/drag interpretation alongside existing ghost/accent cells.
- Cymbal tip/bell/choke/let-ring articulations and loose/open/closed/open-close hi-hat states.
- Section-level tension/loosen instructions, open/buzz/crushed rolls and speed/dynamic roll changes.
- Reliable note-value/rest interpretation and duration-aware score rendering remain prerequisites for faithful document conversion.

The reference defines a useful profile, not a universal percussion notation standard; other publishers need their own verified mappings. Next proposed v0.10.0 focuses on additional drum-voice mapping and further rhythm validation, not a production-release claim.

### Next: Recognition validation and improvements

- Use the four local song PDFs as validation samples: Baba O'Riley, Back in Black, Highway to Hell, and Feel Good Inc.
- Establish manually checked reference bars before measuring recognition accuracy.
- Improve staff geometry, cross/circled-cross noteheads, cymbal identification, and publisher-dependent instrument positions.
- Extend validation to durations, rests, dotted rhythms, ties, simultaneous voices, fills, and repeat notation.
- Keep candidates separate from confirmed notes. Flag uncertain or unsupported notation rather than silently guessing.
- Expand beyond the current five chart instruments when recognition and saved-chart compatibility tests are ready; synthesized cymbal sounds are not acoustic samples.
- Keep PDF loading available alongside MusicXML import.

### Later: Reviewed PDF-to-MusicXML workflow

1. Load a PDF locally and select pages or bars.
2. Recognize instruments, notes, rests, and rhythmic durations.
3. Display recognized notation beside the PDF and flag uncertain symbols.
4. Allow manual correction before confirmation.
5. Export reviewed MusicXML or send the reviewed chart to Song Practice.

All processing remains local, with no external file uploads. Preserve the source and saved charts; conversion requires explicit confirmation.

Later conversion version assignments remain provisional until recognition validation establishes readiness.

### v0.10.0 delivered
- Twelve editable/playable kit voices with legacy chart compatibility and strict MusicXML GM mapping tests.
- Opt-in Master Drum Key position profile; generic default unchanged. Publisher-specific mappings must be verified.
- Synthesized tom/second-bass/pedal voices and combined staff support. Additional cymbals, bell/open articulations, cross-stick, rimshot, extras and rolls remain unfinished.
- Next proposed v0.10.1: duration/rest recognition foundations and uncertainty-aware rhythm review. Faithful durations, ties and overlapping voices are prerequisites for reviewed PDF-to-MusicXML conversion.

### v0.10.1 delivered
- Device-level instrument visibility, preserving hidden notes, audio and saved charts.
- Uncertainty-aware rhythm checks for accepted candidates. Empty onset slots are not detected PDF rests; duration hints are not applied automatically.
- Next proposed v0.10.2: manually editable onset placement/duration evidence and real-chart validation. Automatic rest symbols, ties, dots, tuplets and faithful PDF-to-MusicXML conversion remain future work.

### v0.10.6 combined bundle delivered
- Editable reviewed onsets/durations/rests, independent-voice rhythmic coverage checks, duration-aware staff preview and explicit draft confirmation.
- Experimental short-flag/rest templates, with manual correction and limitations stated. Real-PDF accuracy is not established by synthetic fixtures.
- Metadata save/export/import compatibility; grid edits return the edited bar to sixteenth-slot notation.
- Remaining: broader fonts/scans and rest recognition, dotted/whole/half notes, ties, tuplets, beam grouping, repeated sections, articulations and MusicXML duration fidelity.
- Proposed v0.10.7: real-chart benchmark coverage and recognition/review refinement. Faithful reviewed PDF-to-MusicXML export stays later in the roadmap.

### v0.10.7 delivered
- Bulk checked-candidate selection, visible alignment omissions, explicit checked-only draft building and stale-confirmation invalidation.
- Experimental rest-template suppression near accepted heads; real-chart regression suite remains passing, not a recognition accuracy score.
- Next proposed v0.10.8: overlay-to-candidate identification and review navigation, followed by additional manually checked real-chart rest/flag validation.

### v0.10.8 delivered
- Numbered, color-coded overlay controls linked to scrollable candidate rows; Previous/Next/Jump navigation without changing selection or chart data.
- Recognition algorithms and saved chart formats unchanged. Dense crops may overlap number labels; hide numbers and use the list when needed.
- Next proposed v0.10.9: safe review filtering and focused-symbol inspection. Additional manually checked rest/flag real-chart accuracy validation remains pending.

### v0.10.9 delivered
- Candidate filters preserve hidden selections; focused-symbol inspection uses original pixels without altering recognition or chart data.
- Tests cover full checked-candidate draft building even with every selected row hidden by a filter.
- Next proposed v0.10.10: instrument-filtered review and uncertainty usability. Real-chart duration/rest accuracy benchmarking remains pending.

### v0.10.10 delivered
- Read supplied drum notation.docx and drum notation2.docx locally; separate beginner-guide position profile added alongside Master Drum Key and generic.
- Open hi-hat supported in optional row, notation, synthesized sound and MusicXML. Hollow-circle suggestions are tentative; half-open, choke and persistent open/closed section state remain unfinished.
- Optional possible two-bar percussion-clef exclusion; other clefs and publisher variation require review.
- Instrument filters and unknown-duration badges preserve hidden selections.
- Next proposed v0.10.11: open/half-open evidence and manually verified real-chart notation tests. Reliable rests, dotted/tied notes, tuplets and reviewed PDF-to-MusicXML export remain future work.

### v0.10.11 delivered
- Floor-tom mapping/shape calibration, vertical tolerance and cache-safe notehead sizing.
- Broader open-circle evidence search plus tentative half-open annotation; no half-open sound, persistent hat state or automatic choking yet.
- Controlled recovery and existing real-chart regressions pass, but user-specific missed floor-tom bars still require annotated crops to establish accuracy.
- Next proposed v0.10.12: annotated failing-bar regression fixtures and stronger head/stem/text discrimination, maintaining the broader Word-reference roadmap.

### v0.10.12 delivered
- Real feedback screenshot yields a checked one-bar head fixture; below-staff kick/source position calibration and reversible clean-head scoring added.
- Multi-bar warning prevents compressing several measures into one draft. Multi-bar transcription is still unsupported.
- Eleven checked filled heads retained, candidate count reduced 57 to 22 on the one feedback bar; false cymbal/pedal suggestions remain.
- Next v0.10.13 proposal: remaining false positives and beam/dot evidence. Dotted, tied, tuplet and 32nd-note transcription and reliable PDF-to-MusicXML conversion remain future work.

### v0.10.13 delivered
- Instrument Mix follows device instrument visibility without changing notes/mix settings.
- Conservative multi-staff and single-interior-boundary draft blocking; inspection does not imply transcription of all staffs.
- Cross/beam contrast and neighboring suggestion filtering; tentative dot evidence flags unsupported duration.
- Build and 216 unit tests pass. Recognition remains experimental; false candidates and missed heads still require manual review.
- Next proposed v0.10.14: clean source-crop detection benchmarks and more explicit uncertain duration/voice review. Reliable measure parsing, rests, dotted/tied/tuplet/32nd rhythms and reviewed PDF-to-MusicXML conversion remain future work.

### v0.10.14 delivered
- One-to-one checked-head benchmarks separate recovered references, misses and unmatched suggestions. Current source fixture: 13 checked heads recovered, 9 unmatched clean-mode candidates. Not a full notation accuracy benchmark.
- Needs review filter and specific duration/voice/articulation guidance; checked-only review counts. No automatic selection/mapping/playback changes.
- Build and 225 unit tests pass. No new dependencies or detection scoring changes.
- Next proposed v0.10.15: broader clean-source benchmarks and clearer source comparison before further scoring changes. Reliable PDF-to-MusicXML conversion remains deferred pending faithful rhythm and measure recognition.

### v0.10.15 delivered
- Clean-source/outline toggle, wider original-pixel context and aspect-ratio-preserving focused inspection.
- Four fully labelled synthetic scale/skew head-recovery regressions and expanded local benchmark report. These do not establish real PDF notation accuracy.
- No detection/audio/schema/dependency changes. Build and 232 tests pass.
- Next proposed v0.10.16: uncertainty-group review efficiency and source-position validation. Broader verified real-source benchmarks, measure parsing, faithful dotted/tied/tuplet/32nd transcription and reviewed PDF-to-MusicXML conversion remain pending.

### v0.10.16 delivered
- Actionable per-candidate manual duration controls and uncertain-review shortcut; source staff offsets for manual position validation.
- Discount likely stem boundary hints and allow explicitly verified false-region recovery. Heuristics do not replace real measure parsing.
- Build blockers explained; manual changes invalidate stale draft/duration review state. Direct grid drafts remain onset-only; duration metadata requires confirming the duration-aware reviewed bar.
- Build and 236 tests pass. Unsupported dotted/tied/tuplet/32nd durations remain cautions, not automatically resolved.
- Next proposed v0.10.17: more specific duration-aware gap/overlap diagnostics and faster event correction. Broader verified source crops and reliable PDF-to-MusicXML conversion remain pending.

### v0.10.17 delivered
- Per-voice gap/overlap ranges, event-level bar-end diagnostics and jump-to-correction controls.
- Instrument correction, non-destructive event filtering and explicit first-gap manual rest filling with capacity protection.
- No automatic overlap correction or PDF-rest recognition claim. Existing confirmation and draft invalidation remain mandatory.
- Build and 244 unit tests pass; no runtime packages, chart schema or workflow changes.
- Next proposed v0.10.18: undo/redo for duration-aware review without restoring stale confirmation. Broader verified real-source recognition and reviewed PDF-to-MusicXML conversion remain future work.

### v0.10.18 delivered
- Undo/Redo for up to 50 duration-review event edits, including bulk initialization/gap fills and removals.
- Restores events without restoring source confirmation/drafts; history navigation invalidates the previous review. New edits clear redo.
- Existing source/candidate changes remount and reset history; no persistence or schema changes.
- Build and 251 unit tests pass. Browser/mobile checks remain manual.
- Next proposed v0.10.19: source-to-reviewed-event traceability and comparison. Faithful measure parsing, rests, dotted/tied/tuplet/32nd recognition and reviewed PDF-to-MusicXML conversion remain pending.

### v0.10.19 delivered
- PDF reselection and current-page rendering reset without modifying chart notes.
- Tentative crossed-ledger cymbal hints with explicit manual Crash mapping; staff crossed-ledger/circled Crash styles.
- Display-only quarter/eighth/sixteenth count-label choices. Actual 2/4 meter remains unsupported, not silently relabelled.
- Temporary initialized-event source references survive review edits/history and are stripped from saved reviewed bars.
- Build and 259 tests pass; no runtime dependencies/workflow changes.
- Next proposed v0.10.20: coordinated 2/4 and 4/4 meter-aware chart data, notation and playback with backwards compatibility (clarification requested). Reliable multi-bar PDF transcription, dotted/tied/tuplet/32nd rhythms and reviewed PDF-to-MusicXML conversion remain pending.

### v0.10.20 delivered (2026-11-13)
- Crossed-ledger candidate rescue; grid symbol grouping controls wired through renderer.
- Coordinated 2/4 and 4/4 chart storage, validation, notation and playback with safe split/join conversion.
- Legacy save compatibility and 268 passing unit tests. Recognition remains experimental.
### Next proposed v0.10.21
- Extend PDF duration review/draft construction and MusicXML import to 2/4; explicit meter selection without silently dropping events.
- Continue source-specific cymbal/head recognition benchmarking; reviewed corrections remain required. PDF-to-MusicXML conversion remains on the longer-term roadmap, not yet delivered.

### v0.10.21 delivered (2026-11-16)
- Eighth-count draft previews and participating-instrument filtering for grid and reviewed notation.
- Explicit 2/4 PDF source review, meter-aware diagnostics/rest correction and guarded draft append.
- Uniform 2/4 MusicXML import with inherited attributes and incomplete/mixed-meter rejection.
- 274 passing tests; no CI/dependency changes. Source spacing and identity still require manual verification. MusicXML import stores onset grid, not complete source engraving.
### Next proposed v0.10.22
- Benchmark cymbal/head distinction and improve confidence/manual duration guidance.
- Continue robust recognition and reviewed editing before the eventual reviewed PDF-to-MusicXML conversion workflow.


### v0.10.22 delivered (2026-11-17)
- Added eighth/quarter/sixteenth source onset guides. Eighth guides map eight hits to slots 1,3,5,7,9,11,13,15 rather than stretching the last onset to slot 16; the sixteenth editing grid is retained.
- Expanded analysis crops with 35% vertical context above/below and a small horizontal margin, clipped to the page. Original selected crop exports remain unchanged. Verify guides in the expanded scan.
- Added above-line/on-line/ambiguous cymbal position evidence in supplied key profiles. Cross centers ignore staff ink; Hi-hat heads that touch the top line are distinguished from centered Ride heads. Generic mapping remains manually verified.
- Eighth staff defaults and controlled editor count selection now drive playback status labels immediately. Silent intermediate slots remain timed and highlighted. Count-in remains its separate preparation setting; note onset timing is unchanged. Corrected 2/4 practice-history boundaries to use actual bar slot count.
- Review initialization starts with an explicit eighth-duration assumption; tentative hints are opt-in, and manual candidate durations take priority. Existing reviewed durations are retained. Added flag/beam and separate evidence guidance.
- Controlled benchmark: 48/48 labelled cymbal heads recovered in 12 cases (scale 1/2, skew 0/+2/-2 degrees, Hi-hat centers at -0.5/-0.25 staff spaces). This is synthetic key-profile coverage, not real-PDF instrument accuracy. Existing local chart regressions pass.
- Build and 291 unit tests pass. Explicit changed-source lint passes. Browser tests could not launch due to missing system libraries; dependency installation requires administrator access unavailable to this account. Physical audio/source checks remain manual.
- No dependency, chart schema or CI changes.

### Next proposed v0.10.23
- Validate cymbal and duration recognition against manually labelled real source crops; improve beam/flag distinction and source review comparison before broader PDF transcription.
- Dots, ties, tuplets and reviewed PDF-to-MusicXML export remain pending.


### v0.10.23 delivered (2026-11-17)
- Added manually labelled real-source validation: five supported cymbal heads from the supplied Master Drum Key PDF and three crossed-ledger Crash heads from the original feedback score crop. Circled/unsupported cymbal identities are excluded, not guessed as truth.
- Corrected cross-center fitting for thin 45-degree engraving as well as flatter crosses. Improved short isolated-ledger support to retain the real key's Crash glyph without treating extended beams as ledgers.
- Beam hints track local slopes and count thick/occluded bands; short separated flag clusters are counted for both stem directions. Beam and flag evidence are shown separately in candidate review.
- Connected-component dot evidence retains the visibly dotted source note as unknown. Stems reaching the crop edge remain unknown with guidance to expand the scan.
- Local validation: 8/8 labelled real-source cymbal identities recovered; 11/11 source duration checks pass (nine sixteenths, one quarter, one unsupported dotted-note safeguard). Recorded v0.10.22 baseline recovered 6/8 cymbals and 6/9 double-beam durations, and mislabeled the dotted note straight eighth. These are partial local checks, not full-PDF accuracy or complete transcription.
- Build and 298 unit tests pass, including existing real-chart regressions and all twelve controlled cymbal cases. Browser/physical-audio verification remains manual because the environment lacks Chromium system libraries. No packages, schema or workflow changes.

### Next proposed v0.10.24
- Improve ambiguous/circled cymbal review and beam-context previews; expand labelled real-source coverage before broader recognition changes.
- Dots, ties, tuplets, full-song PDF transcription and reviewed PDF-to-MusicXML export remain pending.


### v0.10.24 delivered (2026-11-17)
- Added ring-around-head evidence and explicit review controls for circled, ambiguous and crossed-ledger cymbal candidates. Circled heads are not interpreted as open-hi-hat markers above a note. China/other unsupported identities remain manual and should be left unchecked if no supported voice matches.
- Added Cymbal heads filter and inspection/voice-mapping shortcuts. Filtering preserves hidden selections. Mapping only changes the suggestion, resets draft/confirmation through the existing flow and now labels the manual mapping clearly.
- Added Beam context preview with wider neighboring context, separate beam/flag readout and optional amber duration-window/stem overlay. Clean source view hides every overlay. Original source pixels and reviewed values remain unchanged.
- Corrected preview bounds and scan overlays to project all four hint corners through source skew, rather than shifting the entire window at one x coordinate. Temporary hint metadata now includes detected stem x/end positions.
- Expanded labelled local-source cases with the supplied key's circled China symbol and another original feedback score bar. Benchmark: 10/10 supported cymbal references, 14/14 duration cases and 2/2 circled-symbol references requiring manual identity review. This is partial local coverage, not general recognition accuracy or full-song transcription.
- Build and 308 unit tests pass; changed-source lint passes. Browser/physical-audio checks remain manual due to unavailable browser system libraries. No package, persisted schema or CI changes.

### Next proposed v0.10.25
- Add manual cymbal identity review tracking and focused-preview comparison for ambiguous source symbols, with additional real-source validation.
- Dedicated China/Ride-bell/Splash voices, dots/ties/tuplets, full-song PDF transcription and reviewed PDF-to-MusicXML export remain pending.


### v0.10.25 delivered (2026-11-17)
- Added per-scan cymbal identity review records: unreviewed, verified as current voice, or unsupported/excluded. Voice mapping clears verification. Rescanning/source changes clear records. Review status is independent of acceptance and durations and is not saved in chart data.
- Checked circled/ambiguous heads require explicit identity verification before grid draft construction or duration-reviewed confirmation. Unsupported candidates are unchecked and disabled, including Select all. Ordinary unflagged heads retain existing general source confirmation.
- Identity-review changes preserve duration events but clear confirmation/drafts. Mapping still resets review as before. Verified identity removes resolved identity warnings while separate duration/articulation warnings remain.
- Added pinned focused-source comparison using candidates from the current scan, including filtered candidates. Paired previews share clean/wide/beam controls without copying acceptance, mapping, identity records or durations. Each panel fits its own source bounds. Pins reset with source/scan changes.
- Fixed incomplete propagation of onset-guide spacing into draft construction and rhythm diagnostics. Eight eighth-guide hits now remain at grid steps 0,2,4,6,8,10,12,14 in the sent draft.
- Added original fourth feedback score crop: two Crash references and dotted-eighth, beamed-sixteenth and quarter duration cases. Local benchmark: 12/12 supported cymbal references, 17/17 duration cases, 2/2 circled-symbol review references. Partial local coverage, not general recognition accuracy.
- Build and 317 unit tests pass. Browser and physical-audio checks remain manual because required browser system libraries are unavailable. No package, persisted chart schema or workflow changes.

### Next proposed v0.10.26
- Add explicit source-legend reference notes and a review summary for checked candidates; broaden labelled sources beyond the current feedback score/key before further automatic recognition changes.
- Persistent source review history, dedicated unsupported cymbal voices, dots/ties/tuplets and reviewed PDF-to-MusicXML export remain pending.


### v0.10.26 combined release (2026-11-17)
- Incorporates the five proposals formerly planned as v0.10.26–v0.10.30 into one release.
- Source legend reference notes, checked-candidate review totals, local JSON source-review save/restore. Restore requires matching crop pixels, source/page, scan settings and candidate geometry, restores mapping/selection/duration edits, and clears identity and source confirmations. Sessions are separate from chart saves and require the original crop to be loaded and scanned first.
- Dedicated China, Splash and Ride bell rows for editing, staff notation, mix/playback, JSON and GM MusicXML imports. Distinct synthetic sounds; no automatic symbol identity claim. Their manual mapping requires identity verification before PDF draft confirmation.
- Reviewed dotted eighth (3 slots), dotted quarter (6 slots), and ties between adjacent same-voice notes within a bar. Tied continuations render heads/curves but do not trigger a second drum strike. Invalid ties, gaps, overlaps and overflows cannot confirm/export. Ties across bar/meter split boundaries remain unsupported and are rejected.
- MusicXML export from source-confirmed bar review and from complete reviewed chart bars; grid-only bars cannot export guessed durations. XML uses separate GM instruments/voices, dots, ties, rests, accents/ghost heads, meter and tempo. Import retains supported complete per-voice reviewed metadata and tied onset suppression.
- Added visually labelled Ride bell, Splash and China key crops for manual identity-policy and export/import checks. Added clean lower system from 2 musical charts.png with circled/plain-cross and dotted-eighth/sixteenth source evidence; unknown cymbal identity remains withheld without a legend.
- Validation: 326 unit tests across 88 files and production build pass. Original source benchmark remains 12/12 cymbal identities, 17/17 durations and 2/2 circled-symbol cases, with four additional focused source-evidence checks and three separate manual identity cases. Partial local coverage, not general recognition accuracy.
- No package/workflow changes. Saved event data extends schema 1 with dotted durations and optional tieFromPrevious; legacy charts remain readable. Browser and physical-audio checks remain manual due to missing browser system libraries.

### Next proposed v0.10.27
- Cross-bar tie review and conversion, source-session usability, and broader publisher-labelled source validation. Tuplets and automatic full-song PDF transcription remain later work.


### v0.10.27 delivered (2026-11-17)
- Cross-bar tie review now validates the preceding reviewed bar, using the existing tieFromPrevious field. The chart editor offers explicit source-verified boundary-tie controls and a previous-bar comparison. Incoming/outgoing arcs and tied grid markers distinguish continuations from rests.
- 4/4 → 2/4 conversion splits crossing reviewed durations into supported fragments, ties note continuations and leaves rest fragments silent. Joining preserves ties and fills explicitly absent voices with rests. Onsets and total timing survive conversion; joined notation may retain tied fragments rather than reconstructing the original dotted symbol.
- Full-chart playback suppresses continuation strikes across bars. Starting or looping a selected section at a continuation sounds its initial head once so the section can be practised independently. Grid edits discard duration review and turn tied heads into fresh grid strikes. Deleting or duplicating bars detaches incoming ties when the preceding-bar relationship changes; orphan continuations after preceding-grid edits become fresh strikes. These edits are undoable.
- MusicXML import/export preserves supported cross-bar chains, dots, rests, separate voices and dynamics. Rest-only reviewed voices retain metadata using unambiguous voice mapping from surrounding measures. Invalid, interrupted and dangling ties are rejected. Standalone bar review still cannot confirm an incoming tie without chart context.
- Source session restore shows saved scan requirements and offers Apply saved settings, rescan and restore. It validates the exact original crop/source/page and supported settings before scanning, then checks candidate geometry before restoring mapping, selection and duration edits. Identity, source and region confirmations remain cleared. Existing version-one sessions remain supported.
- Added an independently inspected Highway To Hell PDF source: eight visually labelled crossed heads with single-beam eighth durations. Instrument identities are withheld because this score has no accompanying cymbal legend. Tightened minimum ring radius to exclude plain cross/staff/stem junctions while retaining the existing labelled ring cases.
- Validation: 340 unit tests across 91 files, production build and local source benchmark pass. Benchmark retains 12/12 labelled cymbal identities, 17/17 original duration cases, 2/2 circled-symbol references and four lower-system checks, plus 8/8 new eighth values and 8/8 new plain-cross exclusions. Three extra key identities are manual mapping/round-trip cases, not automatic accuracy claims. Lint has five nonblocking React state-in-effect warnings.
- No package/workflow or chart-schema-number changes. Browser/physical audio remain manual due to unavailable browser system libraries. Tuplets, half-note reviewed durations and automatic full-song transcription remain outside this release.

### Next proposed v0.10.28
- Edit reviewed-bar durations directly in the chart editor, with tie-aware diagnostics and broader source benchmarks at multiple rendering scales.


### v0.10.28 delivered (2026-11-17)
- Added direct reviewed-duration editing in the chart editor for bars that already have confirmed/imported duration metadata. Local drafts support voice, onset slot, sixteenth/eighth/quarter/dotted duration, note/rest, dynamics and ties, plus event removal and explicit next-gap rest filling. Grid-only bars retain their existing grid flow.
- Coverage diagnostics identify gaps, overlaps and overflow event numbers, with inspect-event controls. Tie diagnostics identify orphan incoming/internal ties and edits that break continuations into the next bar. Applying requires valid supported rhythm and fresh source verification. Outgoing ties may detach only after an explicit source-verified acknowledgement; unaffected voices retain their ties.
- Applied edits atomically rebuild onset arrays and reviewed metadata, clear stale chart review, retain compatible JSON/MusicXML data and participate in chart Undo/Redo. Invalid drafts do not change playback or saves. Draft edits reset when navigating to another bar or changing chart bars, so apply/discard before switching. Review controls disable during playback.
- Added fresh 108/144/216 DPI renders from the supplied Highway To Hell PDF, reusing eight visually labelled single-beam note coordinates. Across three DPIs: 24/24 eighth-value checks and 24/24 plain-cross checks. These are eight repeated musical references at three rendering scales, not 24 independent notes; instrument identities remain withheld without a source legend.
- The 216 DPI cases exposed stem placement/attachment gaps that returned unknown values. Stem-position search now scales with staff spacing and allows a proportional initial attachment gap only inside the head footprint; continuity beyond the head remains strict. Existing dotted-note withholding, beam/flag, clipped-stem and ring cases remain intact.
- Validation: production build, 350 unit tests across 94 files and local source benchmark pass. Original benchmark remains 12/12 labelled supported cymbal identities, 17/17 original durations, 2/2 circled-symbol references, four lower-system checks and eight additional base-DPI score checks. Three key identity cases remain manual mapping/round-trip evidence. Lint has five nonblocking React state-in-effect warnings.
- No package, workflow or persisted chart-schema changes. Browser and physical-audio checks remain manual. The scale benchmark checks duration/symbol evidence at labelled coordinates; it does not claim automatic notehead detection or general recognition accuracy.

### Next proposed v0.10.29
- Improve reviewed-editor source-reference navigation and draft edit history; add labelled mixed-duration beam/flag benchmarks at multiple scales.


### v0.10.29 delivered (2026-11-17)
- Added a focused Source reference panel in Play Chart: local PDF filename and per-bar page, persisted through existing chart review JSON. Show source reference requests a matching user-selected local PDF, navigates its browser iframe/page link, and scrolls to the viewer. Missing/mismatched files prompt for the correct local file; source text is never fetched as a URL. Pending requests retry after selecting the matching file. Browser PDF viewers remain responsible for page validity and support.
- Appended PDF drafts retain their source/page and require an existing source filename to match. A chart has one source filename; use separate charts for different PDFs. Duration and boundary-tie edits retain references and invalidate only affected review signatures. Structural bar/meter operations still reset source review metadata; recheck and restore references after rebar operations. PDF binaries remain local and are not saved.
- Added independent Undo draft edit / Redo draft edit with up to 50 local snapshots, including invalid intermediate rhythms. History moves and fresh edits clear source verification and outgoing-tie acknowledgement; branch edits clear redo. Discard resets local history to applied events; Apply participates in existing chart Undo/Redo. Switching bars, chart bars or saved source/page resets unapplied drafts. Controls disable during playback.
- Added twelve visually labelled Back in Black PDF references at fresh 108/144/216 DPI: quarters, eighths, sixteenths, full/partial beams, shared stems and a standalone flag. Results are 32/36 duration checks, 35/36 beam/flag/none checks and 36/36 uncircled checks. All 24 duration/evidence checks at 144/216 DPI pass. Four 108-DPI duration failures remain visible: two missing thin stems return unknown, two short-beam neighbours return sixteenth for eighth. These twelve notes repeat across scales; instrument identities remain withheld without a source legend.
- Benchmarks exposed short secondary beams and long shared stems. Beam inspection now checks short bands alongside a longer primary beam and separates a real flag at all scales. Stem tracing covers shared stems up to seven staff gaps and uses direct column support to resolve equal-length candidates. Original source checks remain 12/12 supported cymbal identities, 17/17 durations, 2/2 circled symbols and 24/24 Highway scale durations/symbols. New mixed failures are reported separately; established checks and high-DPI mixed cases gate regressions.
- Validation: production build, 359 unit tests across 96 files and local source benchmark pass. Lint has six nonblocking warnings (one existing Fast Refresh export warning and five state-in-effect warnings, including PDF navigation synchronization). Browser and physical-audio checks remain manual. No package, workflow or persisted schema changes.

### Next proposed v0.10.30
- Improve thin-stem and short-beam recognition at low rendering scales; preserve source references through bar restructuring and add direct source-page comparison controls.


### v0.10.30 delivered (2026-11-17)
- Improved low-resolution thin-stem recognition by retaining a supplementary faint-ink mask from source RGBA pixels, using the selected threshold or 210 whichever is higher. Head/staff/beam detection remains at the user-selected threshold. Only stem tracing below ten-pixel staff spacing can use faint ink, and broad gray regions are excluded. Binary-only legacy fixtures continue to work.
- Beam support now requires ink attached near the stem; a neighbouring short secondary beam cannot supply a disconnected band. Previously failing 108-DPI Back in Black cases now pass: two faint stems and two short-beam neighbours. Mixed source benchmark is now 36/36 durations, 36/36 beam/flag/none labels and 36/36 uncircled symbols across fresh 108/144/216-DPI renders. These twelve source notes repeat across three scales, not 36 independent examples. General recognition accuracy and automatic head detection remain unestablished.
- Preserved source references through Add blank bar, Duplicate bar, Remove bar and 4/4-to-2/4 split or reverse join. Structural operations retain the chart source name, map per-bar pages/notes and reset verification/signatures. Blank bars receive page 1 awaiting source review; duplicates retain the selected reference. Joined bars retain every distinct page from both halves, with combined review notes capped at the existing 500-character limit. Splits conservatively retain all linked pages on both halves because exact PDF placement cannot be inferred.
- Added optional additionalPages to existing bar-review JSON. It is validated and round-trips with schema 1; older single-page charts require no migration. Same-bar edits and chart Undo/Redo preserve these references. Clear additional source pages lets the user simplify a split bar after checking its actual mapping.
- Added explicit source-page comparison: select a comparison page, open two local PDF viewers and links, view retained pages individually, or return to the primary single-page view. Comparison navigation does not edit saved references or chart notes. Matching filename validation protects both viewers; missing/mismatched source requests never navigate a different file. Layout uses two columns on larger screens and stacked viewers on narrow screens. Browser PDF fragment support/page limits remain device-dependent.
- Validation: 368 unit tests across 96 files, production build and local source benchmark pass. All established real-source checks remain passing: 12/12 supported cymbal heads, 17/17 original durations, 2/2 circled symbols and 24/24 Highway scale durations/symbols, plus existing extra/manual source cases. Lint retains six nonblocking React warnings. Browser/physical audio checks remain manual. No new packages or workflow changes.

### Next proposed v0.10.31
- Add rendered source-page comparison with verified PDF page bounds and zoom, plus labelled low-resolution recognition cases from a second passage.


### v0.10.31 delivered (2026-11-19)
- Addressed feedback image image_1795079861455.png: overlapping hi-hat candidate labels on the first Back in Black groove and an unavailable Build draft preview button. Generic cross-head fitting now refines vertical centers too, then retains the strongest close cross candidate while collapsing overlapping same-instrument shoulders. Nearby distinct head coverage and filled-head regressions remain checked. The provided screenshot contains overlays, so recognition benchmarks use fresh unannotated renders of the corresponding supplied PDF passage rather than treating overlay pixels as notation.
- Build draft preview no longer requires source acknowledgement before displaying provisional checked/aligned onsets. Identity, alignment and actual multi-bar/staff safeguards remain. Sending still requires source acknowledgement and valid identity/region checks. Unchecked candidates remain excluded. This lets users inspect a provisional preview before verifying it.
- Added rendered local PDF comparison with actual document page-count bounds, Previous/Next, direct page selection, and 50/75/100/150/200% zoom per pane. Rendering is bounded to about four million pixels and a maximum scale of three. A staging canvas plus abort guards prevents stale render commits during page/zoom/file changes; PDF tasks are destroyed. Chart references and the recognition crop are unchanged by viewer navigation. Browser PDF fallbacks remain in collapsed details for unsupported/damaged/password-protected files.
- Added eight visually labelled cross heads from the supplied Back in Black first complete groove bar, freshly rendered at 108/144/216 DPI. With generic profile, clean heads and tolerance 2: 24/24 head recoveries, exactly eight cross suggestions per scale and zero unmatched suggestions. Instrument identity is withheld without a source legend. These are eight notes repeated at three scales, not 24 independent examples; automatic duration accuracy for this added head benchmark is not asserted.
- Validation: 374 tests across 98 files and production build pass. Existing source checks remain 12/12 supported cymbal heads, 17/17 original durations, 2/2 circled symbols, 24/24 Highway scale values/symbols and 36/36 mixed-duration values/evidence. Explicit-file lint retains six nonblocking React warnings. Build emits a nonblocking shared static/dynamic renderer-import notice. Browser and physical-audio validation remains manual. No new packages, workflow changes or persisted chart-schema changes.

### Next proposed v0.10.32
- Add direct source-crop comparison alongside candidate review, clearer alignment recovery controls and more labelled dense/cross-head examples from additional score passages.


### v0.10.32 delivered — combined five proposed phases (2026-11-19)
- Folded the previously proposed v0.10.32–v0.10.36 work into this single release. No intervening phase uploads are required; this set follows complete v0.10.31.
- Source-crop comparison: original unannotated pixels appear beside the current draft staff with independent source zoom. Candidate overlays remain separate. Fit guides to checked head range supplies a provisional first/last range; it never infers timing. Uneven engraved spacing or mixed onset gaps prompts manual onset review. Source focus/zoom/filtering does not invalidate an already staged review.
- Duplicate and ambiguous-head review: possible overlap filter, explicit source comparison and Keep/exclude actions work for close same-shape alternatives. Both heads may be real; no automatic identity transfer is performed. Existing Hi-hat/Ride/Crash and circled-cymbal source-legend controls remain. Manual selection, mapping, identity and duration corrections keep a bounded 50-entry audit trail. Version-one source-review sessions optionally save/restore this trail; identity and source confirmation still require rechecking after restoration.
- Rhythm context: nearby stem endpoints are compared only when an actual ink path links them outside staff lines. Connected-path context can distinguish shared-beam evidence from locally detected flags; a short flag without a confirmed path remains isolated-flag evidence. It does not force unsupported dots or user-reviewed musical values. Candidate controls link beam neighbours for side-by-side source inspection. Dotted values and adjacent ties remain manual reviewed-duration features; tuplets and automatic expressive-notation interpretation remain unsupported.
- Multiple-bar review: select one staff on one PDF page, opt into passage review, set 2–8 explicit boundaries over the original crop, and review each sliced bar separately. Uneven bar widths are supported. Each bar stages only after its source verification. Completely silent bars have a separate source-confirmed path with an explicit warning that repeats/slashes are not silence. Every staged bar must share a meter; final ordered-passage verification is required before sending. Any candidate/settings/source/guide/duration edits invalidate the affected staged bar and final verification. Boundary edits discard the local passage review.
- Ordered append: Add detected bars atomically appends the whole verified passage, retains page/source references per bar, and participates in existing chart Undo/Redo. Mixed meters, a mismatched existing source, or exceeding sixteen chart bars blocks the entire append without partial consumption. Staged passage data is temporary; append and save the chart to retain it. Single-bar drafts and legacy charts continue to work.
- Publisher validation: added four visually labelled eighth pickup crosses from supplied Feel Good Inc., Will’s Drum Lessons (transcribed by Will Beavis), at fresh 108/144/216 DPI. 12/12 duration checks, 12/12 beam/flag evidence and 12/12 uncircled-symbol checks pass. These four notes repeat at three scales, not twelve independent musical references. Existing Back in Black/Highway and source-key benchmarks remain passing. Known-coordinate duration/symbol tests do not establish automatic head detection, instrument identity or general recognition accuracy.
- Validation: production build and 390 unit tests across 104 files pass. Local benchmark passes: 12/12 new publisher durations/evidence; 24/24 first-groove head recoveries with zero unmatched crosses; 36/36 mixed durations/evidence; 24/24 Highway scale values/symbols; 12/12 supported cymbal identities, 17/17 original duration cases and 2/2 circled-symbol cases. Lint retains six nonblocking React warnings; build has the existing shared static/dynamic renderer-import notice. Browser and physical-audio checks remain manual. No new packages, workflow changes or persisted chart-schema version changes.

### Next proposed after the combined release — v0.10.33
- Prioritize new real-source feedback, add denser and smaller-scale labelled passages, and improve passage review recovery across refreshed source sessions. The prior five-phase proposals were incorporated in v0.10.32.


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

### Next proposed after v0.10.33 — v0.10.34
- Resolve the remaining smallest-scale partial-beam case, add denser labelled source passages, and extend pickup/source-review timing based on real feedback. The prior five-version proposals were incorporated in v0.10.33.


### v0.10.34 delivered (2026-11-19)
- Fixes the remaining 72-DPI partial beam with a narrower two-pixel attached-stem sample below seven-pixel staff spacing. Strict dark-ink attachment remains required; short evidence only augments an established beam.
- Adds four manually labelled lower oval notes in the existing dense Back in Black mixed-beam passage, rendered at 72/90/108 DPI. Their shared stems exceed the former seven-gap tracing cap; tracing now permits nine gaps with the same continuity checks. Small suite: 48/48 values and evidence kinds, representing sixteen notes repeated at three scales. These are added voices in the existing source passage, not a new independent publisher/passage. Identity is withheld without a source legend. Established source suites remain passing.
- Adds explicit source-verified first-bar pickup timing to chart editor: select the number of silent sixteenth slots to skip. Notes, reviewed events and source links stay intact. Playback/highlighting begin at the actual offset; loops repeat the shortened first bar, later selected sections use full bars, count-in is separate. Optional schema-1 pickupOffset persists in save/load and JSON. Offsets that would skip any strike are rejected; live note conflicts restore full timing on the next start/loop and block save until pickup is turned off or corrected. Remove-bar resets pickup. Meter conversion requires turning pickup off and rechecking after conversion. No automatic pickup detection, tuplets or arbitrary meters.
- Production build and 410 unit tests / 112 files pass. Tests cover one-second pickup at 60 BPM, loop cycle timing, later-section offset, JSON retention, two-beat support, invalid/hidden-strike rejection and meter safeguard. Explicit-file lint retains twelve nonblocking React warnings. Browser/physical-audio verification remains manual. No package or workflow changes.

### Next proposed after v0.10.34 — v0.10.35
- Add an independently labelled dense passage from another source, improve shared-stem duration context and compare pickup timing directly in source-passage previews.
