
import React, { useState } from 'react';

interface Props {
  data: any | null;
  setData: (d: any) => void;
  showToast: (m: string, t?: 'success' | 'error') => void;
}

const EscalaCreator: React.FC<Props> = ({ data, setData, showToast }) => {
  const [studentName, setStudentName] = useState('');

  const createEmpty = () => {
    setData({
      title: "Nueva Escala de Valoración",
      items: [
        { id: `e-${Date.now()}`, text: "Indicador de logro 1", value: 0 }
      ]
    });
  };

  if (!data) return (
    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-700">
      <button onClick={createEmpty} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all">
        ➕ Crear Escala Manualmente
      </button>
    </div>
  );

  const handleRating = (id: string, val: number) => {
    setData({
      ...data,
      items: data.items.map((it: any) => it.id === id ? { ...it, value: val } : it)
    });
  };

  const calculateTotal = () => {
    const sum = data.items.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
    const max = data.items.length * 5;
    return max > 0 ? ((sum / max) * 10).toFixed(2) : "0.00";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input 
          type="text" 
          value={data.title}
          onChange={(e) => setData({...data, title: e.target.value})}
          className="text-3xl font-bold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 outline-none w-full md:w-auto text-white"
        />
        <button onClick={() => window.print()} className="w-full md:w-auto bg-orange-600 px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-orange-500 transition-colors">📄 PDF / Imprimir</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alumno</label>
          <input 
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Nombre del alumno..."
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-4 focus:border-blue-500 outline-none text-white"
          />
        </div>
        <div className="bg-slate-900 border border-blue-500/20 p-6 rounded-2xl flex flex-col justify-center items-center">
          <span className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-1">Nota Final</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white">{calculateTotal()}</span>
            <span className="text-xl text-slate-500">/ 10</span>
          </div>
        </div>
      </div>

      <div id="escala-preview" className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="p-4 text-left text-slate-300">Indicador de Desempeño</th>
                {[1,2,3,4,5].map(n => (
                  <th key={n} className="p-4 text-center text-slate-300">{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.map((item: any) => (
                <tr key={item.id} className="border-t border-slate-800 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-slate-200 font-medium">{item.text}</td>
                  {[1,2,3,4,5].map(n => (
                    <td key={n} className="p-4 text-center">
                      <button 
                        onClick={() => handleRating(item.id, n)}
                        className={`w-10 h-10 rounded-full font-bold transition-all ${item.value === n ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-900' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                      >
                        {n}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800">
           <p className="text-xs text-slate-500 font-medium"><strong>Leyenda:</strong> 1: Insuficiente | 2: Suficiente | 3: Bueno | 4: Muy Bueno | 5: Excelente</p>
        </div>
      </div>
    </div>
  );
};

export default EscalaCreator;
