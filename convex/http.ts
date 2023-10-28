import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/getImage",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const { searchParams } = new URL(request.url);
        const storageId = searchParams.get("storageId")!;
        const blob = await ctx.storage.get(storageId);
        if (blob === null) {
            return new Response("Image not found", {
                status: 404,
            });
        }
        return new Response(blob);
    }),
});

http.route({
    path: "/sendImage",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        // Step 1: Store the file
        const blob = await request.blob();
        const storageId = await ctx.storage.store(blob);

        // Step 2: Save the storage ID to the database via a mutation
        const author = new URL(request.url).searchParams.get("author") as string;
        await ctx.runMutation(api.functions.sendImage, { storageId, author });

        // Step 3: Return a response with the correct CORS headers
        return new Response(null, {
            status: 200,
            // CORS headers
            headers: new Headers({
                // e.g. https://mywebsite.com
                "Access-Control-Allow-Origin": "http://localhost:5173",
                Vary: "origin",
            }),
        });
    }),
});

export default http;