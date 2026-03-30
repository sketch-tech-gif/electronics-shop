// FILE: src/components/ui/Skeleton.jsx

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
      <div className="bg-slate-200 h-64 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 rounded-full w-1/3" />
        <div className="h-4 bg-slate-200 rounded-full w-3/4" />
        <div className="h-3 bg-slate-200 rounded-full w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-200 rounded-full w-1/4" />
          <div className="h-9 bg-slate-200 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-slate-200 rounded-2xl h-[480px]" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-24 bg-slate-200 rounded w-full" />
          <div className="h-12 bg-slate-200 rounded-xl w-full mt-6" />
        </div>
      </div>
    </div>
  );
}