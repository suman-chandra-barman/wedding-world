function CategoriesPanelSkeleton() {
  return (
    <div className="mt-8">
      <div className="h-4 w-24 rounded bg-[#e6ded8] animate-pulse" />
      <div className="mt-4 grid gap-3">
        {[0, 1, 2, 3,4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-4 w-40 rounded bg-[#e6ded8] animate-pulse"
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="aspect-3/4 w-full rounded-[0.42rem] bg-[#e6ded8] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default CategoriesPanelSkeleton;
