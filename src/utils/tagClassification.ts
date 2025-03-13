import { BATCH_SIZE, SYSTEM_PROMPT } from "~/constants";
import { generateObject, type LanguageModel } from "ai";
import { z } from "zod";

type Conversation = {
    name: string;
    conversation: string;
};

const outputSchema = z.object({
    name: z.string().describe("The conversation identifier"),
    tag: z.string().default("none").describe("The selected classification tag")
});

export async function classifyConversations(
    conversations: Conversation[],
    tags: string[],
    model: LanguageModel,
    batch_size = BATCH_SIZE
): Promise<z.infer<typeof outputSchema>[]> {
    const results = [];
    const batches = Math.ceil(conversations.length / batch_size);

    for (let i = 0; i < batches; i++) {
        const batch = conversations.slice(i * batch_size, (i + 1) * batch_size);

        const output = await classifyBatch(batch, tags, model);

        results.push(...output);
    }

    return results;
}

async function classifyBatch(
    batch: Conversation[],
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

export async function mockClassifyConversations(
    conversations: Conversation[],
    availableTags: string[]
): Promise<z.infer<typeof outputSchema>[]> {
    // Simulate network delay

    return conversations.map((conversation) => {
        // Get a random tag from available tags
        const randomTagIndex = Math.floor(Math.random() * availableTags.length);
        const randomTag = availableTags[randomTagIndex];

        // Generate a random confidence level between 0.6 and 1.0

        return {
            name: conversation.name,
            tag: randomTag
        };
    });
}
