interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
    finishReason?: string
  }[]
  promptFeedback?: {
    blockReason?: string
  }
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL_NAME = 'gemini-1.5-flash'

const getGeminiUrl = () => {
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY não foi configurada.')
  }

  return `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`
}

const callGeminiAPI = async (prompt: string) => {
  const response = await fetch(getGeminiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `Erro na requisição: ${response.status}${errorBody ? ` - ${errorBody}` : ''}`,
    )
  }

  return (await response.json()) as GeminiResponse
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: { content: string }
  suggestions: { items: string[] }
  extraIncome: { items: string[] }
  investment: { items: string[] }
  motivation: { content: string }
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  const candidate = response.candidates?.[0]
  const text = candidate?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('')

  if (!text) {
    const reason =
      response.promptFeedback?.blockReason ?? candidate?.finishReason
    throw new Error(
      `A Gemini não retornou conteúdo${reason ? `: ${reason}` : '.'}`,
    )
  }

  const json = text.replace(/^```(?:json)?\s*|\s*```$/gi, '').trim()
  return JSON.parse(json) as InsightData
}
