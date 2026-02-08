
import React, { useState } from 'react';

interface Props {
  data: any | null;
  setData: (d: any) => void;
  showToast: (m: string, t?: 'success' | 'error') => void;
}

const GuiaObservacionCreator: React.FC<Props> = ({ data, setData, showToast }) => {
  const [sessionInfo, setSessionInfo] = useState({ teacher: '', group: '', date: '' });

  const createEmpty = () => {
    setData({
      title: "Nueva Guía de Observación",
      aspects: [
        { 
          id: `g-${Date.now()}`, 
          indicator: "Participación en clase", 
          description: "Observar la frecuencia y calidad de las intervenciones.", 
          examples: "El alumno levanta la mano, respeta el turno de palabra, aporta ideas relacionadas con el tema actual.",
          notes: "" 
        }
      ]
    });
  };

  if (!data) return (
    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-700">
      <button onClick={createEmpty} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">
        ➕ Crear Guía Manualmente
      </button>
    </div>
  );

  const updateNotes = (id: string, notes: string) => {
    setData({
      ...data,
      aspects: data.aspects.map((a: any) => a.id === id ? { ...a, notes } : a)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input 
          type="text" 
          value={data.title}
          onChange={(e) => setData({...data, title: e.target.value})}
          className="text-3xl font-bold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 outline-none w-full md:w-auto text-white"
        />
        <button onClick={() => window.print()} className="w-full md:w-auto bg-orange-600 px-6 py-2 rounded-xl font-bold shadow-lg">📄 Exportar PDF</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Docente</label>
          <input 
            type="text"
            placeholder="Nombre del docente..."
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Grupo/Grado</label>
          <input 
            type="text"
            placeholder="Ej: 3º B..."
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
          <input 
            type="date"
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div id="guia-preview" className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-xl font-black text-blue-400 uppercase tracking-tighter">Instrumento de Observación Directa</h2>
        </div>

        <div className="space-y-10">
          {data.aspects.map((aspect: any, i: number) => (
            <div key={aspect.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center font-bold text-blue-400 border border-blue-500/20 flex-shrink-0">{i+1}</span>
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-xl">{aspect.indicator}</h4>
                    <p className="text-slate-400 text-sm mt-1">{aspect.description}</p>
                  </div>
                  
                  {/* Sección de Ejemplos Específicos */}
                  {aspect.examples && (
                    <div className="bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded-r-xl">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Evidencias a observar (Ejemplos):</p>
                      <p className="text-slate-300 text-xs italic leading-relaxed">{aspect.examples}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Registro de Evidencias / Notas de Campo</label>
                    <textarea 
                      placeholder="Escribe aquí lo observado en el aula..."
                      value={aspect.notes || ""}
                      onChange={(e) => updateNotes(aspect.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-200 focus:border-blue-600 outline-none min-h-[140px] transition-all shadow-inner placeholder:text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuiaObservacionCreator;
