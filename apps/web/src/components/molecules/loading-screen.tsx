import BoxLoader from "../atoms/box-loader";

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <BoxLoader />
        <p className="text-lg font-semibold tracking-wide">Just a moment…</p>
        <span className="text-xs text-muted-foreground">
          We’re loading your data
        </span>
      </div>
    </div>
  );
};
