import { AiError, type ProviderResult } from '../types'
import { MAX_OUTPUT_TOKENS } from '../defaults'
import {
  mergeConsecutive,
  normalizeUsage,
  providerHttpError,
  toNetworkError,
  type ProviderArgs,
} from './shared'

// Automatically route to Groq if the apiKey starts with 'gsk_', otherwise use OpenAI
function getApiEndpoint(apiKey: string): string {
  if (apiKey.startsWith('gsk_')) {
    return 'https://api.groq.com/openai/v1/chat/completions'
  }
  return 'https://api.openai.com/v1/chat/completions'
}

interface OpenAiResponse {
  choices?: { message?: { content?: string } }[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

/**
 * Call OpenAI / Groq Chat Completions endpoint with the caller's own key.
 * Returns the raw assistant text + token usage.
 */
export async function generateOpenAi(args: ProviderArgs): Promise<ProviderResult> {
  const { apiKey, model, systemPrompt, messages, timeoutMs } = args
  const isGroq = apiKey.startsWith('gsk_')
  const endpoint = getApiEndpoint(apiKey)
  const providerName = isGroq ? 'Groq' : 'OpenAI'

  // Model fallback logic
  let effectiveModel = model || (isGroq ? 'openai/gpt-oss-120b' : 'gpt-4o-mini')

  if (isGroq && (effectiveModel.startsWith('gpt-4') || effectiveModel.startsWith('gpt-3.5'))) {
    effectiveModel = 'openai/gpt-oss-120b'
  }

  let res: Response
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: effectiveModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...mergeConsecutive(messages),
        ],
        // Groq uses max_tokens instead of max_completion_tokens
        ...(isGroq
          ? { max_tokens: MAX_OUTPUT_TOKENS }
          : { max_completion_tokens: MAX_OUTPUT_TOKENS }),
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (err) {
    throw toNetworkError(err)
  }

  if (!res.ok) {
    throw await providerHttpError(providerName, res)
  }

  const data = (await res.json().catch(() => null)) as OpenAiResponse | null
  const text = data?.choices?.[0]?.message?.content
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new AiError(`${providerName} returned an empty response.`, {
      code: 'empty_response',
    })
  }
  const usage = normalizeUsage({
    prompt: data?.usage?.prompt_tokens,
    completion: data?.usage?.completion_tokens,
    total: data?.usage?.total_tokens,
  })
  return { text, usage }
}