import { OnboardAuth } from "@/features/onboarding/components/onboard-auth";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OnboardAuth>{children}</OnboardAuth>;
}
