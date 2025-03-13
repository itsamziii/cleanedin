import { AnthropicProvider } from "./ai/AnthropicProvider";
import type { AIProvider } from "./ai/BaseProvider";
import { OpenAIProvider } from "./ai/OpenAIProvider";

export type AIProviderType = "OpenAI" | "Claude";

export class AIProviderFactory {
    static createProvider(
        type: AIProviderType,
        apiKey: string,
        model: string
    ): AIProvider {
        switch (type) {
            case "OpenAI":
                return new OpenAIProvider(apiKey, model);
            case "Claude":
                return new AnthropicProvider(apiKey, model);
            default:
                throw new Error("Invalid AI provider type");
        }
    }
}
