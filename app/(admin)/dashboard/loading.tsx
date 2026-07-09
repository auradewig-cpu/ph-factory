export default function Loading() {
  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full px-7 py-6 gap-7">
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-[88px] bg-ph-surface border border-ph-border rounded-[6px] animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[140px] bg-ph-surface border border-ph-border rounded-[6px] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
