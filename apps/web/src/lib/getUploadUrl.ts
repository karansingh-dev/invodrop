import { apiRequest } from "./api";

export const getUploadUrl = async (
  fileExtension: string
): Promise<string | undefined> => {
  const response = await apiRequest<string>("/user/get-presignedurl", {
    method: "GET",
    protected: true,
    params: {
      fileExtension,
    },
  });

  return response.data;
};
