import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getInsight, type InsightData } from '@/services/aiService'

export const useInsight = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()
  const isRequestPending = useRef(false)
  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id)

    if (simulation?.insight) {
      return simulation.insight
    }

    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // useCallback é necessário pois essa função entra no array de dependências do useEffect
  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        setInsight(data)

        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord)

        return data
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        const normalizedError = errorMessage.toUpperCase()

        if (
          normalizedError.includes('429') ||
          normalizedError.includes('QUOTA') ||
          normalizedError.includes('RESOURCE_EXHAUSTED')
        ) {
          setError(
            'Limite de consultas temporariamente atingido. Por favor, aguarde cerca de 1 minuto e tente novamente.',
          )
        } else if (
          normalizedError.includes('503') ||
          normalizedError.includes('UNAVAILABLE')
        ) {
          setError(
            'O serviço de inteligência artificial está temporariamente ocupado. Tente novamente em instantes.',
          )
        } else {
          setError(
            'Não foi possível gerar o diagnóstico financeiro no momento. Tente novamente.',
          )
        }
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  useEffect(() => {
    // Evita loop infinito de requisições para a API do Gemini
    if (insight || isLoading || isRequestPending.current || error) {
      return
    }

    fetchInsight(id).then((data) => {
      isRequestPending.current = false
      if (!data) {
        return
      }

      setInsight(data)
    })
  }, [id, insight, isLoading, error, fetchInsight])

  return { insight, isLoading, error, fetchInsight }
}
