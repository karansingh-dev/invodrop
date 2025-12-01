"use client";

import { CheckCircle, Upload, X } from "lucide-react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import BasicLoader from "../atoms/basic-loader";
import { Button } from "../ui/button";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "CHF", symbol: "CHF" },
  { code: "CNY", symbol: "¥" },
  { code: "NZD", symbol: "NZ$" },
];

interface PageProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCurrency: (e: string) => void;
  uploadingImage: boolean;
  fileUploaded: boolean;
  removeSelectedFile: () => void;
}

export default function OnboardingFormStep1({
  onFileChange,
  setCurrency,
  uploadingImage,
  fileUploaded,
  removeSelectedFile,
}: PageProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-md font-medium">Upload your logo</Label>

        <div className="p-6 min-h-[120px] relative border bg-primary/10 border-dashed border-primary rounded-md flex justify-center items-center">
          <Input
            onChange={onFileChange}
            type="file"
            id="image-upload"
            accept=".jpg,.png"
            className="hidden"
          />
          {fileUploaded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSelectedFile();
              }}
              className="bg-none border-none cursor-pointer hover:bg-gray-200 p-2 rounded-md absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            {fileUploaded ? (
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <CheckCircle className="w-5 h-5 text-primary " />
                <p className="text-sm text-muted-foreground">
                  File uploaded successfully
                </p>
              </div>
            ) : uploadingImage ? (
              <BasicLoader color="border-primary" />
            ) : (
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <Upload className="w-5 h-5" />
                <p className="text-sm text-muted-foreground">
                  Click to upload your logo
                </p>

                <p className="text-xs text-primary font-medium">
                  JPG or PNG (max 5MB)
                </p>
              </div>
            )}
          </Label>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-md font-medium">Select Currency</Label>
        <Select
          defaultValue="INR"
          onValueChange={(e) => {
            setCurrency(e);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="select your currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((c, idx) => {
              return (
                <SelectItem key={idx} value={c.code}>
                  {c.code} - {c.symbol}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
