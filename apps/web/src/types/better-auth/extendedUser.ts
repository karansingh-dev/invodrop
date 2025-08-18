export type ExtendedUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
  role: "ADMIN" | "USER";
  onboardingCompleted: boolean;
  timezone: string;
};
