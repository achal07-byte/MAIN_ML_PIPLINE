import { Clock, FolderOpen } from 'lucide-react';

export default function SessionItem({ session, onSelect, isActive }) {
  return (
    <div
      onClick={() => onSelect(session.id)}
      className={`p-2 rounded-lg cursor-pointer transition mb-1 ${
        isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'
      }`}
    >
      <div className="flex items-center gap-2 text-sm truncate">
        <FolderOpen size={14} />
        <span>{session.name}</span>
      </div>
      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
        <Clock size={10} />
        <span>{session.date}</span>
      </div>
    </div>
  );
}