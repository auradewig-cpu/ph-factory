export default function Loading() {
  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full px-7 py-6 gap-8 max-w-3xl">
      <div className="bg-ph-surface border border-ph-border rounded-lg p-5 animate-pulse">
        <div className="h-[14px] w-[180px] bg-ph-border rounded-[3px] mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-[50px] bg-ph-border rounded-[3px]" />
          <div className="h-[50px] bg-ph-border rounded-[3px]" />
          <div className="h-[50px] bg-ph-border rounded-[3px]" />
          <div className="h-[50px] bg-ph-border rounded-[3px]" />
        </div>
        <div className="h-[14px] w-[120px] bg-ph-border rounded-[3px] mt-4 mb-2" />
        <div className="flex gap-2">
          <div className="h-[24px] w-[70px] bg-ph-border rounded-[3px]" />
          <div className="h-[24px] w-[80px] bg-ph-border rounded-[3px]" />
        </div>
      </div>
      <div className="bg-ph-surface border border-ph-border rounded-lg p-5 animate-pulse">
        <div className="h-[14px] w-[100px] bg-ph-border rounded-[3px] mb-4" />
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-[72px] bg-ph-border rounded-lg" />
          ))}
        </div>
      </div>
      <div className="bg-ph-surface border border-ph-border rounded-lg p-5 animate-pulse">
        <div className="h-[14px] w-[130px] bg-ph-border rounded-[3px] mb-4" />
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-[56px] bg-ph-border rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
