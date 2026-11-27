# v1.0.0-rc.3 — remove invented rest glyphs

The highlighted symbols were generated per-instrument coverage rests, not detected noteheads. Composite staff rendering now shows shared silence once, retains explicitly reviewed/source-anchored rest glyphs, and hides inactive-voice coverage gaps while other instruments play. Legacy charts benefit without reanalysis; underlying timing and playback remain intact. Rest display intent is preserved through saves and MusicXML print-object flags. See REST_NOTATION_FIX.md.

---

# v1.0.0-rc.2 — musical timing consolidation

The requested timing work is delivered as one update. Test the source → timing proposal → reviewed draft → chart → playback workflow using TIMING_UPDATE.md. Stable release still requires browser/device/listening and independent-source validation; no additional serial timing release plan is required to use this update.

---

# Remaining work after v1.0.0-rc.1

The six planned local-app implementation releases are consolidated into one candidate. See RELEASE_READINESS.md for the delivered-scope mapping and release gates.

1. Run the complete browser suite and mobile/accessibility checks on a host with browser libraries.
2. Verify physical microphone/MIDI timing, calibration, reconnects and session cleanup; listen to triplet/grace/tie playback.
3. Test full-backup restoration in a separate profile and production PWA offline/update behavior.
4. Obtain fresh independent score pages for expanded-rest and low-resolution cymbal/flag validation; fix reproduced errors before stable release.
5. After these gates pass, tag stable v1.0. Cloud/community accounts and general arbitrary-score transcription remain separately scoped future expansions.

Historical proposals below are preserved for context, not additional mandatory serial releases.

---

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


### v0.10.35 delivered (2026-11-19)
- Added an independently visually labelled dense passage from the supplied Baba O’Riley score, page 1, section F: sixteen oval heads in four double-beam groups, with accents below. Fresh 72/108/144/216-DPI crops yield 64/64 duration, evidence-kind and symbol checks; 64/64 within-group context links with zero cross-group links. This is sixteen source notes repeated at four scales, not 64 independent examples. Publisher/instrument identity is withheld without an accompanying source legend. Known-coordinate checks do not establish general candidate detection accuracy.
- Beam context now rejects links containing a continuous gap longer than the scaled limit, rather than accepting a high average ink ratio across separate groups. Mixed/partial beam durations remain individual hints. Continuous vertically shared stems now link heads at distinct heights; the same bounded narrow faint-stem support used by tracing is allowed below ten-pixel spacing, while broad gray backgrounds are excluded. Candidate navigator offers Compare shared-stem head alongside existing beam-neighbour comparison. Neither context links nor adjacent heads assign instrument identity or copy duration values.
- Added separately labelled shared-stem pair checks in the existing Back in Black dense crop: four pairs at 72/90/108 DPI, 12/12 links with individual durations retained. Existing source suite remains passing, including 48/48 smaller-scale duration/evidence checks. Controlled tests reject duplicate heads, disconnected stems and broad faint backgrounds.
- First-bar pickup comparison is available inside adjacent-bar source review and for a single collected bar. It shows the first staff, source inspection where a navigation callback/reference is available, selectable comparison tempo and full versus shortened timing excluding count-in. Selecting a silent-slot offset requires an explicit source check; silent bars and bars starting with a strike offer no shortened candidate. Bar/reference changes clear confirmation/offset, including changes later reverted. Staged passages now supply source/page/crop metadata to continuity comparison.
- Comparison does not mutate bars, source provenance, saved pickupOffset, final-send verification or playback. After sending, explicitly choose the verified offset in the chart editor only when that passage is the chart’s first bar. Appending later bars does not establish a chart pickup. Native shortened staff notation and automatic pickup detection remain outside this phase.
- Validation: 418 unit tests across 115 files and production build pass. Source report gates the new dense value/symbol/group checks and shared-stem pairs alongside all established suites. Explicit-file lint retains twelve nonblocking React warnings; build retains the shared static/dynamic PDF renderer-import notice. Browser and physical-audio checks remain manual. No new packages, workflows, schema migrations, external uploads or deployment.

