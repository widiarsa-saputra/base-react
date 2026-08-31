import { z } from "zod";

const AddPostSchema = z.object({
    title: z.string()
})


export { AddPostSchema }
export type AddPost = z.infer<typeof AddPostSchema>