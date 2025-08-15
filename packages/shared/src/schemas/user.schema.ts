import { z } from "zod";

export const createCompanySchema = z.object({

  name: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must not exceed 100 characters")
    .trim(),

  
  addressLine1: z
    .string()
    .min(1, "Address line 1 is required")
    .max(255, "Address line 1 must not exceed 255 characters")
    .trim(),

  addressLine2: z
    .string()
    .max(255, "Address line 2 must not exceed 255 characters")
    .trim()
    .optional()
    .or(z.literal("")), // Handle empty strings as undefined

  city: z
    .string()
    .min(1, "City is required")
    .max(30, "City must not exceed 30 characters")
    .trim(),

  state: z
    .string()
    .min(1, "State is required")
    .max(30, "State must not exceed 30 characters")
    .trim(),

  country: z
    .string()
    .length(2, "Country must be a valid 2-letter ISO code")
    .toUpperCase() // Ensure uppercase for consistency
    .regex(/^[A-Z]{2}$/, "Country must contain only letters"),

  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(15, "Postal code must not exceed 15 characters")
    .trim(),

  // Optional business details
  taxId: z
    .string()
    .max(30, "Tax ID must not exceed 30 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  email: z
    .email("Must be a valid email address")
    .max(100, "Email must not exceed 100 characters")
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .max(20, "Phone number must not exceed 20 characters")
    .regex(/^[\d\s\-\+\(\)]*$/, "Phone number contains invalid characters")
    .trim()
    .optional()
    .or(z.literal("")),

  website: z

    .url("Must be a valid URL")
    .max(255, "Website URL must not exceed 255 characters")
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      return val.startsWith("http://") || val.startsWith("https://");
    }, "Website must include http:// or https://"),

  logoUrl: z
    .url("Must be a valid URL")
    .max(255, "Logo URL must not exceed 255 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  // Business settings
  defaultCurrency: z
    .string()
    .min(1, "Default currency is required")
    .max(10, "Currency code must not exceed 10 characters")
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "Must be a valid 3-letter ISO 4217 currency code"),

  defaultInvoiceNote: z.string().trim().optional().or(z.literal("")),

  invoicePrefix: z
    .string()
    .min(1, "Invoice prefix is required")
    .max(10, "Invoice prefix must not exceed 10 characters")
    .trim()
    .regex(
      /^[A-Za-z0-9\-_]*$/,
      "Invoice prefix can only contain letters, numbers, hyphens, and underscores"
    ),
});

export const fileExtensionSchema = z.object({
  fileExtension: z.enum(["png", "svg", "gif", "jpg"]),
});

export type FileExtensionType = z.infer<typeof fileExtensionSchema>;

export type CreateCompanyData = z.infer<typeof createCompanySchema>;
