import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    type SelectChangeEvent
} from "@mui/material";
import React from "react";
import { type AIModel, type AIProviderType } from "../types";

interface ProviderSettingsProps {
    provider: AIProviderType;
    model: string;
    apiKey: string;
    availableModels: AIModel[];
    apiKeyError: boolean;
    onProviderChange: (provider: AIProviderType) => void;
    onModelChange: (model: string) => void;
    onApiKeyChange: (apiKey: string) => void;
}

const ProviderSettings: React.FC<ProviderSettingsProps> = ({
    provider,
    model,
    apiKey,
    availableModels,
    apiKeyError,
    onProviderChange,
    onModelChange,
    onApiKeyChange
}) => {
    const handleProviderChange = (event: SelectChangeEvent) => {
        onProviderChange(event.target.value as AIProviderType);
    };

    const handleModelChange = (event: SelectChangeEvent) => {
        onModelChange(event.target.value);
    };

    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onApiKeyChange(event.target.value);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
            >
                AI Provider Configuration
            </Typography>
            <Stack spacing={2}>
                <FormControl fullWidth size="small">
                    <InputLabel id="provider-label">Provider</InputLabel>
                    <Select
                        labelId="provider-label"
                        value={provider}
                        label="Provider"
                        onChange={handleProviderChange}
                    >
                        <MenuItem value="OpenAI">OpenAI</MenuItem>
                        <MenuItem value="Claude">Claude</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel id="model-label">Model</InputLabel>
                    <Select
                        labelId="model-label"
                        value={model}
                        label="Model"
                        onChange={handleModelChange}
                    >
                        {availableModels.map((model) => (
                            <MenuItem key={model.name} value={model.name}>
                                {model.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="API Key"
                    type="password"
                    size="small"
                    fullWidth
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    error={apiKeyError}
                    helperText={apiKeyError ? "Invalid API key" : ""}
                />
            </Stack>
        </Box>
    );
};

export default ProviderSettings;
