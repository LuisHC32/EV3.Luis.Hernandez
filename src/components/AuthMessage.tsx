type AuthMessageProps = {
  type: "success" | "error" | null;
  text: string;
};

export function AuthMessage({ type, text }: AuthMessageProps) {
  if (!type || !text) return null;

  const className =
    type === "success"
      ? "border-outline-variant bg-surface-container-low text-on-surface"
      : "border-transparent bg-error-container text-on-error-container";

  return (
    <div
      className={`font-body-md text-body-md rounded-lg border px-md py-sm ${className}`}
      role="alert"
    >
      {text}
    </div>
  );
}
