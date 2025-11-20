import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle2, XCircle, RefreshCw, Award } from 'lucide-react';

interface Props {
  onComplete: (score: number) => void;
}

const QuizView: React.FC<Props> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelect = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setIsAnswerChecked(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-3xl shadow-xl border border-slate-100 mt-10">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
          <Award size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Тест аяқталды!</h2>
        <p className="text-slate-500 mb-8">Сіздің нәтижеңіз:</p>
        
        <div className="text-6xl font-bold text-green-600 mb-4">{score} / {QUIZ_QUESTIONS.length}</div>
        <p className="text-lg text-slate-700 mb-8">
          {percentage >= 80 ? "Өте жақсы! Жарайсыз!" : percentage >= 50 ? "Жақсы, бірақ әлі де оқу керек." : "Тақырыпты қайталауды ұсынамыз."}
        </p>

        <button
          onClick={() => onComplete(score)}
          className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors"
        >
          Сабақты аяқтау
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6 text-sm font-medium text-slate-500">
        <span>Сұрақ {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</span>
        <span>Ұпай: {score}</span>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-green-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let baseClasses = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ";
            
            if (isAnswerChecked) {
              if (idx === currentQ.correctAnswer) {
                baseClasses += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                baseClasses += "border-red-500 bg-red-50 text-red-800";
              } else {
                baseClasses += "border-slate-100 text-slate-400 opacity-50";
              }
            } else {
              if (selectedOption === idx) {
                baseClasses += "border-blue-500 bg-blue-50 text-blue-800";
              } else {
                baseClasses += "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswerChecked}
                className={baseClasses}
              >
                <span className="font-medium">{option}</span>
                {isAnswerChecked && idx === currentQ.correctAnswer && <CheckCircle2 className="text-green-600" />}
                {isAnswerChecked && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="text-red-600" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          {!isAnswerChecked ? (
            <button
              onClick={handleCheck}
              disabled={selectedOption === null}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold transition-colors"
            >
              Жауап беру
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              Келесі <RefreshCw size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
