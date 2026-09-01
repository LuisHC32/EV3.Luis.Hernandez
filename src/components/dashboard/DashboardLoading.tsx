type DashboardLoadingProps = {
  label: string;
};

export function DashboardLoading({ label }: DashboardLoadingProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <span className="material-symbols-outlined animate-pulse text-[32px] text-secondary">
          progress_activity
        </span>
        <p className="font-body-md text-body-md mt-md text-on-surface-variant">
          {label}
        </p>
      </div>
    </div>
  );
}