### Next proposed after v0.10.35 — v0.10.36
- Add an independently labelled mixed-duration passage, improve sloped/partially broken beam context, and make verified pickup comparisons easier to transfer into a new chart while preserving explicit source review.


### v0.10.36 delivered — combined Recognition and evidence review (2026-11-19)
- Incorporates the five proposed recognition/evidence phases 36–40 into one upload after complete v0.10.35. There are no separate v0.10.37–v0.10.40 phase uploads in this bundle. The next proposed actual release v0.10.37 is the remaining five workflow phases 41–45.
- Pickup test timeout: the reported combined playback/loop test passed locally in approximately 2.3 seconds of test execution, but its setup repeatedly queried the entire editor grid and cycled many notes through three clicks. Replaced that setup with a valid saved pickup-chart fixture and split one-second completion and repeated one-second cycles into independent tests. The two revised tests initially completed in approximately one second combined here, without increasing the default five-second timeout or changing playback behavior. Final full suite and single-worker focused check pass. A slower CI host can differ; no global timeout increase was introduced.
- Flags: adds a bounded connected-curve check extending beyond the former short scan. It requires attached ink, excludes head/under-head accents and staff-line paths, and only supplies one/two flags when existing beam/flag checks found none. It recovers two 108-DPI double-flag values in the newly labelled source. It never replaces established beam bands or an existing flag count; disagreement instead provides review guidance. Broader replacement regressed known values and is excluded from the delivered implementation.
- Beam context: connected and interrupted paths are separate. Sloped paths are checked in both directions; long gaps are rejected, small interrupted paths offer source comparison only and never copy durations. Navigator can compare interrupted beams. Shared-stem duration differences and rendering/flag-evidence warnings appear in Needs review and the new Evidence review summary. Selection, voice mapping and manual durations remain independent.
- Cymbal guidance: a source-key checklist separates rings around crosses, separate articulation circles, ledger strokes and top-line center positions. No matching legend means identity remains unreviewed or excluded. Added labelled circled/plain crosses from Baba O’Riley alongside the established China/source-key cases; no instrument identity is inferred for this score without a legend. Existing identity/source confirmation rules remain in effect.
- Source benchmarks: independently labelled Baba O’Riley intro flags/sloped beams and bar 28 mixed/dotted/cymbal rhythm comprise 21 source heads rendered at 72/108/144/216 DPI: 70/84 expected duration-hint outcomes versus v0.10.35’s 68/84, 84/84 shape/ring checks. Dotted eighths intentionally remain unknown in straight-value hints. Four intentionally clipped crop variants add 32/32 clipped-stem abstentions. These repeat source heads/crops at scales, not independent musical examples. Every remaining wrong duration/evidence hint is listed in MIXED_SOURCE_FAILURES.md and the JSON report.
- Benchmark baseline stores the measured v0.10.35 outputs against independent source labels. Gates prevent any formerly correct value/evidence/symbol case from regressing, require the labelled improvement, verify dotted/clipped abstentions and preserve the established suites: 64/64 dense durations/context, zero cross-group links; 12/12 shared-stem pairs; 48/48 small-scale values/evidence; 36/36 existing mixed values/evidence; all publisher/key/first-groove/Highway checks pass. Known-coordinate benchmarks do not establish general head detection or universal instrument confidence.
- Validation: production build and 428 unit tests across 120 files pass. Tests cover detached-curve/accent rejection, sloped/interrupted/staff-line paths, source-baseline regression, dotted/clipped crops, shared-stem warning independence, summary selection independence and source-key guidance. Twelve existing nonblocking React lint warnings and the shared PDF renderer-import build notice remain. Browser and physical-audio checks remain manual. No packages, workflows, schema migration, external upload or deployment changes.

### Next proposed after combined v0.10.36 — v0.10.37 Review and chart workflow
- Combine the remaining proposed phases 41–45: verified pickup transfer to a new chart; pickup-aware playback/count/highlight and section timing; broader draft edit/recovery history; streamlined multi-staff/page collection validation; consolidated correction summary and end-to-end regression coverage.
- Additional recognition research can target the explicitly listed Baba thin single/double-flag and 72-DPI partial-beam misses, without claiming they are resolved in v0.10.36.


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

