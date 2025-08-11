export const onZodError = (errors: any) => {
  console.error(" Zod Validation Errors:", errors);
  console.error("Form Error Please check your inputs.");
};
