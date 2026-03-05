import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const next = state.theme === 'dark' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', next)
        return { theme: next }
      }),
      initTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
      }
    }),
    { name: 'prepulse-theme' }
  )
)

export default useThemeStore
