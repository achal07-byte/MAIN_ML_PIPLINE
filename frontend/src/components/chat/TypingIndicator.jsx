export default function TypingIndicator() {
  return (
    <div className="flex justify-start gap-5 max-w-4xl mx-auto">
      <div className="w-8 h-8 rounded-lg shrink-0" /> {/* Avatar Placeholder */}
      <div className="bg-[#18181b] border border-white/[0.03] rounded-2xl px-5 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}