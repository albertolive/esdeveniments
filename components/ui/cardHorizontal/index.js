import { memo } from "react";
import dynamic from "next/dynamic";
import CardContent from "@components/ui/common/cardContent";

const CardHorizontalLoading = dynamic(
  () => import("@components/ui/cardLoading"),
  {
    loading: () => (
      <div className="flex justify-center items-center w-full">
        <div className="w-full h-60 bg-darkCorp animate-fast-pulse"></div>
      </div>
    ),
  }
);

function CardHorizontal({ event, isLoading, isPriority }) {
  if (isLoading) return <CardHorizontalLoading />;

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
    <CardContent event={event} isPriority={isPriority} isHorizontal={true} />
  );
}

export default memo(CardHorizontal);
