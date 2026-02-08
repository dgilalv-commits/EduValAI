
import React, { useState, useEffect } from 'react';
import { InstrumentType, RubricData, ChecklistData, ExamData } from './types';
import { INSTRUMENTS_CONFIG, COLORS, EDUCATIONAL_LEVELS, SUBJECTS } from './constants';
import { generateInstrument } from './services/geminiService';

// Individual Generator Components
import RubricCreator from './components/RubricCreator';
import ChecklistCreator from './components/ChecklistCreator';
import ExamCreator from './components/ExamCreator';
import EscalaCreator from './components/EscalaCreator';
import GuiaObservacionCreator from './components/GuiaObservacionCreator';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InstrumentType>(InstrumentType.RUBRICA);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Forms state
  const [aiConfig, setAiConfig] = useState({ level: '', subject: '', topic: '' });
  const [rubricData, setRubricData] = useState<RubricData | null>(null);
  const [checklistData, setChecklistData] = useState<ChecklistData | null>(null);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [escalaData, setEscalaData] = useState<any | null>(null);
  const [guiaData, setGuiaData] = useState<any | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAiGenerate = async () => {
    if (!aiConfig.level || !aiConfig.subject || !aiConfig.topic) {
      showToast("Por favor completa los campos del nivel, asignatura y tema.", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await generateInstrument(activeTab, aiConfig);
      
      if (activeTab === InstrumentType.RUBRICA) {
        setRubricData({
          ...result,
          subject: aiConfig.subject,
          level: aiConfig.level,
          criteria: result.criteria.map((c: any, i: number) => ({ ...c, id: `c-${Date.now()}-${i}` }))
        });
      } else if (activeTab === InstrumentType.LISTA_COTEJO) {
        setChecklistData({
          title: result.title,
          subject: aiConfig.subject,
          level: aiConfig.level,
          items: result.items.map((it: string, i: number) => ({ id: `i-${Date.now()}-${i}`, text: it, checked: false }))
        });
      } else if (activeTab === InstrumentType.ESCALA) {
        setEscalaData({
          title: result.title,
          items: result.items.map((it: string, i: number) => ({ id: `e-${Date.now()}-${i}`, text: it, value: 0 }))
        });
      } else if (activeTab === InstrumentType.GUIA_OBSERVACION) {
        setGuiaData({
          title: result.title,
          aspects: result.aspects.map((a: any, i: number) => ({ ...a, id: `g-${Date.now()}-${i}`, notes: "" }))
        });
      } else if (activeTab === InstrumentType.EXAMEN) {
        setExamData({
          ...result,
          subject: aiConfig.subject,
          questions: result.questions.map((q: any, i: number) => ({ ...q, id: `q-${Date.now()}-${i}` }))
        });
      }
      
      showToast("¡Instrumento generado con éxito!");
    } catch (error) {
      showToast("Error al generar con IA. Revisa tu conexión.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-[#0A0E27]">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-6 mb-8 sticky top-0 z-40 backdrop-blur-md bg-slate-900/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/20">E</div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tighter">
                EduEval AI
              </h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest -mt-1">Maestros del Siglo XXI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800">
            <button 
              onClick={() => setIsAiMode(false)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${!isAiMode ? 'bg-slate-800 text-white shadow-xl border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
            >
              🛠️ Modo Manual
            </button>
            <button 
              onClick={() => setIsAiMode(true)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${isAiMode ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 border border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              ✨ Generador IA
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800/50 backdrop-blur-sm">
            <h2 className="text-xs font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Seleccionar Tipo</h2>
            <div className="flex flex-col gap-3">
              {INSTRUMENTS_CONFIG.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => setActiveTab(inst.id as InstrumentType)}
                  className={`group flex items-center gap-4 w-full p-4 rounded-2xl font-bold transition-all duration-300 text-left border-2 ${activeTab === inst.id ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/40 translate-x-1' : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <span className={`text-2xl transition-transform group-hover:scale-125 ${activeTab === inst.id ? 'grayscale-0' : 'grayscale opacity-60'}`}>{inst.icon}</span>
                  <span className="flex-1">{inst.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {isAiMode && (
            <section className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 p-8 rounded-[2rem] border-2 border-blue-500/20 shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl">🤖</div>
                <div>
                  <h3 className="text-2xl font-black text-white">IA Pedagógica</h3>
                  <p className="text-blue-400/60 text-xs font-bold uppercase tracking-widest">Generación Automática</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Grado/Nivel</label>
                  <select 
                    value={aiConfig.level}
                    onChange={(e) => setAiConfig({...aiConfig, level: e.target.value})}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-slate-200"
                  >
                    <option value="">Selecciona nivel...</option>
                    {EDUCATIONAL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Materia</label>
                  <select 
                    value={aiConfig.subject}
                    onChange={(e) => setAiConfig({...aiConfig, subject: e.target.value})}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-slate-200"
                  >
                    <option value="">Selecciona materia...</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contenido o Aprendizaje Esperado</label>
                <input 
                  type="text"
                  value={aiConfig.topic}
                  onChange={(e) => setAiConfig({...aiConfig, topic: e.target.value})}
                  placeholder="Ej: Análisis de textos poéticos del siglo de oro..."
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-slate-200 shadow-inner"
                />
              </div>

              <button 
                onClick={handleAiGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-4 transition-all shadow-2xl shadow-blue-900/40 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Procesando con Gemini...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl group-hover:animate-pulse">✨</span> 
                    <span>Generar Instrumento Maestro</span>
                  </>
                )}
              </button>
            </section>
          )}

          {/* Interface Visualizer */}
          <div className="bg-slate-900/30 p-2 sm:p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl font-black pointer-events-none uppercase italic">PREVIEW</div>
            
             <div className="relative z-10">
                {activeTab === InstrumentType.RUBRICA && (
                  <RubricCreator data={rubricData} setData={setRubricData} showToast={showToast} />
                )}
                {activeTab === InstrumentType.LISTA_COTEJO && (
                  <ChecklistCreator data={checklistData} setData={setChecklistData} showToast={showToast} />
                )}
                {activeTab === InstrumentType.EXAMEN && (
                  <ExamCreator data={examData} setData={setExamData} showToast={showToast} />
                )}
                {activeTab === InstrumentType.ESCALA && (
                  <EscalaCreator data={escalaData} setData={setEscalaData} showToast={showToast} />
                )}
                {activeTab === InstrumentType.GUIA_OBSERVACION && (
                  <GuiaObservacionCreator data={guiaData} setData={setGuiaData} showToast={showToast} />
                )}
             </div>
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <footer className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Sistema Educativo Activo (Gemini 3 Flash)</span>
        </div>
        <p className="font-bold">© {new Date().getFullYear()} EduEval AI · Herramienta para Docentes</p>
      </footer>
    </div>
  );
};

export default App;
