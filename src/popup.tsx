import {
    Box,
    Button,
    Container,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    ThemeProvider,
    Typography
} from "@mui/material";
import ProviderSettings from "~/components/ProviderSettings";
import TagManagement from "~/components/TagManagement";
import { SETTINGS_STORAGE_KEY } from "~/constants";
import { useChromeStorage } from "~/hooks/useChromeStorage";
import {
    AIProviderFactory,
    type AIProviderType
} from "~/structures/AIProviderFactory";
import React, { useEffect, useState } from "react";
import AutoRemoveOption from "./components/AutoRemoveOption";
import ErrorSnackbar from "./components/ErrorSnackbar";
import SaveButton from "./components/SaveButton";
import { type AIModel, type Settings, type Tag } from "./types";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0"
        },
        secondary: {
            main: "#ffffff"
        },
        background: {
            default: "#f5f9ff",
            paper: "#ffffff"
        },
        error: {
            main: "#f44336"
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    }
});

const modelOptions: Record<AIProviderType, AIModel[]> = {
    OpenAI: [
        { provider: "OpenAI", name: "gpt-3.5-turbo" },
        { provider: "OpenAI", name: "gpt-4-turbo" },
        { provider: "OpenAI", name: "gpt-4o" }
    ],
    Claude: [
        { provider: "Claude", name: "claude-3-haiku" },
        { provider: "Claude", name: "claude-3-sonnet" },
        { provider: "Claude", name: "claude-3-opus" }
    ]
};

const Popup: React.FC = () => {
    const defaultSettings: Settings = {
        provider: "OpenAI",
        model: "gpt-3.5-turbo",
        apiKey: "",
        tags: [{ id: 1, name: "spam", removable: false }],
        autoRemoveSpamConnections: false
    };

    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [availableModels, setAvailableModels] = useState<AIModel[]>(
        modelOptions["OpenAI"]
    );
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [apiKeyError, setApiKeyError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [clearDialogOpen, setClearDialogOpen] = useState<boolean>(false);

    const chromeStorage = useChromeStorage();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const savedSettings =
                await chromeStorage.getKey<Settings>(SETTINGS_STORAGE_KEY);

            if (savedSettings) {
                setSettings(savedSettings);
                setAvailableModels(modelOptions[savedSettings.provider]);
            }
        } catch (error) {
            console.error("Error loading settings from Chrome storage:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSettings = async () => {
        try {
            setSaveLoading(true);
            setApiKeyError(false);
            setErrorMessage("");

            const aiProvider = AIProviderFactory.createProvider(
                settings.provider,
                settings.apiKey,
                settings.model
            );

            const checkApiKeyValidity = await aiProvider.validateApiKey();
            if (!checkApiKeyValidity) {
                setApiKeyError(true);
                setErrorMessage(
                    `Invalid ${settings.provider} API key. Please check and try again.`
                );
            } else {
                await chromeStorage.setKey(SETTINGS_STORAGE_KEY, settings);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            }
            setSaveLoading(false);
        } catch (error) {
            console.error("Error saving settings to Chrome storage:", error);
            setApiKeyError(true);
            setErrorMessage(
                `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
            );
            setSaveLoading(false);
        }
    };

    const handleProviderChange = (newProvider: AIProviderType) => {
        const models = modelOptions[newProvider];

        setApiKeyError(false);
        setErrorMessage("");
        setAvailableModels(models);
        setSettings({
            ...settings,
            provider: newProvider,
            model: models[0].name
        });
    };

    const handleModelChange = (model: string) => {
        setSettings({
            ...settings,
            model: model
        });
    };

    const handleApiKeyChange = (apiKey: string) => {
        if (apiKeyError) {
            setApiKeyError(false);
            setErrorMessage("");
        }

        setSettings({
            ...settings,
            apiKey: apiKey
        });
    };

    const handleAutoRemoveChange = (checked: boolean) => {
        setSettings({
            ...settings,
            autoRemoveSpamConnections: checked
        });
    };

    const handleTagsChange = (tags: Tag[]) => {
        setSettings({
            ...settings,
            tags: tags
        });
    };

    const handleCloseError = () => {
        setApiKeyError(false);
        setErrorMessage("");
    };

    // Clear all local data
    const handleClearData = async () => {
        try {
            await chrome.storage.local.clear();
            // Reset to default settings
            setSettings(defaultSettings);
            setAvailableModels(modelOptions["OpenAI"]);
        } catch (error) {
            console.error("Error clearing data from Chrome storage:", error);
            setApiKeyError(true);
            setErrorMessage("Failed to clear data. Please try again.");
        } finally {
            setClearDialogOpen(false);
        }
    };

    // Render loading state
    if (isLoading) {
        return (
            <ThemeProvider theme={theme}>
                <Container
                    maxWidth="xs"
                    sx={{
                        py: 2,
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Typography>Loading settings...</Typography>
                </Container>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    width: "350px",
                    height: "500px",
                    overflow: "auto",
                    p: 2,
                    "&::-webkit-scrollbar": {
                        display: "none"
                    },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    scrollbarColor: "transparent transparent"
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{
                            mb: 3,
                            color: "primary.main",
                            fontWeight: "bold",
                            textAlign: "center"
                        }}
                    >
                        Cleanedin
                    </Typography>

                    <ProviderSettings
                        provider={settings.provider}
                        model={settings.model}
                        apiKey={settings.apiKey}
                        availableModels={availableModels}
                        apiKeyError={apiKeyError}
                        onProviderChange={handleProviderChange}
                        onModelChange={handleModelChange}
                        onApiKeyChange={handleApiKeyChange}
                    />

                    <TagManagement
                        tags={settings.tags}
                        onTagsChange={handleTagsChange}
                    />

                    {/* <AutoRemoveOption
                        autoRemoveSpamConnections={
                            settings.autoRemoveSpamConnections
                        }
                        onChange={handleAutoRemoveChange}
                    /> */}

                    <Box
                        sx={{
                            mt: "auto",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <SaveButton
                            isSaved={isSaved}
                            onSave={saveSettings}
                            loading={saveLoading}
                        />

                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => setClearDialogOpen(true)}
                            sx={{ mt: 1 }}
                        >
                            Clear All Data
                        </Button>
                    </Box>
                </Paper>

                <ErrorSnackbar
                    open={apiKeyError}
                    message={
                        errorMessage || `Invalid ${settings.provider} API key`
                    }
                    onClose={handleCloseError}
                />

                <Dialog
                    open={clearDialogOpen}
                    onClose={() => setClearDialogOpen(false)}
                    PaperProps={{
                        sx: {
                            mb: 2
                        }
                    }}
                >
                    <DialogTitle>Clear All Data?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            This will remove all your settings including API
                            keys, cached tagged conversations and custom tags.
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setClearDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleClearData}
                            color="error"
                            autoFocus
                        >
                            Clear Data
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default Popup;
