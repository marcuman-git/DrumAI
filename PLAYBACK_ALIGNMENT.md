# v1.0.0-rc.4 — playback alignment and combined review improvements

## What was fixed

The supplied Song Practice screenshot shows a yellow cursor on silent internal slot 6 (zero-based slot 5), between the eighth-note counts 2 and 2&. The former cursor advanced through every sixteenth position. This was a confirmed visual mismatch; the screenshot alone cannot establish an extra audible drum strike.

The internal sixteenth clock remains unchanged. Eighth counting now advances the cursor only at eighth counts and actual note onsets. Quarter and Sixteenth use their selected count positions. Real off-count and fractional reviewed notes remain scheduled and visible. Grid highlights mark sounding instruments; empty/muted rows do not look like played notes. The status names scheduled instruments, including hidden rows. Count changes affect upcoming positions without shortening the bar.

Reviewed events remain authoritative: projected grid cells do not add attacks. Tied continuations do not strike again except once when entering the selected section. Grace and main strokes now both honor mute, solo and volume. Previously grace strokes bypassed the instrument mix. Stop and hidden-tab handling retain their cancellation behavior. Count-in is separate and unchanged.

Before playing, open **Review scheduled strokes before playback**. This lists the section's actual attacks, fine onset positions, grace strokes, muted instruments and hidden rows. Source-recognized onsets, grid display and audible scheduling can now be compared explicitly.

## Five improvements delivered together

1. **Duplicate-head protection.** Checked competing instruments at the same physical head center block both grid-draft and reviewed-draft confirmation. Compare the source and exclude the duplicate. **Select distinct heads** offers a conservative, explicit batch selection, lists excluded candidate IDs, and keeps every candidate available for correction. It does not claim to remove every false detection.
2. **Difficult-duration guidance.** Musical timing review displays evidence-based alternatives for dots, differing beam/flag counts and short durations through sixty-fourths. These are review choices, never automatic assignments. Clipped or unresolved evidence still requires explicit values. Outdated unsupported-duration/articulation guidance was corrected.
3. **Faster conversion review.** **Show only conversion issues** filters the source-to-chart comparison to missing, shifted, merged and unassigned heads while retaining source navigation. The playback audit exposes additional/manual/grace attacks before listening.
4. **More complete-bar evidence.** Added visually labelled Highway to Hell source-bar checks at 72,108,144 and216 DPI. The combined timing benchmark now covers five bars at four scales:232 repeated-scale head references across20 cases. Six Highway durations at72 DPI require explicit reviewed values; that case is automatically blocked, then resolves with those choices. The other19 cases resolve automatically with the existing benchmark inputs. Source identities are manual benchmark mappings; these results do not establish automatic instrument accuracy. Six unmatched suggestions remain reported across the complete-bar cases.
5. **Playback and mobile verification.** Deterministic tests verify the screenshot's twelve strokes, eight half-second hi-hat intervals at60 BPM, four-second bar completion, silent slots, off-count/fractional onsets, authoritative imported events, mute/grace behavior, Stop and hidden instruments. The mobile grid is a labelled keyboard-focusable scrolling region. A mobile browser regression checks eighth labels, the grid and the twelve-stroke audit. Existing microphone/MIDI calibration, persistence and offline regression tests remain included in the full suite; physical device and offline-browser certification remain pending.

## Validation

- 561 unit tests pass across161 files.
- Production TypeScript/Vite build passes.
- Source recognition benchmark passes its regression guards. Full results and a five-example source/notation viewer accompany the release.
- Source lint:0 errors,32 existing warnings. The workspace directory was skipped by the local linter, so validation used an exact source copy and the app's unchanged lint configuration in a temporary directory.
- Browser tests could not launch locally: Chromium requires the unavailable `libatk-1.0.so.0` runtime library. Browser download succeeded. Run the included suite in GitHub/on a supported host. No physical listening, microphone/MIDI latency or production offline verification is claimed.

## Install and check

Upload the complete rc4 file set over the complete rc3 baseline, preserving repository-relative paths. Install the changed package files together. No dependency additions, chart-schema changes or workflow changes. Validation artifacts are for review, not app-source upload.

1. Open the screenshot's basic groove at60 BPM, Count labels Eighth, Count-in Off. Expect eight hi-hats, two snares and two kicks across four seconds. The silent position between2 and2& must not gain a new highlight or drum stroke.
2. Switch count labels during playback. Real notes retain their times; count labels never create drum sounds. Try a true off-count reviewed onset.
3. Open the scheduled-stroke audit. Compare hidden rows and grace strokes against the source. Mute a voice containing a grace stroke; both grace and main must be silent.
4. Reanalyze the source, inspect duplicates/uncertainty, confirm durations, create a new reviewed chart, and compare its scheduled attacks. Save/load and JSON/MusicXML round trips retain reviewed timing.
5. Test Loop, selected sections, pickups, ties, Count-in and Stop. Run mobile/keyboard, microphone/MIDI calibration and offline checks on your devices. If an unexpected sound remains, identify the scheduled instrument and slot from the status/audit so the exact source event can be traced.
