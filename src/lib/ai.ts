import OpenAI from 'openai';

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function askJSON<T>(prompt: string, fallback: T): Promise<T> {
  if (!client) return fallback;
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Devuelve siempre JSON válido y estructurado.' },
      { role: 'user', content: prompt }
    ]
  });

  try {
    return JSON.parse(response.choices[0]?.message?.content || '{}') as T;
  } catch {
    return fallback;
  }
}

export async function extractBases(text: string) {
  return askJSON(
    `Extrae objeto, requisitos y criterios potenciales del siguiente texto: ${text.slice(0, 10000)}. Formato: {"objeto":"", "requisitos":[], "criterios":[]}`,
    { objeto: '', requisitos: [], criterios: [] as string[] }
  );
}

export async function extractCriterios(text: string) {
  const parsed = await askJSON<{ criterios: Array<{ nombre: string; descripcion: string; puntuacionMaxima: number }> }>(
    `Extrae criterios de valoración y devuelve: {"criterios": [{"nombre":"", "descripcion":"", "puntuacionMaxima": 0}]}. Texto: ${text.slice(0, 10000)}`,
    { criterios: [] }
  );

  return parsed.criterios;
}

export async function generateInforme(input: {
  convocatoria: string;
  criterios: Array<{ nombre: string; max: number; puntuacion: number; comentario?: string | null }>;
  entidad: string;
}) {
  if (!client) {
    return `Informe técnico (modo fallback)\nEntidad: ${input.entidad}\nConvocatoria: ${input.convocatoria}\n\nConclusión: evaluación completada.`;
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Redacta informe técnico formal con Resumen, Evaluación por criterio, Justificación técnica y Conclusión final.'
      },
      {
        role: 'user',
        content: JSON.stringify(input)
      }
    ]
  });

  return response.choices[0]?.message?.content ?? 'No se pudo generar informe';
}
