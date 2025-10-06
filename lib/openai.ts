const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

if (!OPENAI_API_KEY) {
  // We keep this soft to not crash build; runtime routes will validate
}

export async function moderateInput(text: string) {
  const resp = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'omni-moderation-latest',
      input: text
    })
  })

  if (!resp.ok) {
    return { flagged: false }
  }

  const data = await resp.json()
  const result = data?.results?.[0]
  return { flagged: Boolean(result?.flagged), categories: result?.categories }
}

export async function getResponseFromOpenAI(input: string, temperature = 0.7) {
  const resp = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input,
      temperature
    })
  })

  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`OpenAI error: ${resp.status} ${errText}`)
  }

  const data = await resp.json()
  // Try output_text convenience, else drill into output structure
  const direct = data?.output_text
  if (typeof direct === 'string' && direct.trim().length > 0) return direct

  const output = data?.output || data?.choices
  if (Array.isArray(output) && output.length > 0) {
    const first = output[0]
    const content = first?.content
    if (Array.isArray(content) && content.length > 0) {
      const textItem = content.find((c: any) => c?.type === 'output_text' || c?.text)
      if (textItem?.text) return textItem.text
    }
  }

  // Fallback to stringify
  return typeof data === 'string' ? data : JSON.stringify(data)
}
