'use client';

interface SpeechBubbleProps {
  text: string;
}

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-float-up">
      <div className="relative bg-white dark:bg-slate-800 px-3 py-1.5 rounded-2xl rounded-bl-lg shadow-lg border border-pastel-border/20 text-xs font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap max-w-[140px] overflow-hidden text-ellipsis">
        {text}
      </div>
      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-white dark:bg-slate-800 border-r border-b border-pastel-border/20 rotate-45" />
    </div>
  );
}
