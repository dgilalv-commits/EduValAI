
import React, { useState } from 'react';
import { RubricData, RubricCriterion } from '../types';

interface Props {
  data: RubricData | null;
  setData: (d: RubricData) => void;
  showToast: (m: string, t?: 'success' | 'error') => void;
}

const RubricCreator: React.FC<Props> = ({ data, setData, showToast }) => {
  const [studentName, setStudentName] = useState('');
  
  const createEmptyRubric = () => {
    setData({
      title: "Nueva Rúbrica",
      subject: "General",
      description: "",
      level: "Cualquiera",
      criteria: [
        { id: `c-${Date.now()}`, name: "Nuevo Criterio", weight: 20, levels: { 4: "Excelente", 3: "Bueno", 2: "Suficiente", 1: "Mejorable" } }
      ]
    });
  };

  if (!data) {
    return (
      <div className="text-center py-20 bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-700">
        <p className="text-slate-400 mb-6 text-lg">No hay ninguna rúbrica activa.</p>
        <button 
          onClick={createEmptyRubric}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg"
        >
          ➕ Crear Rúbrica Manualmente
        </button>
      </div>
    );
  }

  const handleLevelSelect = (critId: string, level: number) => {
    const updatedCriteria = data.criteria.map(c => 
      c.id === critId ? { ...c, selectedLevel: level } : c
    );
    setData({ ...data, criteria: updatedCriteria });
  };

  const addCriterion = () => {
    const newCrit: RubricCriterion = {
      id: `c-${Date.now()}`,
      name: "Nuevo Criterio",
      weight: 10,
      levels: { 4: "Nivel 4", 3: "Nivel 3", 2: "Nivel 2", 1: "Nivel 1" }
    };
    setData({ ...data, criteria: [...data.criteria, newCrit] });
  };

  const removeCriterion = (id: string) => {
    setData({ ...data, criteria: data.criteria.filter(c => c.id !== id) });
  };

  const updateCriterion = (id: string, field: string, value: any) => {
    setData({
      ...data,
      criteria: data.criteria.map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  const updateLevelDescription = (critId: string, level: number, text: string) => {
    setData({
      ...data,
      criteria: data.criteria.map(c => 
        c.id === critId ? { ...c, levels: { ...c.levels, [level]: text } } : c
      )
    });
  };

  const calculateFinalScore = () => {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    data.criteria.forEach(c => {
      if (c.selectedLevel) {
        const scorePerLevel = (c.selectedLevel / 4) * 10;
        totalWeightedScore += (scorePerLevel * (c.weight / 100));
        totalWeight += c.weight;
      }
    });
    return totalWeight > 0 ? totalWeightedScore.toFixed(2) : "-";
  };

  const exportToPdf = () => {
    const element = document.getElementById('rubric-preview');
    if (!element) return;
    const opt = {
      margin: 10,
      filename: `Rubrica_${data.title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#0f172a' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
    showToast("Descargando PDF con estilo oscuro...");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <input 
          type="text" 
          value={data.title}
          onChange={(e) => setData({...data, title: e.target.value})}
          className="text-3xl font-bold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 outline-none w-full md:w-auto"
        />
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={addCriterion} className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-semibold border border-slate-700">
            ➕ Añadir Criterio
          </button>
          <button onClick={exportToPdf} className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg">
            📄 PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre del Alumno/a</label>
            <input 
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Escribe el nombre aquí..."
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-3 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>
        <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-center items-center shadow-inner">
          <span className="text-blue-400 text-xs uppercase font-bold tracking-widest mb-1">Nota Final (0-10)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white">{calculateFinalScore()}</span>
            <span className="text-xl text-blue-500/50 font-bold">/ 10</span>
          </div>
        </div>
      </div>

      <div id="rubric-preview" className="bg-slate-900 text-slate-100 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-6 text-center md:text-left">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">{data.title || 'Sin Título'}</h3>
          <div className="flex flex-wrap gap-4 mt-2 text-slate-400 text-sm font-medium">
            <span><strong>Materia:</strong> {data.subject}</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span><strong>Nivel:</strong> {data.level}</span>
          </div>
          {studentName && <p className="mt-4 text-xl font-semibold text-blue-400">Alumno: {studentName}</p>}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-800/50 text-slate-300">
                <th className="p-4 text-left border-r border-slate-800 w-1/4">Criterio y Peso</th>
                <th className="p-4 text-center border-r border-slate-800">Excelente (4)</th>
                <th className="p-4 text-center border-r border-slate-800">Bueno (3)</th>
                <th className="p-4 text-center border-r border-slate-800">Suficiente (2)</th>
                <th className="p-4 text-center">Mejorable (1)</th>
              </tr>
            </thead>
            <tbody>
              {data.criteria.map((crit) => (
                <tr key={crit.id} className="border-t border-slate-800 group">
                  <td className="p-4 bg-slate-800/20 border-r border-slate-800 relative">
                    <input 
                      type="text" 
                      value={crit.name}
                      onChange={(e) => updateCriterion(crit.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-white mb-1"
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={crit.weight}
                        onChange={(e) => updateCriterion(crit.id, 'weight', parseInt(e.target.value) || 0)}
                        className="w-12 bg-slate-900 border border-slate-700 rounded text-xs p-1 text-blue-400 font-mono"
                      />
                      <span className="text-[10px] text-slate-500 font-bold">%</span>
                    </div>
                    <button 
                      onClick={() => removeCriterion(crit.id)}
                      className="absolute -left-2 top-1/2 -translate-y-1/2 bg-red-500/80 hover:bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </td>
                  {[4, 3, 2, 1].map((level) => (
                    <td 
                      key={level}
                      onClick={() => handleLevelSelect(crit.id, level)}
                      className={`p-4 border-r border-slate-800 cursor-pointer transition-all ${crit.selectedLevel === level ? 'bg-blue-600/40 border-blue-500/50 ring-2 ring-blue-500/20' : 'hover:bg-slate-800/50'}`}
                    >
                      <textarea 
                        value={crit.levels[level]}
                        onChange={(e) => updateLevelDescription(crit.id, level, e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 text-xs resize-none h-16 text-slate-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RubricCreator;
