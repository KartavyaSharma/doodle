// OPTIONAL: Rename this file to `schema.ts` to declare the shape
// of the data in your database.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    doodles: defineTable({
      body: v.string(),
      author: v.string(),
      format: v.string()
    })
  },
);