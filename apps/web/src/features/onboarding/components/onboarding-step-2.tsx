import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingFormType, useOnboardingForm } from "../hooks/useOnboardingForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_COUNTRIES } from "@repo/shared";

export default function OnboardingStep2({
  register,
  handleCountry,
  country,
}: OnboardingFormType) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input {...register("addressLine1")} id="addressLine1" type="text" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Input {...register("addressLine2")} id="addressLine2" type="text" />
      </div>

      <div className="flex justify-between">
        <div className="grid gap-3">
          <Label htmlFor="state">State</Label>
          <Input {...register("state")} id="state" type="text" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="city">City</Label>
          <Input {...register("city")} id="city" type="text" />
        </div>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input {...register("postalCode")} id="postalCode" type="text" />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="country">Country</Label>

        <Select
          value={country}
          onValueChange={(e) => {
            handleCountry(e);
          }}
        >
          <SelectTrigger id="country" className="w-full">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_COUNTRIES.map((country) => {
              return (
                <SelectItem key={country.name} value={country.code}>
                  {country.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
