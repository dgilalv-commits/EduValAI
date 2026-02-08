
import React, { useState } from 'react';
import { ExamData, Question } from '../types';

interface Props {
  data: ExamData | null;
  setData: (d: ExamData) => void;
  showToast: (m: string, t?: 'success' | 'error') => void;
}

const ExamCreator: React.FC<Props> = ({ data, setData, showToast }) => {
  const [studentName, setStudentName] = useState('');

  const createEmptyExam = () => {
    setData({
      title: "Nuevo Examen",
      subject: "General",
      instructions: "Responde las siguientes preguntas con claridad.",
      questions: [
        { id: `q-${Date.now()}`, text: "Pregunta de ejemplo", type: 'opcion-multiple', points: 1 }
      ]
    });
  };

  if (!data) return (
    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-700">
      <button onClick={createEmptyExam} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">
        ➕ Crear Examen Manualmente
      </button>
    </div>
  );

  const addQuestion = (type: Question['type']) => {
    const newQ: Question = { id: `q-${Date.now()}`, text: "Nueva pregunta...", type, points: 1 };
    setData({ ...data, questions: [...data.questions, newQ] });
  };

  const removeQuestion = (id: string) => {
    setData({ ...data, questions: data.questions.filter(q => q.id !== id) });
  };

  const updateQuestionText = (id: string, text: string) => {
    setData({ ...data, questions: data.questions.map(q => q.id === id ? { ...q, text } : q) });
  };

  const handlePointChange = (id: string, value: number) => {
    const updated = data.questions.map(q => 
      q.id === id ? { ...q, obtainedPoints: value } : q
    );
    setData({ ...data, questions: updated });
  };

  const calculateTotal = () => {
    const obtained = data.questions.reduce((sum, q) => sum + (q.obtainedPoints || 0), 0);
    const totalPossible = data.questions.reduce((sum, q) => sum + q.points, 0);
    return totalPossible > 0 ? ((obtained / totalPossible) * 10).toFixed(2) : "0.00";
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input 
          type="text" 
          value={data.title}
          onChange={(e) => setData({...data, title: e.target.value})}
          className="text-3xl font-bold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 outline-none w-full md:w-auto"
        />
        <button onClick={() => window.print()} className="w-full md:w-auto bg-orange-600 px-6 py-2 rounded-xl font-bold shadow-lg">📄 Imprimir / PDF</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => addQuestion('opcion-multiple')} className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-xs font-bold border border-slate-700">➕ Opción Múltiple</button>
        <button onClick={() => addQuestion('verdadero-falso')} className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-xs font-bold border border-slate-700">➕ V/F</button>
        <button onClick={() => addQuestion('desarrollo')} className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-xs font-bold border border-slate-700">➕ Desarrollo</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Nombre completo del alumno..."
          className="bg-slate-800 border-2 border-slate-700 rounded-xl p-3 focus:border-blue-500 outline-none"
        />
        <div className="bg-slate-800 p-4 rounded-xl text-center border border-blue-500/20 shadow-inner">
          <p className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-widest">Nota Calculada</p>
          <p className="text-4xl font-black text-blue-400">{calculateTotal()} / 10</p>
        </div>
      </div>

      <div id="exam-preview" className="bg-slate-900 text-slate-100 p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-10 print:bg-white print:text-black print:p-0 print:border-none">
        <div className="border-b-2 border-slate-800 pb-6 text-center print:border-black">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{data.title}</h1>
          <textarea 
            value={data.instructions}
            onChange={(e) => setData({...data, instructions: e.target.value})}
            className="w-full bg-transparent border-none text-center focus:ring-0 text-slate-400 italic print:text-slate-700"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 border border-slate-800 p-6 rounded-2xl bg-slate-800/30 print:border-black print:bg-transparent">
          <p className="font-bold">Alumno: <span className="font-normal text-slate-400 print:text-black">{studentName || '______________________'}</span></p>
          <p className="font-bold">Fecha: <span className="font-normal text-slate-400 print:text-black">____/____/________</span></p>
        </div>

        <div className="space-y-10">
          {data.questions.map((q, i) => (
            <div key={q.id} className="relative group space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4 items-start w-full">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                  <textarea 
                    value={q.text}
                    onChange={(e) => updateQuestionText(q.id, e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 font-bold text-lg resize-none print:text-black"
                    rows={2}
                  />
                </div>
                <div className="flex flex-col items-end gap-2 print:hidden">
                  <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-2 border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500">Pts:</span>
                    <input 
                      type="number" 
                      min="0" 
                      max={q.points}
                      step="0.1"
                      className="w-12 bg-transparent text-center text-blue-400 font-bold outline-none"
                      onChange={(e) => handlePointChange(q.id, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <button onClick={() => removeQuestion(q.id)} className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Eliminar</button>
                </div>
              </div>
              
              <div className="pl-12">
                {q.type === 'opcion-multiple' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <div key={opt} className="flex items-center gap-3 text-slate-400 border border-slate-800/50 p-3 rounded-xl print:text-black">
                        <span className="w-6 h-6 border-2 border-slate-700 rounded-full flex items-center justify-center font-bold text-xs">{opt}</span>
                        <input type="text" placeholder={`Opción ${opt}...`} className="bg-transparent border-none focus:ring-0 w-full text-sm" />
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'verdadero-falso' && (
                  <div className="flex gap-8 text-slate-400 font-bold">
                    <div className="flex items-center gap-2 bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-800">Verdadero ( )</div>
                    <div className="flex items-center gap-2 bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-800">Falso ( )</div>
                  </div>
                )}

                {q.type === 'desarrollo' && (
                  <div className="h-32 border-2 border-dashed border-slate-800 w-full rounded-2xl bg-slate-800/10 mt-2 print:border-slate-300"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamCreator;
