export default function Loading() {
  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full px-7 py-6 gap-6 max-w-4xl">
      <div className="bg-ph-surface border border-ph-border rounded-lg p-5 animate-pulse">
        <div className="h-[14px] w-[200px] bg-ph-border rounded-[3px] mb-2" />
        <div className="h-[14px] w-[150px] bg-ph-border rounded-[3px] mb-2" />
        <div className="h-[22px] w-[70px] bg-ph-border rounded-[3px] mt-1" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-[14px] w-[120px] bg-ph-border rounded-[3px]" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-ph-surface border border-ph-border rounded-lg p-5 animate-pulse flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-[28px] w-[40px] bg-ph-border rounded-[3px]" />
              <div className="h-[20px] w-[50px] bg-ph-border rounded-[3px]" />
              <div className="h-[14px] w-[100px] bg-ph-border rounded-[3px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[80px] bg-ph-border rounded-[3px]" />
              <div className="h-[80px] bg-ph-border rounded-[3px]" />
            </div>
            <div className="h-[14px] w-[80px] bg-ph-border rounded-[3px]" />
            <div className="h-[40px] bg-ph-border rounded-[3px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
