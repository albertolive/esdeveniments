import { memo } from "react";
import dynamic from "next/dynamic";
import CardContent from "@components/ui/common/cardContent";

const CardLoading = dynamic(() => import("@components/ui/cardLoading"), {
  loading: () => (
    <div className="flex justify-center items-center w-full">
      <div className="w-full h-60 bg-darkCorp animate-fast-pulse"></div>
    </div>
  ),
});

function Card({ event, isLoading, isPriority }) {
  if (isLoading) return <CardLoading />;

  if (event.isAd) {
    const AdCard = dynamic(() => import("@components/ui/adCard"), {
      loading: () => (
        <div className="flex justify-center items-center w-full">
          <div className="w-full h-60 bg-darkCorp animate-fast-pulse"></div>
        </div>
      ),
      ssr: false,
    });
    return <AdCard event={event} />;
  }

  return (
    <CardContent event={event} isPriority={isPriority} isHorizontal={false} />
  );
}

export default memo(Card);
