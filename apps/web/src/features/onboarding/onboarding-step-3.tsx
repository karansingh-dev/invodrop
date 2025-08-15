import { Label } from "@/components/ui/label";
import { OnboardingFormType, useOnboardingForm } from "./useOnboardingForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@repo/shared";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OnboardingStep3({
  register,
  defaultCurrency,
  handleCurrency,
  invoicePrefix,
}: OnboardingFormType) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Label>Default Currency</Label>
        <Select
          value={defaultCurrency}
          onValueChange={(e) => {
            handleCurrency(e);
          }}
        >
          <SelectTrigger id="defaultCurrency" className="w-full">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_CURRENCIES.map((currency) => {
              return (
                <SelectItem key={currency.name} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
        <Input
          {...register("invoicePrefix")}
          value={invoicePrefix}
          type="text"
          id="invoicePrefix"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="taxId">
          Tax Id <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          {...register("taxId")}
          type="text"
          id="taxId"
          placeholder="Gst number, Vat etc"
        />
        <p className="text-sm text-muted-foreground">
          If your business is registered for taxes, enter your registration
          number (GST, VAT, EIN, etc.){" "}
        </p>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="defaultInvoiceNote">Default Invoice Note</Label>
        <Textarea
          {...register("defaultInvoiceNote")}
          id="defaultInvoiceNote"
          className="h-20"
          placeholder="Type your message here."
        />
      </div>
    </div>
  );
}
