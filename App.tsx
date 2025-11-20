import React, { useState } from 'react';
import { AppView } from './types';
import TheoryView from './components/TheoryView';
import TaskView from './components/TaskView';
import QuizView from './components/QuizView';
import AITutor from './components/AITutor';
import { Book, CheckSquare, BrainCircuit, Menu, GraduationCap, Leaf } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.THEORY);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const markStepComplete = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 font-bold text-xl">
            <Leaf className="fill-green-600" />
            <span className="hidden sm:inline">BioSystem</span>
            <span className="sm:hidden">BioSys</span>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-full overflow-hidden">
            <button
              onClick={() => handleViewChange(AppView.THEORY)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentView === AppView.THEORY ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Book size={16} />
              <span className="hidden sm:inline">Теория</span>
            </button>
            <button
              onClick={() => handleViewChange(AppView.TASKS)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentView === AppView.TASKS ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <CheckSquare size={16} />
              <span className="hidden sm:inline">Тапсырмалар</span>
            </button>
            <button
              onClick={() => handleViewChange(AppView.QUIZ)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentView === AppView.QUIZ ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap size={16} />
              <span className="hidden sm:inline">Тест</span>
            </button>
          </nav>

          <button
            onClick={() => setIsTutorOpen(!isTutorOpen)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
          >
            <BrainCircuit size={18} />
            <span className="hidden md:inline">AI Көмекші</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        {currentView === AppView.THEORY && (
          <TheoryView onNext={() => {
            markStepComplete('theory');
            handleViewChange(AppView.TASKS);
          }} />
        )}
        
        {currentView === AppView.TASKS && (
          <TaskView onComplete={() => {
            markStepComplete('tasks');
            handleViewChange(AppView.QUIZ);
          }} />
        )}

        {currentView === AppView.QUIZ && (
          <QuizView onComplete={(score) => {
            markStepComplete('quiz');
            handleViewChange(AppView.SUMMARY);
          }} />
        )}

        {currentView === AppView.SUMMARY && (
           <div className="max-w-4xl mx-auto p-8 text-center">
             <h1 className="text-4xl font-bold text-green-800 mb-6">Сабақ Аяқталды!</h1>
             <p className="text-xl text-slate-600 mb-12">Сіз "Жүйелеу" тақырыбын толық меңгеріп шықтыңыз.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Book />
                  </div>
                  <h3 className="font-bold text-slate-800">Теория</h3>
                  <p className="text-green-600 text-sm font-bold mt-2">Оқылды</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare />
                  </div>
                  <h3 className="font-bold text-slate-800">3 Деңгей</h3>
                  <p className="text-green-600 text-sm font-bold mt-2">Орындалды</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap />
                  </div>
                  <h3 className="font-bold text-slate-800">Қорытынды Тест</h3>
                  <p className="text-green-600 text-sm font-bold mt-2">Тапсырылды</p>
                </div>
             </div>

             <button 
               onClick={() => handleViewChange(AppView.THEORY)}
               className="text-slate-500 hover:text-green-600 font-medium underline"
             >
               Сабақты қайта бастау
             </button>
           </div>
        )}
      </main>

      {/* AI Tutor Overlay */}
      <AITutor isOpen={isTutorOpen} onClose={() => setIsTutorOpen(false)} />
      
      {/* Progress Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6">
         <div className="max-w-4xl mx-auto flex justify-center items-center gap-4 text-sm text-slate-400">
            <span className={completedSteps.includes('theory') ? 'text-green-500 font-bold' : ''}>1. Теория</span>
            <span>&rarr;</span>
            <span className={completedSteps.includes('tasks') ? 'text-green-500 font-bold' : ''}>2. Тапсырмалар</span>
            <span>&rarr;</span>
            <span className={completedSteps.includes('quiz') ? 'text-green-500 font-bold' : ''}>3. Тест</span>
         </div>
      </footer>
    </div>
  );
};

export default App;
