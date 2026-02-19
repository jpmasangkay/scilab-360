import type { DragEvent } from 'react';
import type { ElementData } from '../types';
import { CATEGORY_COLORS } from '../utils/colors';
import { useApp } from '../store/context';

interface ElementTileProps {
  el: ElementData;
  tiny?: boolean;
}

export function ElementTile({ el, tiny = false }: ElementTileProps) {
  const { dispatch } = useApp();
  const colors = CATEGORY_COLORS[el.category];

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('elementSymbol', el.symbol);
    dispatch({ type: 'SET_DRAG', payload: el });
  };
  const handleDragEnd = () => dispatch({ type: 'SET_DRAG', payload: null });
  const handleClick = () => dispatch({ type: 'SELECT_ELEMENT', payload: el });

  if (tiny) {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        title={`${el.name} (${el.atomicNumber})`}
        className="relative flex flex-col items-center justify-center w-full aspect-square rounded cursor-grab select-none transition-all duration-150 p-px"
        style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = `0 0 8px ${colors.glow}`;
          el.style.transform = 'scale(1.15)';
          el.style.zIndex = '10';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = 'none';
          el.style.transform = 'scale(1)';
          el.style.zIndex = '1';
        }}
      >
        <span className="text-[6px] opacity-70 leading-none">{el.atomicNumber}</span>
        <span className="font-orbitron font-bold text-[10px] leading-none">{el.symbol}</span>
      </div>
    );
  }

  // Normal (common elements) tile — larger and clearly readable
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className="cursor-grab select-none rounded-lg transition-all duration-150 flex flex-col gap-0.5"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        padding: '8px 10px',
        minWidth: 64,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 14px ${colors.glow}`;
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.06)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
      }}
    >
      <div className="text-[10px] opacity-70 font-share-tech leading-none">{el.atomicNumber}</div>
      <div className="font-orbitron font-bold text-[18px] leading-tight">{el.symbol}</div>
      <div className="text-[9px] opacity-80 truncate font-share-tech leading-none" style={{ maxWidth: 54 }}>{el.name}</div>
    </div>
  );
}
