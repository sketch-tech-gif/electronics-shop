export function StarRating({ rating, max = 5, size = "sm" }) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5" };
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`${sizes[size]} ${i < Math.floor(rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} className="transition-transform hover:scale-110">
          <svg viewBox="0 0 24 24" className={`w-7 h-7 ${star <= value ? "text-amber-400" : "text-slate-200"} transition-colors`} fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
}