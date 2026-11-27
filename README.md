# rc1 upload repair

These are exact files from v1.0.0-rc.1, without rc2/rc3 changes. Replace files at their repository-relative destinations.

1. tests/e2e/smoke.spec.ts — expects the rc1 app heading.
2. src/features/song-practice/rhythmTypes.ts — includes articulation, grace and fine duration fields used by rc1.
3. package.json — rc1 metadata.
4. package-lock.json — matching rc1 metadata.

The original rc1 ZIP was checked:all59 upload files are present and match their individually supplied files. The uploaded repository logs still show the old BETA heading expectation, an older RhythmEvent declaration and package version0.0.0. If other files are missing, upload the complete rc1 set.

After replacing and committing all files, start new full test/build and Pages workflow runs on that updated commit. Rerunning an older failed workflow still checks its original commit and will not pick up later uploads. Pages requires a successful Build frontend and Upload artifact step in the same workflow run before Deploy. Rerunning only deployment cannot create a missing artifact. The punycode message is a warning, not the cause of failure.
