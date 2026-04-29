import { create } from 'zustand'
import { chatWithTutor } from '../api/ai'

export const useAIStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  isPanelOpen: false,
  context: null,

  openPanel: (context = null) => set({ isPanelOpen: true, context }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { role, content, id: Date.now() }],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () => set({ messages: [] }),

  sendPrompt: async (text, language = 'python') => {
    const { messages, context, addMessage, setLoading } = get()
    if (!text.trim() || get().isLoading) return

    addMessage('user', text)
    setLoading(true)

    try {
      const payloadMessages = messages.map((m) => ({ role: m.role, content: m.content }))
      payloadMessages.push({ role: 'user', content: text })

      const res = await chatWithTutor({
        messages: payloadMessages,
        language,
        context,
      })
      get().addMessage('assistant', res.data.message)
    } catch {
      get().addMessage('assistant', '⚠️ Sorry, I had trouble connecting. Please try again.')
    } finally {
      get().setLoading(false)
    }
  }
}))