### Next proposed after combined v0.10.37 — v0.10.38
- Focus on remaining labelled thin-flag/partial-beam recognition errors and workflow hardening from browser/audio feedback, with targeted source cases and regression checks. The previous ten proposed phases have now been incorporated into the two combined releases v0.10.36 and v0.10.37.


### v0.10.38 delivered — targeted recognition fixes and recovery sizing (2026-11-20)
- Filled-oval stem tracing now permits only one missing pixel beyond the head footprint. This prevents a stem from jumping a two-pixel gap into a boxed section label below it. Cross-head attachment keeps its former gap allowance. Recovers two false quarter-to-eighth hints in the 72/108-DPI Baba bar-28 crop. Real disconnected/damaged stems can still require manual review; this is not a universal duration guarantee.
- At staff spacing below seven pixels, a secondary beam can occupy rows otherwise excluded as staff-line ink. A supplementary check requires an already detected primary beam and exactly two separated attached bands with at least two dark rows each. A single thin staff row cannot supply a second beam. Recovers five 72-DPI partial/double-beam duration hints while retaining established source checks.
- Connected-curve tracing uses bounded narrow faint-ink support below ten-pixel spacing, excluding broad gray backgrounds. It recovers the previously missed 108-DPI eighth flag. Existing beam/flag values are not overwritten by this fallback; disputed double-flag evidence remains manual.
- Mixed-source result improves from v0.10.37’s 70/84 to 78/84 expected duration-hint outcomes, versus the original 68/84 baseline. All 84 source shape/ring checks pass and no formerly correct labelled outcomes regress. Four clipped crop variants remain 32/32 unknown. This reuses 21 visually labelled heads at four scales, not 84 independent examples. Six wrong duration values and one additional beam/flag-kind mismatch remain explicitly listed in MIXED_SOURCE_FAILURES.md. No cymbal identity is claimed without a source legend.
- Established suites remain passing: dense 64/64 values/context with no cross-group links, shared-stem 12/12 pairs, small-scale 48/48 values/evidence, existing mixed 36/36, and all publisher/key/Highway/first-groove checks. Benchmark gates now require at least 78/84 on the mixed source set, plus all existing regression and clipped/dotted checks.
- Workflow hardening: ordered collection export now measures actual UTF-8 file bytes, rather than JavaScript string length, before applying the eight-million-byte import limit. Current sections take priority; oldest past/farthest future history is trimmed as needed. A collection that cannot fit without losing current sections rejects export. This prevents Unicode recovery text from producing a file that the existing import-size gate refuses. Version-1 snapshots, source checks and cleared recovery verification remain compatible.
- Validation: 445 unit tests across 125 files and production build pass. New regressions cover labelled staff-overlap beams, section-label contamination, narrow faint curves versus broad gray blocks, thin staff-line negative evidence and UTF-8 recovery export/import. Lint retains twelve existing nonblocking React warnings; shared PDF renderer-import notice remains. Browser and physical-audio checks remain manual. No packages, workflows, schema migration, external upload or deployment changes.

### Next proposed after v0.10.38 — v0.10.39
- Resolve remaining labelled double-flag cases with independent source checks and improve uncertainty guidance for conflicting beam/flag evidence. Continue workflow regression coverage based on browser/audio feedback.


