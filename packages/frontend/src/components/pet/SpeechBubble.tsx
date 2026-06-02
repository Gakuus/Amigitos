'use client';

interface SpeechBubbleProps {
  text: string;
}

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none" style={{ top: '-90px' }}>
      <div className="relative bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-lg shadow-xl border border-pastel-border/20 text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight max-w-[200px] inline-block">
        {text}
      </div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-pastel-border/20 rotate-45" />
    </div>
  );
}
