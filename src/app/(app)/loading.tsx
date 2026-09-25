function Block({ className }: { className: string }) {
  return <div className={`rounded-2xl border border-line bg-card ${className}`} />;
}

export default function AppLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg bg-line" />
          <div className="h-4 w-64 rounded-lg bg-line/70" />
        </div>
        <div className="h-10 w-28 rounded-lg bg-line" />
      </div>
      <div className="grid grid-cols-1 gap-4 @md/main:grid-cols-2 @3xl/main:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Block key={i} className="h-[132px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-[minmax(0,1fr)_300px]">
        <Block className="h-[360px]" />
        <Block className="h-[360px]" />
      </div>
    </div>
  );
}
