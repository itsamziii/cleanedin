import type { LanguageModel } from "ai";

export abstract class AIProvider {
    abstract validateApiKey(): Promise<boolean>;

    abstract get client(): LanguageModel | null;
}
