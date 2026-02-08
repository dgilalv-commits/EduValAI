
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
                  4: { type: Type.STRING, description: 'Excelente' },
                  3: { type: Type.STRING, description: 'Bueno' },
                  2: { type: Type.STRING, description: 'Satisfactorio' },
                  1: { type: Type.STRING, description: 'Necesita mejorar' }
                }
              }
            }
          }
        }
      }
    };
  } else if (type === InstrumentType.LISTA_COTEJO) {
    prompt = `Genera una lista de cotejo (Checklist) para evaluar ${topic} en ${subject} para ${level}. 
    Incluye 10 indicadores claros y observables.`;
    
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
  } else if (type === InstrumentType.EXAMEN) {
    prompt = `Genera un examen estructurado sobre ${topic} para ${subject} (${level}). 
    Incluye 10 preguntas variadas (opción múltiple, V/F y desarrollo). 
    Asigna puntos a cada pregunta que sumen un total de 10 o el valor que consideres, pero indica los puntos claramente.`;
    
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
  } else {
      // Fallback simple for other types
      prompt = `Genera un instrumento de evaluación de tipo ${type} para ${topic} en ${subject} (${level}).`;
      schema = { type: Type.OBJECT, properties: { title: { type: Type.STRING }, items: { type: Type.ARRAY, items: { type: Type.STRING } } } };
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
