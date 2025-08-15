


export const uploadFile = async (file: File, uploadUrl: string) => {
  try {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: file,
    });

    if (!res.ok) throw new Error("Failed upload logo");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
