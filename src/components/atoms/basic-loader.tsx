export default function BasicLoader({
  color = "border-white",
}: {
  color?: string;
}) {
  return (
    <div
      className={`animate-spin rounded-full h-4 w-4 border-b-2 ${color} mr-2`}
    />
  );
}