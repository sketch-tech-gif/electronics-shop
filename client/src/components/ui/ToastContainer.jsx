import { useApp } from "../../context/AppContext";

export default function ToastContainer() {
  const { toasts, dispatch } = useApp();
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium max-w-xs ${
            t.type === "success" ? "bg-emerald-500 text-white" :
            t.type === "error" ? "bg-red-500 text-white" :
            "bg-slate-700 text-white"
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => dispatch({ type: "TOAST_REMOVE", id: t.id })} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}