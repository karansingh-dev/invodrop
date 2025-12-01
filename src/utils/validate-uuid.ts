import z from "zod";

const uuid = z.uuidv4();

export function isUUID(id: string) {
  const value = uuid.safeParse(id);
  return value.success;
}
