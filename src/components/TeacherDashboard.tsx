import { X, BarChart2 } from 'lucide-react';
import { useApp } from '../store/context';
import { QUIZ_LEVELS } from '../data/quizLevels';

export function TeacherDashboard() {
  const { state, dispatch } = useApp();
  if (!state.showTeacherDash) return null;

  const exportReport = () => {
    const report = {
      exportDate: new Date().toISOString(),
      student: 'Student #1',
      score: state.score,
      level: state.level,
      atomsPlaced: state.atomCount,
      completedChallenges: state.completedChallenges,
      totalChallenges: QUIZ_LEVELS.length,
      currentFormula: state.formula || 'N/A',
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'scilab360-report.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-72.5 flex flex-col p-5 gap-4 z-1000"
      style={{ background: '#0d0120', borderLeft: '1px solid #2d1b5e', boxShadow: '-4px 0 40px #00000080, -2px 0 20px #a855f720' }}>
      
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron font-bold text-base text-white tracking-[2px]">TEACHER DASHBOARD</h2>
        <button onClick={() => dispatch({ type: 'TOGGLE_TEACHER' })}
          className="text-[#6b21a8] cursor-pointer bg-transparent border-none hover:text-[#a855f7] transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Class summary */}
      <div className="rounded-xl p-4" style={{ background: '#130929', border: '1px solid #2d1b5e' }}>
        <p className="text-xs text-[#a855f7] font-share-tech font-bold tracking-[2px] mb-3">CLASS SUMMARY</p>
        <div className="grid grid-cols-2 gap-2">
          {[['Students', '1'], ['Avg Score', String(state.score)], ['Avg Level', String(state.level)], ['Completed', `${state.completedChallenges.length}/${QUIZ_LEVELS.length}`]].map(([label, value]) => (
            <div key={label} className="rounded-lg px-3 py-2" style={{ background: '#07011a', border: '1px solid #1e0b3e' }}>
              <p className="text-[10px] text-[#6b21a8] font-share-tech">{label}</p>
              <p className="text-2xl text-[#a855f7] font-orbitron font-bold" style={{ textShadow: '0 0 10px #a855f760' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student progress */}
      <div className="rounded-xl p-4" style={{ background: '#130929', border: '1px solid #2d1b5e' }}>
        <p className="text-xs text-[#a855f7] font-share-tech font-bold tracking-[2px] mb-3">STUDENT #1 PROGRESS</p>
        <div className="flex flex-col gap-1.5">
          {QUIZ_LEVELS.map(q => (
            <div key={q.level} className="flex justify-between items-center">
              <span className="text-xs text-[#c084fc] font-share-tech">L{q.level}: {q.targetFormula}</span>
              <span className="text-sm font-bold" style={{ color: state.completedChallenges.includes(q.level) ? '#a855f7' : '#2d1b5e' }}>
                {state.completedChallenges.includes(q.level) ? '✓' : '○'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Session stats */}
      <div className="rounded-xl p-4" style={{ background: '#130929', border: '1px solid #2d1b5e' }}>
        <p className="text-xs text-[#a855f7] font-share-tech font-bold tracking-[2px] mb-3">SESSION STATS</p>
        <div className="flex flex-col gap-1">
          {[['Atoms Placed', state.atomCount], ['Attempts', state.attempts], ['Mode', state.mode], ['Formula', state.formula || '—'], ['Bonds', state.bonds.length]].map(([label, value]) => (
            <div key={String(label)} className="flex justify-between">
              <span className="text-xs text-[#6b21a8] font-share-tech">{label}</span>
              <span className="text-xs text-[#c084fc] font-share-tech font-bold capitalize">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={exportReport}
        className="mt-auto flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer font-orbitron font-bold text-sm tracking-wide text-[#e9d5ff] transition-all duration-150"
        style={{ background: 'linear-gradient(135deg, #3b0764, #4c1d95)', border: '1px solid #a855f7', boxShadow: '0 0 16px #a855f740' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px #a855f7aa'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px #a855f740'; }}>
        <BarChart2 size={16} /> EXPORT REPORT
      </button>
    </div>
  );
}
