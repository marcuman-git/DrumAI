# DrumMaster AI — v1.0.0-rc.1

A local-first drum practice app with metronome, timing analysis, rudiments, stick control, reading, dictation, independence, grooves, fills, polyrhythm, odd-time, dynamics, speed training, song charts, analytics and a rule-based practice coach.

## Run

Use a current Node version supported by Vite. Run `npm ci`, then `npm run dev`. Production: `npm run build`, then `npm run preview`. Deploy the generated `dist` folder using the existing Pages workflow. Upload all files in a release together before running CI.

## Score workflow

Load a local PDF, crop a staff, analyze it, review selected noteheads and ambiguous cymbal identities, compare beam/flag evidence, and assign onsets and durations. Fill rests only after checking the source. Confirm the reviewed draft before creating or appending a chart. PDF detection is experimental and does not guarantee complete transcription. Keep source PDFs separately; backups preserve references, not PDF bytes.

Charts support 2/4 and 4/4, up to256 bars, labels, selected sections, looping, pickups, source references, review status and undo/redo. Existing sixteenth-slot grid charts remain compatible. Reviewed events use finer timing for32nds,64ths, dotted values and3:2 triplets. Count-label selection groups grid notation; it never rewrites reviewed durations.

MusicXML imports one mapped percussion part with complete bars, a single meter and constant tempo. Supported repeats and numbered endings expand to explicit bars. Nested repeats, other tuplets, mixed meters, tempo changes and incomplete imported measures require manual preparation. Export requires complete reviewed bars. Files must be uncompressed, without DTD/entities, and below8 MB. Grace groups support flam/drag; listed articulations retain their reviewed identity. Synthesized articulation and35 ms grace spacing approximate performance.

## Data and recovery

Training data stays in browser storage. New users start with no earned progress. MIDI requires a supported browser and a connected device; microphone access requires a secure context and permission. The coach derives suggestions from local practice evidence and does not claim unmeasured accuracy. Cloud accounts, community sync and a hosted generative coach are outside this local release.

Analytics contains two backup flows: the compatible history/journal merge backup, and full-app backup covering profile, preferences, charts, saved exercises, playlists, records and adaptive plans. Full restore previews replacements, downloads a safety copy first and merges history by ID. Reload after restoring. Backups can contain private practice and journal data. Browser storage can be cleared by the browser; keep exported copies.

The installed PWA caches the app after a successful online visit. Local PDFs must be selected again. An available update waits for a reload action; stop playback and save first. Installation availability depends on browser support.

## Release status

This is a release candidate. Automated validation is recorded in `RELEASE_READINESS.md`. Hardware microphone/MIDI accuracy, audible output and supported-browser/mobile/offline checks must pass before a stable v1.0 label. Recognition limitations remain visible and editable.
