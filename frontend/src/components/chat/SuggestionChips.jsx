const suggestions = [
  "Analyze my data",
  "Show correlations",
  "Plot distributions",
  "Find missing values",
  "Next steps?",
  "Download script"
];

export default function SuggestionChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="px-4 py-2 bg-white border border-[#e5e5e3] rounded-2xl text-[11px] font-semibold text-[#666666] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all shadow-sm"
        >
          {text}
        </button>
      ))}
    </div>
  );
}