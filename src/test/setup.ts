import '@testing-library/jest-dom/vitest'

import {beforeEach} from 'vitest'
beforeEach(()=>{localStorage.removeItem('drummaster-song-practice-workspace-v1');localStorage.removeItem('drummaster-song-practice-views-v1')})