### v0.10.39 delivered — corroborated double flags and disagreement review (2026-11-20)
- Connected-curve tracing can bridge thin excluded staff rows with bounded horizontal movement, so a diagonal flag crossing a staff line is not disconnected by a same-column-only bridge. Ink on staff rows is still excluded; no arbitrary background path is added. This recovers the labelled 72-DPI eighth flag.
- Curve inspection now reports maximum ray bands and a separate corroborated two-flag count. Two flags require agreement across consecutive sampling columns, scaled to staff spacing. Below ten-pixel staff spacing each band keeps a two-row support requirement; larger renders permit thinner supported bands. The 216-DPI single eighth has a two-band ray outlier but no adjacent-column corroboration and retains Eighth.
- Corroborated two-flag curves can correct a weaker local one-beam/one-flag result, while established two-beam results remain unchanged. Recovers both 144-DPI and both 216-DPI double-flag values. Low-resolution fallback and clipped/dotted priorities remain intact. This is a bounded local interpretation, not general recognition confidence.
- Candidate review displays the independent local beam, short flag, connected curve and corroborated counts. Overlapping beam/curve evidence and different flag counts receive actionable source-review guidance. Manual duration choices remain separate and are never rewritten by review guidance. Source reports retain these separate measurements for inspection.
- Mixed-source expected duration outcomes improve from 78/84 to 83/84, versus the original 68/84 baseline. Five more values are recovered. All 108/144/216-DPI expected values pass in this labelled set. One 72-DPI double flag remains Eighth instead of Sixteenth; another 72-DPI double flag has the correct Sixteenth value but is still classified as beam evidence. Both are explicit in MIXED_SOURCE_FAILURES.md. Instrument identity is withheld without a source legend. Twenty-one source heads are repeated at four scales, not 84 independent examples.
- All 84 source shape/ring checks and 32 clipped-stem abstentions pass. Established suites remain passing: dense 64/64 values/context with no cross-group links, shared-stem 12/12, small-scale 48/48, existing mixed 36/36, and publisher/key/Highway/first-groove cases. New gates require at least 83/84, correct labelled single flags and high-resolution double flags, and all existing regressions. Known-coordinate results do not establish universal detection or instrument accuracy.
- Validation: 449 unit tests across 125 files and production build pass. Tests include corroborated double curves, the real single-flag ray outlier, high-resolution source branches, manual-duration independence and existing detached/accent/gray-background negatives. Lint retains twelve nonblocking React warnings; the shared PDF renderer-import build notice remains. Browser and physical-audio checks remain manual. No package, workflow, schema, external-upload or deployment changes.

### Next proposed after v0.10.39 — v0.10.40
- Address the remaining low-resolution flag ambiguity and broaden independently labelled source validation, retaining explicit uncertainty and workflow regressions.


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

### Next proposed after combined v0.10.40 — v0.10.41
- Reduce unmatched dense-scan candidates, improve low-resolution source inspection and broaden independent head/flag validation. The previously proposed v0.10.40–v0.10.44 scopes are incorporated in this one release. Remaining labelled low-resolution errors remain explicit.


### v0.10.41 delivered (2026-11-23)
- Dense oval shoulder consolidation reduces unmatched candidates from 121 to 112 while preserving 160/160 labelled heads; standard mode remains unchanged. Unmatched ink still requires manual review.
- Higher-detail PDF rendering clears analysis and preserves optional renderZoom in source crops and passage references. Recovery restores saved render quality; legacy crops default to standard. Crop dimensions and downsampling guidance are shown. Source images cannot gain missing ink by magnification.
- Independent automatic-head-position duration validation is now reported separately: Feel Good intro 44/48 duration values versus 48/48 at labelled coordinates; head recovery 47/48. Existing mixed-source duration 83/84 and evidence-kind discrepancy remain unresolved. No new independently labelled source examples are claimed.
- Includes the previously delivered dense/mixed/publisher/intro fixture dependencies to repair CI missing realDenseSourceFixtures imports. Upload these alongside changed tests; do not remove benchmark coverage.
- 463 tests across 130 files and production build pass. Browser/rendering and physical-audio verification remain manual. No external deployment or package/workflow changes.

### Next proposed v0.10.42
- Improve duration evidence at automatically recovered head positions, add independently labelled source examples, and refine remaining low-resolution flags while retaining recovery and unmatched-candidate checks.


