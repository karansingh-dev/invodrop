import toast from "react-hot-toast";

export const onZodError = (errors: any) => {
  toast.error("Invalid Input Values");
  console.error(" Zod Validation Errors:", errors);
  console.error("Form Error Please check your inputs.");
};
