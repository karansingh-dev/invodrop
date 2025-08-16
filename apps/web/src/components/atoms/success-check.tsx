import { Check } from "lucide-react";

export default function SuccessCheck() {
  return (
    <div className="mx-auto w-16 h-16 bg-green-50 bg-primary/20 rounded-full flex items-center justify-center">
      <Check className="text-primary w-8 h-8" />
    </div>
  );
}
