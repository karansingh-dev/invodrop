import BasicLoader from "@/components/atoms/basic-loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { OnboardingFormType } from "../hooks/useOnboardingForm";

export default function OnboardingStep1({
  register,
  uploadingImage,
  handleLogoUpload,
  setValue,
  logoUrl,
}: OnboardingFormType) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Label htmlFor="name">Company name</Label>
        <Input
          {...register("name")}
          id="name"
          type="text"
          placeholder="Acme "
        />
      </div>

      <div className="grid gap-3">
        <Label
          htmlFor="logo"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Upload company logo
        </Label>

        <div className="relative group">
          {/* Main upload area */}
          <div className="bg-muted/50 flex flex-col justify-center items-center h-40 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-muted/70 transition-all duration-200 cursor-pointer">
            {uploadingImage ? (
              <BasicLoader className="text-primary w-8 h-8" />
            ) : logoUrl ? ( // if logoUrl  exists, show success UI
              <div className="flex flex-col items-center gap-3 text-center p-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Logo uploaded!
                </p>

                <button
                  onClick={() => {
                    setValue("logoUrl", "");
                  }}
                  className="px-3 py-1 text-sm rounded-md bg-primary text-white hover:bg-primary/80"
                >
                  Upload Again
                </button>
              </div>
            ) : (
              // Original upload UI
              <div>
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>

                <Input
                  disabled={uploadingImage}
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (!e.target.files?.[0]) {
                      toast.error("Error uploading file");
                    } else {
                      await handleLogoUpload(e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
