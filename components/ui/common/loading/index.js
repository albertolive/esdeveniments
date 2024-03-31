export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-whiteCorp flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bColor"></div>
    </div>
  );
}
