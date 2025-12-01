"use client";

import { UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OnboardingDataType } from "@/app/onboarding/page";

export const countries = [
  { name: "United States", code: "US" },
  { name: "India", code: "IN" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "China", code: "CN" },
  { name: "Japan", code: "JP" },
  { name: "Brazil", code: "BR" },
];

interface PageProps {
  register: UseFormRegister<OnboardingDataType>;
  setCountry: (e: string) => void;
}

export function OnboardingFormStep2({ register, setCountry }: PageProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-md font-medium">Select Country</Label>
        <Select defaultValue="IN" onValueChange={setCountry}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="select your country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c, idx) => {
              return (
                <SelectItem key={idx} value={c.code}>
                  {c.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address" className="text-md font-medium">
          Address
        </Label>
        <Input {...register("address")} type="text" id="address" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pincode" className="text-md font-medium">
          Pincode
        </Label>
        <Input {...register("pincode")} type="text" id="pincode" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website" className="text-md font-medium">
          Website
        </Label>
        <Input {...register("website")} type="text" id="website" />
      </div>
    </div>
  );
}
