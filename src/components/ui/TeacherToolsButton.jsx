export default function TeacherToolsButton() {
  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent("toggle-teacher-dashboard"));
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="fixed bottom-5 left-4 z-[90] inline-flex items-center gap-3 rounded-full border border-[#ffd8c2] bg-white/[0.92] px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#7d4522] shadow-[0_14px_28px_rgba(249,115,22,0.12)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#fff7ef] md:bottom-6 md:left-6"
      title="Open teacher tools"
    >
      <span className="text-lg">🧑‍🏫</span>
      <span>Teacher Tools</span>
    </button>
  );
}
