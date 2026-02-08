
import React, { useState } from 'react';
import { ChecklistData, ChecklistItem } from '../types';

interface Props {
  data: ChecklistData | null;
  setData: (d: ChecklistData) => void;
  showToast: (m: string, t?: 'success' | 'error') => void;
}

const ChecklistCreator: React.FC<Props> = ({ data, setData, showToast }) => {
  const [studentName, setStudentName] = useState('');
  const [newItemText, setNewItemText] = useState('');

  const createEmptyChecklist = () => {
    setData({
      title: "Nueva Lista de Cotejo",
      subject: "General",
      level: "Cualquiera",
      items: [
        { id: `i-${Date.now()}`, text: "Primer indicador observable", checked: false }
      ]
    });
  };

  if (!data) return (
    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-700">
      <button onClick={createEmptyChecklist} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">
        ➕ Crear Lista de Cotejo Manual
      </button>
    </div>
  );

  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = { id: `i-${Date.now()}`, text: newItemText, checked: false };
    setData({ ...data, items: [...data.items, newItem] });
    setNewItemText('');
  };

  const removeItem = (id: string) => {
    setData({ ...data, items: data.items.filter(it => it.id !== id) });
  };

  const updateItemText = (id: string, text: string) => {
    setData({ ...data, items: data.items.map(it => it.id === id ? { ...it, text } : it) });
  };

  const toggleItem = (id: string) => {
    setData({ ...data, items: data.items.map(it => it.id === id ? { ...it, checked: !it.checked } : it) });
  };

  const calculateScore = () => {
    const checked = data.items.filter(it => it.checked).length;
    return data.items.length > 0 ? ((checked / data.items.length) * 10).toFixed(2) : "0.00";
  };

  const exportToPdf = () => {
    const element = document.getElementById('checklist-preview');
    // @ts-ignore
    window.html2pdf().from(element).set({
        margin: 10,
        filename: `Lista_${data.title}.pdf`,
        html2canvas: { scale: 2, backgroundColor: '#0f172a' }
    }).save();
    showToast("Descargando PDF...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input 
          type="text" 
          value={data.title}
          onChange={(e) => setData({...data, title: e.target.value})}
          className="text-3xl font-bold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 outline-none w-full md:w-auto"
        />
        <button onClick={exportToPdf} className="w-full md:w-auto bg-orange-600 px-6 py-2 rounded-xl font-bold shadow-lg">📄 PDF</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Estudiante..."
          className="bg-slate-800 border-2 border-slate-700 rounded-xl p-3 focus:border-blue-500 outline-none"
        />
        <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-blue-500/20">
          <span className="font-bold text-slate-400">Puntuación:</span>
          <span className="text-3xl font-black text-blue-400">{calculateScore()} / 10</span>
        </div>
      </div>

      <form onSubmit={addItem} className="flex gap-2">
        <input 
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Añadir nuevo indicador..."
          className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-xl p-3 focus:border-blue-500 outline-none"
        />
        <button type="submit" className="bg-blue-600 px-6 rounded-xl font-bold">Añadir</button>
      </form>

      <div id="checklist-preview" className="bg-slate-900 text-slate-100 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2">{data.title}</h3>
        <div className="space-y-3">
          {data.items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-4 p-4 bg-slate-800/40 border border-slate-800 rounded-2xl group transition-all hover:bg-slate-800"
            >
              <div 
                onClick={() => toggleItem(item.id)}
                className={`w-7 h-7 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all ${item.checked ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-900/40' : 'border-slate-600 hover:border-blue-500'}`}
              >
                {item.checked && <span className="text-white font-bold">✓</span>}
              </div>
              <input 
                type="text"
                value={item.text}
                onChange={(e) => updateItemText(item.id, e.target.value)}
                className={`flex-1 bg-transparent border-none focus:ring-0 text-sm ${item.checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}
              />
              <button 
                onClick={() => removeItem(item.id)}
                className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChecklistCreator;
