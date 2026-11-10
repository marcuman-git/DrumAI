// User-supplied Master Drum Key. Positions and glyphs are publisher-dependent.
export const DRUM_KEY_REFERENCE = [
  { group: 'Drums', items: 'Bass 1/2, Floor tom 1/2, Tom 1/2/3, Snare, additional toms', status: 'Kick/Kick 2, Snare, five floor/rack tom rows are supported. Additional tom voices are planned. GM middle-tom variants share Tom 2.' },
  { group: 'Cymbals', items: 'Hi-hat foot, Ride, Ride bell, Hi-hat, Crash 1/2, Splash, China', status: 'Closed/open hi-hat, pedal hi-hat, Crash and Ride are supported. Distinct bell/extra cymbal voices are planned.' },
  { group: 'Drum modifiers', items: 'Cross-stick, Ghost, Accent, Marcato, Flam, Drag, Rimshot', status: 'Ghost/accent cells are supported. Other chart modifiers require future event-level notation.' },
  { group: 'Extras', items: 'Click sticks, Rim, Electronic pad, Tambourine, Cowbell', status: 'Dedicated chart voices and symbol recognition are planned.' },
  { group: 'Cymbal and hi-hat modifiers', items: 'Crash ride, tip, bell, choke, let ring; splash/loose/open/closed/open-close hi-hat', status: 'Articulations are not automatically recognized or reproduced yet.' },
  { group: 'Section modifiers and rolls', items: 'Fixed tension, loosen hi-hat; open/buzz/crushed rolls, speed changes, crescendo/drop-away rolls', status: 'Section/event metadata and roll-specific rendering/playback are planned.' },
] as const
