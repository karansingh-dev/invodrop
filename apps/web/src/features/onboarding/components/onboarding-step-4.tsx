import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingFormType, useOnboardingForm } from "../hooks/useOnboardingForm";

export default function OnboardingStep4({ register }: OnboardingFormType) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email")}
          type="email"
          id="email"
          placeholder="example@gmail.com"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="website">Website</Label>
        <Input
          {...register("website")}
          type="text"
          id="wesbite"
          placeholder="Enter you website url"
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          {...register("phone")}
          type="text"
          id="phone"
          placeholder="+91 1234567890"
        />
      </div>
    </div>
  );
}
