export default function CardLoading() {
  return (
    <div className="bg-whiteCorp rounded-xl shadow-md overflow-hidden lg:max-w-2xl pointer-events-none cursor-none h-48 md:lg-52 lg:h-56 hover:shadow-gray-500/40">
      <div className="animate-pulse flex h-full">
        <div className="flex-1 h-full next-image-wrapper">
          <div className="h-full bg-slate-200 rounded"></div>
        </div>
        <div className="p-4 flex-2">
          <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
            <div className="h-2 bg-whiteCorp rounded"></div>
          </div>
          <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
            <div className="h-2 bg-black opacity-20 rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
          <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
          <div className="bg-blackCorp grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
          </div>
          <div className="mt-3 mb-3 text-sm sm:text-base text-gray-500 ">
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
