# v1.0.0-rc.5 release readiness

## Combined release scope

| Planned release | Delivered in the combined candidate |
| --- | --- |
| Recognition and source review | Existing identity, beam, shared-stem and source-comparison workflow; optional expanded faint-rest scan; explicit uncertainty and source verification |
| Notation and interchange | Fine reviewed timing, dotted/long values,3:2 triplets,32nds/64ths, flam/drag and articulations; repeat/endings expansion and multi-voice MusicXML |
| Full-song workflow |256-bar charts and collections; source-preserving meter changes, labels, selected passages, looping and existing review/history controls |
| Training/input/coach | New-user progress cleanup, production coach test-control removal, MIDI hotplug/listener cleanup, persistence serialization/fallback; existing measured-evidence training workflow |
| Recovery/usability/offline | Full-app backup preview and safety copy, rollback tests, storage-failure notification, usable Daily Plan navigation and PWA update prompt/relative manifest paths |
| Final validation | Unit/build/source regression verification, complete upload inventory and documentation; hardware/browser checks explicitly pending |

The consolidated timing workflow and source comparison checks are described in TIMING_UPDATE.md.

The phantom-rest correction and its verification are described in REST_NOTATION_FIX.md.

## Automated evidence

569 unit tests pass across164 files. Production build passes. Original source benchmark rerun is included in the release validation folder. Expanded rest scan recovers12/12 known repeated-scale references with0 unmatched suggestions and no quarter-rest mislabels in those crops. Because expanded sensitivity was selected after examining these cases, they are regression/development evidence, not an untouched holdout.

## Required checks before stable v1.0

- [ ] GitHub unit tests, build and deployment pass after uploading every file.
- [ ] Chromium browser suite passes on a host with browser libraries. Local execution was blocked by unavailable Linux libraries; browser download succeeded, dependency installation did not.
- [ ] Every module starts, stops and releases sound/input on navigation; microphone permission denial and device disconnect recover cleanly.
- [ ] MIDI devices reconnect; calibration and physical timing measurements are checked against an independent reference.
- [ ] At60 BPM,2/4 and4/4 bars last two/four seconds; triplet and32nd onsets, ties, pickups, count selection, Stop and Loop sound correct.
- [ ] Mobile layout, keyboard-only navigation, focus visibility, screen-reader labels and long-chart navigation are checked.
- [ ] Production PWA opens offline after caching; lazy modules/PDF worker load; saved data survives an update and the reload prompt.
- [ ] Restore a full safety backup in a separate browser profile and compare charts, settings, libraries, records and history.
- [ ] Validate new independent source pages, especially low-resolution flags, rests and ambiguous cymbals; retain manual review for uncertain cases.

Automatic arbitrary-score transcription, mixed meter/tempo MusicXML, nested repeats, arbitrary tuplets, cloud/community sync and hardware-certified scoring are not claimed by this release. Existing unresolved recognition cases remain in source reports. The candidate consolidates the local app finalization work; stable release depends on the checks above.

## Rc4 playback and review evidence

See `PLAYBACK_ALIGNMENT.md`. Selected counting and actual onsets drive playback visualization. Grace strokes honor the mix. Same-center competing checked identities block draft confirmation. Five complete source bars at four scales yield232 timing references; six72-DPI Highway durations require explicit review. Source regression guards pass; six unmatched suggestions remain. The mobile browser regression is included but local launch is blocked by a missing Linux runtime library. Physical-audio and device checks above remain required.

## Rc5 drummer workspace

See `DRUMMER_SCORE.md` for the combined score/navigation/import/persistence changes and source excerpt.569 unit tests and production build pass; source guards remain passing. The mobile browser regression is updated. Local browser launch remains blocked by missing Linux runtime libraries; no physical audio or offline certification is claimed. Guitar Pro parsing and automatic arbitrary-score transcription are not included.
