function TryOnSidebarSkeleton() {
  return (
    <div className="grid gap-3">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="grid grid-cols-[58px_minmax(0,1fr)] items-center gap-2 rounded-md bg-white/60 p-1.5"
        >
          <div className="h-16 w-14 rounded-[0.28rem] bg-[#e6ded8] animate-pulse" />
          <div className="flex items-center justify-between gap-2">
            <div className="h-3 w-24 rounded bg-[#e6ded8] animate-pulse" />
            <div className="h-3.5 w-3.5 rounded-sm bg-[#e6ded8] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TryOnSidebarSkeleton;
