
import { GoogleGenAI, Type } from "@google/genai";
import { InstrumentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateInstrument = async (type: InstrumentType, params: { level: string, subject: string, topic: string }) => {
  const { level, subject, topic } = params;
  
  let prompt = "";
  let schema: any = {};

  if (type === InstrumentType.RUBRICA) {
    prompt = `Eres un experto pedagogo. Genera una rúbrica analítica para evaluar: ${topic} en la asignatura de ${subject} para el nivel ${level}. 
    Incluye entre 4 y 6 criterios con 4 niveles (Excelente, Bueno, Satisfactorio, Necesita Mejorar). 
    La suma de los pesos de los criterios debe ser exactamente 100.`;
    
    schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        criteria: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              weight: { type: Type.NUMBER },
              levels: {
                type: Type.OBJECT,
                properties: {
                  4: { type: Type.STRING },
                  3: { type: Type.STRING },
                  2: { type: Type.STRING },
                  1: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    };
  } else if (type === InstrumentType.LISTA_COTEJO) {
    prompt = `Genera una lista de cotejo (Checklist) para evaluar ${topic} en ${subject} para ${level}. Incluye 10 indicadores claros y observables que se puedan marcar como Sí/No.`;
    
    schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    };
  } else if (type === InstrumentType.ESCALA) {
    prompt = `Genera una Escala de Valoración (Rating Scale) numérica (1 al 5) para evaluar ${topic} en ${subject} para el nivel ${level}. Incluye 8-10 indicadores de desempeño específicos.`;
    
    schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    };
  } else if (type === InstrumentType.GUIA_OBSERVACION) {
    prompt = `Genera una Guía de Observación profesional para el docente sobre el tema "${topic}" en "${subject}" para "${level}". 
    Para cada uno de los 6 aspectos fundamentales, proporciona:
    1. Un indicador claro.
    2. Una descripción pedagógica.
    3. Ejemplos específicos y concretos de conductas, comentarios o evidencias que el docente debería buscar durante la observación.`;
    
    schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        aspects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              indicator: { type: Type.STRING },
              description: { type: Type.STRING },
              examples: { type: Type.STRING, description: "Ejemplos específicos de conductas o evidencias a observar." }
            }
          }
        }
      }
    };
  } else if (type === InstrumentType.EXAMEN) {
    prompt = `Genera un examen estructurado sobre ${topic} para ${subject} (${level}). Incluye 10 preguntas variadas (opción múltiple, V/F y desarrollo).`;
    
    schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        instructions: { type: Type.STRING },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['opcion-multiple', 'verdadero-falso', 'desarrollo'] },
              points: { type: Type.NUMBER }
            }
          }
        }
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
