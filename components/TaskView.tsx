import React, { useState } from 'react';
import { HIERARCHY_ITEMS } from '../constants';
import { checkEssayAnswer } from '../services/geminiService';
import { CheckCircle2, XCircle, HelpCircle, Trophy, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const TaskView: React.FC<Props> = ({ onComplete }) => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [score, setScore] = useState(0);
  
  // Level 1 State (Simple Quiz/Matching)
  const [l1Answer, setL1Answer] = useState<string | null>(null);
  const [l1Feedback, setL1Feedback] = useState<'correct' | 'incorrect' | null>(null);

  // Level 2 State (Ordering)
  const [l2Order, setL2Order] = useState<string[]>([]);
  const [l2Feedback, setL2Feedback] = useState<string | null>(null);

  // Level 3 State (Essay)
  const [l3Essay, setL3Essay] = useState('');
  const [l3Loading, setL3Loading] = useState(false);
  const [l3Result, setL3Result] = useState<{score: number, feedback: string} | null>(null);

  // --- LEVEL 1 LOGIC ---
  const handleL1Submit = (selected: string) => {
    setL1Answer(selected);
    if (selected === 'genus') {
      setL1Feedback('correct');
      setTimeout(() => setLevel(2), 1500);
    } else {
      setL1Feedback('incorrect');
    }
  };

  // --- LEVEL 2 LOGIC ---
  const handleL2Select = (id: string) => {
    if (l2Order.includes(id)) {
      setL2Order(prev => prev.filter(item => item !== id));
    } else {
      setL2Order(prev => [...prev, id]);
    }
  };

  const handleL2Check = () => {
    const correctOrder = HIERARCHY_ITEMS.sort((a, b) => a.correctOrder - b.correctOrder).map(i => i.id);
    if (JSON.stringify(l2Order) === JSON.stringify(correctOrder)) {
      setL2Feedback('correct');
      setTimeout(() => setLevel(3), 1500);
    } else {
      setL2Feedback('Қате! Реттілікті қайта тексеріңіз. Ең үлкеннен ең кішіге қарай.');
      setL2Order([]);
    }
  };

  // --- LEVEL 3 LOGIC ---
  const handleL3Submit = async () => {
    if (!l3Essay.trim()) return;
    setL3Loading(true);
    const result = await checkEssayAnswer(
      "Тірі ағзаларды жүйелеудің (классификациялаудың) маңызы неде? Неге біз оларды топтарға бөлеміз?",
      l3Essay
    );
    setL3Result(result);
    setL3Loading(false);
    if (result.score >= 5) { // Pass threshold
      setTimeout(() => onComplete(), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div className={`flex items-center gap-2 ${level >= 1 ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">1</div>
          <span>Деңгей А</span>
        </div>
        <div className="h-1 w-12 bg-slate-200">
           <div className={`h-full bg-green-500 transition-all ${level > 1 ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`flex items-center gap-2 ${level >= 2 ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">2</div>
          <span>Деңгей В</span>
        </div>
        <div className="h-1 w-12 bg-slate-200">
            <div className={`h-full bg-green-500 transition-all ${level > 2 ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`flex items-center gap-2 ${level >= 3 ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">3</div>
          <span>Деңгей С</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 min-h-[400px]">
        
        {/* LEVEL 1 */}
        {level === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Деңгей А: Терминдерді сәйкестендіру</h2>
            <p className="text-lg text-slate-600">
              "Homo sapiens" атауындағы бірінші сөз ("Homo") нені білдіреді?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[
                { id: 'species', label: 'Түр (Species)' },
                { id: 'genus', label: 'Туыс (Genus)' },
                { id: 'family', label: 'Тұқымдас (Family)' },
                { id: 'order', label: 'Отряд (Order)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleL1Submit(opt.id)}
                  disabled={l1Feedback === 'correct'}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    l1Answer === opt.id
                      ? l1Feedback === 'correct' 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 hover:border-green-400 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {l1Feedback === 'correct' && (
              <div className="flex items-center gap-2 text-green-600 font-bold mt-4 bg-green-50 p-3 rounded-lg">
                <CheckCircle2 /> Дұрыс! "Homo" – бұл туыс атауы.
              </div>
            )}
            {l1Feedback === 'incorrect' && (
              <div className="flex items-center gap-2 text-red-600 font-bold mt-4 bg-red-50 p-3 rounded-lg">
                <XCircle /> Қате. Бинарлы номенклатурада бірінші сөз әрқашан Туысты білдіреді.
              </div>
            )}
          </div>
        )}

        {/* LEVEL 2 */}
        {level === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Деңгей В: Иерархияны құру</h2>
            <p className="text-slate-600">
              Таксондарды <strong>ең үлкенінен ең кішісіне</strong> қарай дұрыс ретпен таңдаңыз.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {HIERARCHY_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleL2Select(item.id)}
                  disabled={l2Feedback === 'correct'}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    l2Order.includes(item.id)
                      ? 'bg-blue-100 border-blue-400 text-blue-800 opacity-50 cursor-not-allowed'
                      : 'bg-white border-slate-300 hover:border-green-500 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl min-h-[60px] border border-slate-200">
              <p className="text-xs text-slate-400 uppercase font-bold mb-2">Сіздің жауабыңыз:</p>
              <div className="flex flex-col gap-2">
                {l2Order.map((id, idx) => {
                  const item = HIERARCHY_ITEMS.find(i => i.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2 text-slate-800 font-medium animate-slideIn">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs">{idx + 1}</span>
                      {item?.label}
                    </div>
                  );
                })}
                {l2Order.length === 0 && <span className="text-slate-400 italic">Әзірше бос... Жоғарыдан таңдаңыз</span>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleL2Check}
                disabled={l2Order.length !== 7}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                Тексеру
              </button>
            </div>

            {l2Feedback && l2Feedback !== 'correct' && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <XCircle size={20} /> {l2Feedback}
              </div>
            )}
             {l2Feedback === 'correct' && (
              <div className="p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
                <CheckCircle2 size={20} /> Тамаша! Келесі деңгейге өтуде...
              </div>
            )}
          </div>
        )}

        {/* LEVEL 3 */}
        {level === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Деңгей С: Сыни ойлау</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                 <HelpCircle size={18} /> Сұрақ:
              </h3>
              <p className="text-blue-800 font-medium">
                Тірі ағзаларды жүйелеудің (классификациялаудың) маңызы неде? Неге біз оларды топтарға бөлеміз? Өз ойыңызды жазыңыз (кемінде 2 сөйлем).
              </p>
            </div>

            <textarea
              value={l3Essay}
              onChange={(e) => setL3Essay(e.target.value)}
              placeholder="Жауабыңызды осында жазыңыз..."
              className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none"
              disabled={l3Loading || !!l3Result}
            />

            <div className="flex justify-end">
               <button
                onClick={handleL3Submit}
                disabled={l3Loading || l3Essay.length < 10 || !!l3Result}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
              >
                {l3Loading ? <Loader2 className="animate-spin" /> : 'Жасанды интеллектке тексерту'}
              </button>
            </div>

            {l3Result && (
              <div className={`p-6 rounded-xl border ${l3Result.score >= 5 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} animate-fadeIn`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-lg text-slate-700">AI Бағасы:</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-2xl font-bold ${l3Result.score >= 5 ? 'text-green-600' : 'text-orange-600'}`}>{l3Result.score}</span>
                    <span className="text-slate-400">/ 10</span>
                  </div>
                </div>
                <p className="text-slate-700 italic mb-4">"{l3Result.feedback}"</p>
                
                {l3Result.score < 5 ? (
                   <button onClick={() => setL3Result(null)} className="text-sm text-blue-600 hover:underline">Қайта жазу</button>
                ) : (
                   <div className="text-green-700 font-bold flex items-center gap-2">
                      <Trophy size={20} /> Тапсырмалар орындалды! Тестке көшеміз...
                   </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TaskView;
