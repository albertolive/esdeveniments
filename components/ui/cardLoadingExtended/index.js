import CardLoading from "../cardLoading";

function CardLoadingExtended() {
  return (
    <div className="w-full flex-col justify-center items-center sm:w-[580px] md:w-[768px] lg:w-[1024px] mt-32">
      {[...Array(10)].map((_, i) => (
        <CardLoading key={i} />
      ))}
    </div>
  );
}

export default CardLoadingExtended;
