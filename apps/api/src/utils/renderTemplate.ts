/**
 Render the ejs templates, used while sending emails
 */
import path from "path";
import fs from "fs";
import ejs from "ejs";

const viewsFolderPath = "../../views";

export function renderTemplate(templateName: string, data: object): string {
  const templatePath = path.resolve(
    __dirname,
    viewsFolderPath,
    `${templateName}.ejs`
  );
  const template = fs.readFileSync(templatePath, "utf-8");
  return ejs.render(template, data);
}
