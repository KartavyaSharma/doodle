import { v } from "convex/values"
import { query, mutation, action } from "./_generated/server"
import { api } from "./_generated/api"

// Mutation to store image object id in database
export const sendImage = mutation({
    args: { storageId: v.string(), author: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("doodles", {
            body: args.storageId,
            author: args.author,
            format: 'image'
        })
    }
})

// Get image storageId from database
export const list = query({
    args: {limit:v.optional(v.number())},
    handler: async (ctx, args) => {
        let doodles;
        if (args.limit){
            doodles = await ctx.db.query("doodles").take(args.limit);
        } else {
            doodles = await ctx.db.query("doodles").collect();
        }
        return Promise.all(
            doodles.map(async (doodle) => ({
                ...doodle,
                // If the doodle is an "image", its `body` is a `StorageId`
                ...(doodle.format === "image"
                    ? { url: await ctx.storage.getUrl(doodle.body) }
                    : {}),
            }))
        );
    },
});