### v0.10.42 combined recognition and source-validation release (2026-11-23)
- Combines bounded attachment recovery, low-resolution ambiguity guidance, automatic-position validation and new mixed-passage source benchmarks in one upload after v0.10.41.
- Stem search retains its original attachment range first. Only unresolved short stems receive a bounded wider search; existing resolved geometry remains unchanged. A recovered stem receives explicit manual-review guidance. Intro automatic-position durations improve 44/48 to 45/48, including the displaced 216-DPI oval. Two displaced 108-DPI crosses and one missed 72-DPI head remain.
- Review reasons explain missing continuous stems and uncorroborated two-ray curve counts, including the risk of a single flag appearing as two bands. These messages do not confirm candidates or overwrite manual durations.
- New independently visually labelled Feel Good Inc page-1 bar-36 crop includes four quarter-note heads, three beamed eighth heads and two single-flag eighth heads; instrument identity withheld. Nine physical heads rendered at four scales produce 36 scale checks, not 36 independent heads. The eighth rest is excluded from head references. Local source PNGs are review artifacts only.
- New passage: automatic heads 35/36; duration values 34/36 at both labelled and detected positions. Known-coordinate misses are the shared-stem single flag at 108 DPI; automatic-position failures are one missed 72-DPI cross and one 108-DPI single flag overcount. This validation exposes errors rather than asserting complete accuracy.
- Existing cohorts preserved: dense heads 160/160, unmatched112; mixed durations83/84; all established dense/shared/small/publisher/groove suites pass. Original low-resolution double-flag and evidence-kind discrepancies remain unresolved.
- Validation: 466 unit tests across 131 files and production build pass. Explicit-file lint retains existing nonblocking React warnings. Browser and physical audio checks remain manual. No package/workflow changes or external deployment.

### Next proposed combined v0.10.43
- Improve displaced cross-head centers and isolated single/double-flag discrimination, with shared-stem source comparisons and broader score-style benchmarks. Preserve tentative review and recovery checks.


### v0.10.43 screenshot timing correction (2026-11-23)
- Prioritizes the four supplied module screenshots: eight detected cymbal heads plus two snare and two kick heads became a five-cymbal, off-grid draft because crop-edge guides were interpreted as onset centers and unaligned checked heads were filtered out. Short-note/rest display then correctly reflected the incorrect draft. No automatic instrument-identity accuracy is claimed.
- New explicit Build regular eighth onset preview groups checked simultaneous source heads into eight regular columns and maps them to slots0,2,4,6,8,10,12,14. The screenshot pattern retains all12 strokes; quarter/sixteenth and2/4 variants use the corresponding expected column count. This is a user-selected regular-onset assumption, not duration recognition.
- Clustering uses a staff-scaled bound, requires a complete expected column count and regular-enough spacing, and rejects duplicate same-voice heads rather than merging them silently. Rests, pickups and mixed rhythms still need manual duration/onset review. Original physical source coordinates are retained. Confirmation resets when building the new preview; transfer remains explicit and gated by source/identity/region checks.
- Existing guide-based preview now blocks when any checked candidate would be lost to slot alignment. Fit onset guides or use regular/manual mapping before previewing.
- Tests reproduce the twelve-head screenshot pattern, verify eighth staff symbols retain all onsets, reject missing/duplicate/uneven columns, cover2/4 and unchanged source coordinates, and exercise preview/confirmation/transfer in the component.
- Validation:470 unit tests across132 files and production build pass. Existing nonblocking lint warnings remain. Browser and physical audio checks remain manual. No package/workflow changes or external deployment. Previously proposed flag discrimination/cross-centering research remains pending; this release addresses the reported conversion failure.

### Next proposed combined v0.10.44
- Resume displaced cross-head centers and single/double-flag discrimination with shared-stem comparisons and broader source benchmarks; extend explicit onset review for uneven engraving without silently losing heads.


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

### Next recommended combined v0.10.45 — proposed phases47–48
- Improve shared-stem/beam-group interpretation for mixed durations and rests, and broaden labelled real-source and end-to-end playback validation. Continue addressing the documented72-DPI errors.


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

### Next proposed combined v0.10.46
- Improve real-source rest-symbol recognition and remaining low-resolution head/flag cases, with independent holdout crops, explicit rest-source comparison and continued onset/playback validation.


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

### Next recommended combined v0.10.47
- Broaden rest matching across fonts/scales with separate development and validation crops, improve the remaining Baba low-resolution flag cases, and expand negative/source/playback checks together in one release. The earlier proposed phases47–48 were already delivered in v0.10.45.
