import app from "../../app.js";
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  return app.fetch(req, {}, context as any);
};

export const config = {
  path: "/*"
};
