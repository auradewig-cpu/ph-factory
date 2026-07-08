export function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-ph-bg gap-4">
      <div className="w-10 h-10 border border-ph-border rounded-[4px] flex items-center justify-center mb-2">
        <div className="w-4 h-4 border border-ph-teal rounded-[1px]" />
      </div>
      <div className="font-display text-[26px] font-bold tracking-[0.14em] text-ph-text">{name}</div>
      <div className="font-mono text-[11px] text-ph-muted tracking-[0.06em]">Halaman ini belum tersedia di prototype.</div>
    </div>
  );
}
