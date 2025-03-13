import { BATCH_SIZE, SYSTEM_PROMPT } from "~/constants";
import { generateObject, type LanguageModel } from "ai";
import { z } from "zod";

const outputSchema = z.object({
    name: z.string().describe("The conversation identifier"),
    tag: z.string().default("none").describe("The selected classification tag")
});

export async function classifyConversations(
    conversations: { name: string; conversation: string }[],
    tags: string[],
    model: LanguageModel,
    batch_size = BATCH_SIZE
) {
    const results = [];
    const batches = Math.ceil(conversations.length / batch_size);

    for (let i = 0; i < batches; i++) {
        const batch = conversations.slice(i * batch_size, (i + 1) * batch_size);

        const output = await classifyBatch(batch, tags, model);

        results.push(...output);
    }

    return results; 
}

export async function classifyBatch(
    batch: { name: string; conversation: string }[],
    tags: string[],
    model: LanguageModel
) {
    // AI Provider code here
    const { object: result } = await generateObject({
        output: "array",
        schema: outputSchema,
        model,
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            {
                role: "user",
                content: `Please classify the following conversations using these tags: ${JSON.stringify(tags)}.\nConversations:\n${JSON.stringify(batch)}`
            }
        ]
    });

    return result;
}
