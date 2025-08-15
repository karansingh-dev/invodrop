"use client";
import { useSignOut } from "@/actions/logout";
import BasicLoader from "@/components/atoms/basic-loader";
import { Button } from "@/components/ui/button";
import OnboardingCarousal from "@/features/onboarding/onboarding-carousal";

export default function Onboarding() {
  const { signOut, loading } = useSignOut();

  return (
    <div className="flex min-h-screen justify-center items-center">
      <Button
        className="border-primary hover:bg-secondary/50 absolute top-4 left-4"
        variant="outline"
        onClick={async (e) => {
          e.preventDefault();
          await signOut();
        }}
      >
        {loading ? <BasicLoader /> : <p>Logout</p>}
      </Button>
      <OnboardingCarousal />
    </div>
  );
}
