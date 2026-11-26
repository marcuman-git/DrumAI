import { create } from 'zustand'
import type {
  Achievement,
  PracticeSummary,
  SessionInsight,
  SkillRating,
  TimingHit,
  TrainingModuleId,
} from '../types/drumming'
import { loadState, saveState } from '../services/storage/persistence'

interface AppState {
  activeModule: TrainingModuleId
  summary: PracticeSummary
  skills: SkillRating[]
  hits: TimingHit[]
  achievements: Achievement[]
  insights: SessionInsight[]
  micLevel: number
  setActiveModule: (moduleId: TrainingModuleId) => void
  setMicLevel: (value: number) => void
  addHit: (hit: TimingHit) => void
  clearHits: () => void
  addInsight: (insight: SessionInsight) => void
  hydrate: () => Promise<void>
}

type PersistedState = Pick<
  AppState,
  'activeModule' | 'summary' | 'skills' | 'hits' | 'achievements' | 'insights' | 'micLevel'
>

const initialState: Omit<
  AppState,
  'setActiveModule' | 'addHit' | 'clearHits' | 'addInsight' | 'hydrate' | 'setMicLevel'
> = {
  activeModule: 'dashboard',
  summary: {
    todayGoalMinutes: 20,
    todayCompletedMinutes: 0,
    streakDays: 0,
    weeklyProgressPercent: 0,
    totalPracticeHours: 0,
    timingAccuracy: 0,
    bestBpm: 0,
  },
  skills: [
    { key: 'timing', label: 'Timing', value: 0 },
    { key: 'coordination', label: 'Coordination', value: 0 },
    { key: 'dynamics', label: 'Dynamics', value: 0 },
    { key: 'reading', label: 'Reading', value: 0 },
    { key: 'speed', label: 'Speed', value: 0 },
    { key: 'overall', label: 'Overall', value: 0 },
  ],
  hits: [],
  micLevel: 0,
  achievements: [],
  insights: [],
}

let isHydrated = false

function snapshot(state: AppState): PersistedState {
  return {
    activeModule: state.activeModule,
    summary: state.summary,
    skills: state.skills,
    hits: state.hits,
    achievements: state.achievements,
    insights: state.insights,
    micLevel: state.micLevel,
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  setActiveModule: (activeModule) => {
    set({ activeModule })
    void saveState(snapshot(get()))
  },
  setMicLevel: (micLevel) => {
    set({ micLevel })
  },
  addHit: (hit) => {
    const hits = [...get().hits.slice(-149), hit]
    set({ hits })
    void saveState(snapshot(get()))
  },
  clearHits: () => {
    set({ hits: [] })
    void saveState(snapshot(get()))
  },
  addInsight: (insight) => {
    const insights = [insight, ...get().insights].slice(0, 24)
    set({ insights })
    void saveState(snapshot(get()))
  },
  hydrate: async () => {
    if (isHydrated) return
    isHydrated = true

    const stored = await loadState<PersistedState>()
    if (!stored||!stored.summary||!Object.values(stored.summary).every(value=>typeof value==='number'&&Number.isFinite(value)&&value>=0)||!Array.isArray(stored.skills)||!Array.isArray(stored.hits)||!Array.isArray(stored.achievements)||!Array.isArray(stored.insights)||typeof stored.activeModule!=='string') return

    set({
      activeModule: stored.activeModule,
      summary: stored.summary,
      skills: stored.skills,
      hits: stored.hits,
      achievements: stored.achievements,
      insights: stored.insights,
      micLevel: stored.micLevel,
    })
  },
}))
