import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

export default function StepCard({ step, label, status, isActive, onClick }) {
  let icon;
  if (status === 'completed') icon = <CheckCircle className="text-green-500" size={18} />;
  else if (status === 'error') icon = <AlertCircle className="text-red-500" size={18} />;
  else icon = <Circle className={isActive ? 'text-blue-500' : 'text-gray-300'} size={18} />;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
        isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className={`text-sm ${isActive ? 'font-semibold text-blue-700' : 'text-gray-700'}`}>{label}</span>
    </div>
  );
}