export default function Loading() {
  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full px-7 py-6">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[152px] bg-ph-surface border border-ph-border rounded-[6px] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
