# v1.0.0-rc.6 — snare reading, sticking and stroke practice

## Learning implemented from the supplied method

Mastering the Snare Drum supplied a useful progression: reading and silence, the four strokes, alternating hands, dynamics, rudiments, mixed durations and meter changes. This release implements original short studies illustrating those concepts; it does not reproduce the book's lesson collection or claim automatic model training.

Snare Studies is reachable through:

- Song Practice → Snare Studies
- Rhythm Reading → Snare studies
- Rudiment Trainer → Snare studies

The existing kit-chart, kit-reading and PAS workflows remain available. Switching between practice modes stops the outgoing playback; the new player cancels pending audio startup, closes its context and stops when hidden/unmounted.

## Fourteen original short studies

1. Four strokes, one hand: full, down, tap and up; reverse to practise the other hand.
2. Quarter notes and silence.
3. Long notes and tied continuations.
4. Alternating eighths.
5. Accents and preparation of the next same-hand stroke.
6. Single paradiddle reading.
7. Dotted-eighth/sixteenth combinations.
8. Flams and drags.
9. Measured five-stroke rolls.
10. Eighth-note triplets.
11. 3/4 reading.
12. Compound6/8 grouped in two pulses.
13. 5/4 phrasing grouped3+2.
14. Mixed2/4 →3/4 →4/4 reading.

## Musical timing and notation

The score uses a single percussion line with note durations, rests, dots, ties, grace notes, accents, sticking, beam groups and triplet brackets. R/L labels are instructional annotations, not extra noteheads. Hide sticking for a reading challenge or reverse the lead without changing timing.

Written durations and sounded attacks are separate. A long snare note has one attack; rests and tied continuations add none. The measured five-stroke example unfolds a written eighth into four thirty-second strokes (RRLL), followed by an accented eighth-note R. It therefore sounds five attacks across one quarter beat, not five equal quarter notes. Four repetitions sound20 strokes in a four-second4/4 phrase at60 BPM. Buzz-roll rebound quality is not measured or automatically generated as a fixed roll count.

A flam has one soft grace before its main onset; a drag has two. The new player uses a120ms preparation lead so the first grace does not collapse into the main note. Demonstration grace separation is25ms; this is illustrative, not a universal technique target. Accent/normal/grace amplitudes differ; zero volume schedules no sounds.

All tempos are **quarter-note BPM**, including6/8. A6/8 bar occupies three quarter beats, with two groups of three eighths; at60 quarter BPM it lasts three seconds.3/4 lasts three seconds and5/4 five seconds. The mixed-meter phrase occupies nine quarter beats. Meter support is local to the new study player: the existing Song Practice chart format still supports2/4 and4/4.

Full/down/tap/up guidance uses the next stroke of the same hand. High→high is full; high→low down; low→low tap; low→high up. These are instructional cues based on annotated accent levels, not camera/motion diagnosis.

## Practice and progress

Choose tempo, volume, lead hand, sticking visibility and1/2/4/8/16 cycles. Optional +2 BPM increases happen between complete phrase cycles, capped at180 BPM. Structural study settings stay fixed while playing. Rehearsal cycles are recorded with measuredTiming=false.

A completed playback target does not certify technique. Confirm that you played cleanly before recording a clean round. Clean rounds are stored separately per study, tempo and lead hand. After three confirmations, Try +5 BPM offers a harder tempo; the new tempo starts with its own round count. Study choice, tempo and confirmed rounds are saved locally and included in Full App Backup/restore.

Open study in Song Practice explicitly transfers compatible single-meter2/4 or4/4 studies at40–180 BPM. Roll strokes become fine reviewed chart events; rests, ties, grace groups and accent dynamics retain their timing. Sticking remains in Snare Studies. Unsupported/mixed study meters remain playable in the study player and cannot be silently squeezed into a4/4 chart.

## Source evidence and verification

585 unit tests across167 files pass. Production build passes. Lint using an exact source copy and unchanged app configuration:0 errors,32 existing warnings. Existing real-source regression guards pass; the prior232 whole-bar timing references and six unmatched suggestions remain disclosed.

New tests cover all study coverage/meter lengths, rest/tie attack suppression, five-stroke expansion, grace precedence and lead reversal, same-hand stroke guidance, compatible chart transfer, overlap/roll validation, target completion, Stop/cancelled resume, zero volume, compound-meter tempo increases, confirmation at each tempo, chart-transfer UI and full-backup round trips.

The new book engraving check uses five labelled head coordinates from the supplied Lesson25 crop at72/108/144 DPI:12 repeated-scale quarter references and three thirty-second references. Stem inspection resolves10/12 quarter values; two108-DPI cases remain uncertain. All three short-note cases detect three beam bands and remain unknown until Thirty-second is explicitly chosen. A faint pixel plane accompanies the threshold mask. Staff spacing/head coordinates are manual benchmark geometry, not automatic single-line/lineless recognition. Threshold/geometry choices were examined during development; this is regression evidence, not an untouched holdout or full-book OCR accuracy claim.

The standalone SNARE_STUDIES_PREVIEW.html was exercised through all14 studies and both lead settings using JSDOM; bar counts and the four triplet groups are checked. It is a silent visual preview. The new browser regression navigates to studies, checks compound-meter transfer blocking and opens a measured roll in Song Practice. Local Chromium remains blocked by missing libatk-1.0.so.0 and other Linux runtime libraries; browser/mobile, audible output and physical input/technique checks remain manual.

## Additional improvements supported by the book

The next strongest candidates are:

- A dedicated single-line/lineless PDF detector, with independent negative cases for R/L letters, counting labels, roll slashes and exercise numbers. Current known-coordinate evidence does not supply automatic staff/head finding.
- Persistent sticking and roll annotations in imported song charts, rather than keeping them only in the study player.
- Full-song3/4,5/4,6/8 and mixed-meter support, with clear quarter-versus-dotted-quarter tempo semantics.
- Written pp/p/mp/mf/f/ff dynamics and crescendos, beyond the current relative accent/normal/grace demonstration.
- Dal Segno, Da Capo and Coda navigation, with explicit bounded playback order.
- Calibrated microphone/MIDI checks for doubles, accent consistency and flam/drag separation. Input timing can support feedback; it cannot by itself establish grip, stick height or relaxed technique.

## Upload and test

Upload the complete rc6 set over repaired rc5, preserving repository-relative folders. src/features/snare-study is a new folder. No dependency additions, workflow changes or song-chart schema changes. Validation files are for review, not app source.

1. Open Snare Studies from Song Practice. Try Four strokes, one hand; reverse the lead and compare Full/Down/Tap/Up cues.
2. Play Quarter notes and silence and Long notes and ties. Silent and tied positions must not sound extra attacks.
3. At60 BPM, play one five-stroke phrase:20 strokes over four seconds, after the short audio preparation lead. Check relative accent/soft grace levels.
4. Try3/4,6/8,5/4 and the mixed-meter study. Check bar lengths and unchanged quarter pulse. Enable two cycles and the tempo ladder; the change occurs at the phrase boundary.
5. Stop during playback/audio startup, switch module, and hide the tab. No future sounds should remain.
6. Confirm three clean rounds, try a higher tempo, reverse the lead and reload. Confirm that counts belong to their study/tempo/lead combination. Export/restore a Full App Backup in a separate profile.
7. Transfer a compatible measured-roll study to Song Practice. Its fine events must preserve20 attacks; unsupported meters must remain blocked from chart transfer.
