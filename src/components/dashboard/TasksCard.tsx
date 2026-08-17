import { Check, Circle, Clock } from 'lucide-react';
import Card from '@/components/ui/GlassCard';
import { tasks } from '@/data/dummyData';

const priorityStyle: Record<string, string> = {
  high: 'bg-red-50 text-error-600 border-red-100',
  medium: 'bg-amber-50 text-warning-600 border-amber-100',
  low: 'bg-brand-50 text-brand-600 border-brand-100',
};

export default function TasksCard() {
  const remaining = tasks.filter((t) => !t.done).length;
  return (
    <Card padding="lg" className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand-600">Today's Tasks</div>
          <div className="text-sm text-ink-600 mt-0.5">{remaining} remaining · {tasks.length} total</div>
        </div>
        <button className="text-xs font-bold text-brand-600 hover:text-brand-700">+ Add</button>
      </div>

      <ul className="mt-4 space-y-2.5 flex-1">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`group flex items-center gap-3 rounded-lg border p-3 transition-colors ${
              task.done ? 'bg-brand-50 border-brand-100' : 'bg-white border-gray-100 hover:border-brand-200'
            }`}
          >
            <button
              className={`h-6 w-6 rounded-full grid place-items-center flex-shrink-0 transition-colors ${
                task.done ? 'bg-brand-600 text-white' : 'bg-white border-2 border-gray-200 group-hover:border-brand-400'
              }`}
              aria-label="Toggle task"
            >
              {task.done ? <Check size={14} /> : <Circle size={6} className="opacity-0 group-hover:opacity-40" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold truncate ${task.done ? 'text-ink-600/50 line-through' : 'text-ink-900'}`}>
                {task.title}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[11px] text-ink-600"><Clock size={11} /> {task.due}</span>
                <span className="text-[11px] text-ink-600/60">· {task.field}</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${priorityStyle[task.priority]}`}>
              {task.priority}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
