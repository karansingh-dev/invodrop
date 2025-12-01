import { FileText } from "lucide-react";

interface Props {
  height?: number;
  width?: number;
}

export default function Logo({ height = 15, width = 15 }: Props) {
  return (
    <div className="p-1 rounded-xl bg-primary flex items-center justify-center shadow-md">
      <FileText className={`w-${width} h-${height} text-primary-foreground`} />
    </div>
  );
}
