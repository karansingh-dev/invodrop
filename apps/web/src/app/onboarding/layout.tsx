import { OnboardAuth } from "@/features/onboarding/onboard-auth";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OnboardAuth>{children}</OnboardAuth>;
}
