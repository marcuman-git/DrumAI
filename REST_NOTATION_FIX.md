# v1.0.0-rc.3 — correct the highlighted nonexistent rests

The supplied screenshot highlights rests introduced by our preview, not additional detected noteheads. The timing model fills inactive snare/kick intervals to validate each instrument's bar coverage. Drawing every such interval as a source symbol added dotted/quarter/eighth rests absent from the original hi-hat groove.

The staff now derives shared silence from the union of all note durations and draws it once. An inactive instrument does not add a rest while another instrument plays or continues. Explicitly reviewed or source-anchored rests remain visible, including independent-voice rests. Notes, timing, ties and playback scheduling are preserved.

New gap fills retain restOrigin=gap; accepted source rest hints and manually added source rests use restOrigin=explicit. Saves retain this distinction. MusicXML preserves explicit/hidden intent through print-object=yes/no. Unmarked legacy coverage rests are aggregated; if a legacy or imported rest genuinely appears alongside another voice in the source, enable **Show explicitly reviewed rest on staff** for that event. Changing visibility retains its source anchor.

Older charts and drafts gain the corrected display without reanalysis. Select the same Back in Black example: the continuous eight-eighth hi-hat groove retains eight hi-hat, two snare and two kick heads, with no added rest glyphs. The known Feel Good mixed bar retains its true eighth rest at slot9. Filtering instruments does not invent silence while hidden notes still play.

Validation:548 unit tests across158 files and production build pass. Whole-bar source checks retain184 correct onset/duration pairs across16 rendering-scale cases. Staff-rest checks expect no rests in the Back in Black, intro and verse examples, and exactly one eighth rest in the mixed source example at every tested scale. The source-versus-notation viewer is regenerated with the fix. These are covered regression cases, not proof of arbitrary-source recognition accuracy.

Upload the entire update over v1.0.0-rc.2, then run CI/build/deployment. No dependencies or workflow changes. Check the corrected source comparison and your existing saved chart; verify actual source rests and playback. Browser/device/listening validation remains a release check.
