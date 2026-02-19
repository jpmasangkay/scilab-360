import { RotateCcw, ClipboardList } from 'lucide-react';
import { useApp } from '../store/context';

export function Header() {
  const { state, dispatch } = useApp();
  return (
    <div
      className="flex items-center justify-between shrink-0 relative overflow-hidden border-b border-[#4c1d95]"
      style={{
        background: 'linear-gradient(90deg, #0d0120 0%, #1a0533 40%, #200040 100%)',
        padding: '1.25rem 1.75rem',
      }}
    >
      {[10, 25, 60, 80, 92].map((left, i) => {
        const tops = [20, 70, 30, 60, 25];
        const sizes = [2, 3, 2, 3, 2];
        const durations = [1.8, 2.4, 1.5, 2.1, 1.9];
        return (
          <div key={i} className="absolute rounded-full bg-[#c084fc] opacity-40 pointer-events-none animate-twinkle"
            style={{ left: `${left}%`, top: `${tops[i]}%`, width: sizes[i], height: sizes[i], animationDuration: `${durations[i]}s` }} />
        );
      })}
      {/* Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <span className="text-3xl" style={{ filter: 'drop-shadow(0 0 10px #a855f7)' }}>⚛</span>
        <div>
          <p className="font-orbitron font-black text-xl text-white tracking-[4px]"
            style={{ textShadow: '0 0 20px #a855f780' }}>
            SCILAB 360
          </p>
          <p className="font-share-tech text-[11px] text-[#c084fc] tracking-[3px]">INTERACTIVE CHEMISTRY LAB</p>
        </div>
      </div>
      {/* Controls */}
      <div className="flex gap-3 items-center relative z-10">
        <span className="font-share-tech text-sm text-[#a855f7]">
          {state.placedAtoms.length} atom{state.placedAtoms.length !== 1 ? 's' : ''} · {state.bonds.length} bond{state.bonds.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => dispatch({ type: 'CLEAR_SANDBOX' })}
          className="flex items-center gap-2 rounded-lg cursor-pointer text-sm font-share-tech tracking-wide text-[#c084fc] transition-all duration-150 hover:text-white hover:bg-[#2d1263]"
          style={{ background: '#1e0b3e', border: '1px solid #4c1d95', padding: '0.5rem 1rem' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px #a855f740'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
        >
          <RotateCcw size={14} /> CLEAR
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_TEACHER' })}
          className="flex items-center gap-2 rounded-lg cursor-pointer text-sm font-share-tech tracking-wide transition-all duration-150"
          style={{
            padding: '0.5rem 1rem',
            background: state.showTeacherDash ? '#3b0764' : '#1e0b3e',
            border: state.showTeacherDash ? '1px solid #a855f7' : '1px solid #4c1d95',
            color: state.showTeacherDash ? '#e9d5ff' : '#c084fc',
            boxShadow: state.showTeacherDash ? '0 0 12px #a855f760' : 'none',
          }}
        >
          <ClipboardList size={14} /> MY PROGRESS
        </button>
      </div>
    </div>
  );
}