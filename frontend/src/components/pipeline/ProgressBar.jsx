export default function ProgressBar({ currentStep, totalSteps }) {
  const percent = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
    </div>
  );
}