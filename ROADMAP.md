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
