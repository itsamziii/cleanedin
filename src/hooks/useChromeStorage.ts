export const useChromeStorage = () => {
    return {
        setKey: async <T>(key: string, value: T) => {
            return new Promise<void>((resolve) => {
                chrome.storage.local.set({ [key]: value }, () => resolve());
            });
        },

        getKey: async <T>(key: string): Promise<T | null> => {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result) =>
                    resolve(result[key] as T | null)
                );
            });
        }
    };
};
