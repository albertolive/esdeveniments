export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primarySoft"></div>
    </div>
  );
}
