import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type LanguageModel } from "ai";
import { AIProvider } from "./BaseProvider";

export class OpenAIProvider extends AIProvider {
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
            this._client = createOpenAI({ apiKey: this.apiKey }).languageModel(
                this.model
            );
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
