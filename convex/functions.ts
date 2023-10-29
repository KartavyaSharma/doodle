import { v } from "convex/values"
import { query, mutation, action } from "./_generated/server"
import { api } from "./_generated/api"
import { PaginationResult, paginationOptsValidator } from "convex/server"

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
    args: {
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        let doodles: PaginationResult | ;
        if (args.paginationOpts){
            doodles = await ctx.db.query("doodles").paginate(args.paginationOpts) 
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