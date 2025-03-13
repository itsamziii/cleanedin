export interface Tag {
    id: number;
    name: string;
    removable: boolean;
}

export interface AIModel {
    provider: AIProviderType;
    name: string;
}

export interface Settings {
    provider: AIProviderType;
    model: string;
    apiKey: string;
    tags: Tag[];
    autoRemoveSpamConnections: boolean;
}

export type AIProviderType = "OpenAI" | "Claude";
