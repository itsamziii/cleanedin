import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText, type LanguageModel } from "ai";
import { AIProvider } from "./BaseProvider";

export class AnthropicProvider extends AIProvider {
    private _client: LanguageModel | null = null;
    public constructor(
        private apiKey: string,
        private model: string
    ) {
        super();
        this.initClient();
    }

    private async initClient() {
        try {
            this._client = createAnthropic({
                apiKey: this.apiKey
            }).languageModel(this.model);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    public async validateApiKey(): Promise<boolean> {
        try {
            await generateText({
                model: this._client,
                prompt: "hello",
                maxTokens: 1
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    public get client(): LanguageModel | null {
        return this._client;
    }
}
