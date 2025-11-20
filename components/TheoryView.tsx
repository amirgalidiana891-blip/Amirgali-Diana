import React from 'react';
import { THEORY_CONTENT } from '../constants';
import { BookOpen, ArrowRight } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const TheoryView: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Жүйелеу негіздері</h1>
        <p className="text-slate-600">Тірі ағзаларды классификациялауға кіріспе</p>
      </div>

      <div className="space-y-12">
        {THEORY_CONTENT.map((section, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={section.image} 
                  alt={section.title} 
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4 text-green-600">
                  <BookOpen size={20} />
                  <span className="font-semibold uppercase tracking-wider text-sm">Бөлім {idx + 1}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{section.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-4">{section.content}</p>
                {section.list && (
                  <ul className="space-y-2">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-green-200 transform hover:-translate-y-1"
        >
          Тапсырмаларға өту <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TheoryView;
