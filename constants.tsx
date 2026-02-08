
import React from 'react';
import { InstrumentType } from './types';

export const COLORS = {
  primary: '#2D5BFF',
  primaryDark: '#1A3FCC',
  secondary: '#FF6B35',
  accent: '#FFB800',
  success: '#00D9A3',
  bgMain: '#0A0E27',
  bgCard: '#141B3A',
  bgInput: '#1C2547',
  textPrimary: '#FFFFFF',
  textSecondary: '#A5B4FC',
  border: '#2D3A66',
};

export const INSTRUMENTS_CONFIG = [
  { id: InstrumentType.RUBRICA, name: 'Rúbrica', icon: '📊' },
  { id: InstrumentType.LISTA_COTEJO, name: 'Lista de Cotejo', icon: '✅' },
  { id: InstrumentType.ESCALA, name: 'Escala de Valoración', icon: '📈' },
  { id: InstrumentType.GUIA_OBSERVACION, name: 'Guía de Observación', icon: '👁️' },
  { id: InstrumentType.EXAMEN, name: 'Examen', icon: '📝' },
];

export const EDUCATIONAL_LEVELS = [
  "1º ESO", "2º ESO", "3º ESO", "4º ESO", "1º Bachillerato", "2º Bachillerato"
];

export const SUBJECTS = [
  "Matemáticas", "Lengua y Literatura", "Ciencias Naturales", "Física", "Química", 
  "Biología", "Geografía e Historia", "Inglés", "Tecnología", "Educación Física", "Artes"
];
