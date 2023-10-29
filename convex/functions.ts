import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { paginationOptsValidator } from "convex/server"

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
        paginationOpts: v.optional(paginationOptsValidator)
    },
    handler: async (ctx, args) => {
        let doodles;
        if (args.paginationOpts){
            doodles = await ctx.db.query("doodles").order("desc").paginate(args.paginationOpts) 

            for (let i = 0 ; i < doodles.page.length; i++){
                doodles.page[i] = {
                    ...doodles.page[i],
                    // If the doodle is an "image", its `body` is a `StorageId`
                    ...(doodles.page[i].format === "image"
                        ? { url: await ctx.storage.getUrl(doodles.page[i].body) }
                        : {}),
                }
            }
            return doodles
        }
        doodles = await ctx.db.query("doodles").order("desc").collect();
        
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