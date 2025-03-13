import { CleaningServices } from "@mui/icons-material";
import { Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import { SETTINGS_STORAGE_KEY } from "~/constants";
import { useChromeStorage } from "~/hooks/useChromeStorage";
import { AIProviderFactory } from "~/structures/AIProviderFactory";
import type { Settings } from "~/types";
import { scrapeLinkedinDMs } from "~/utils/scraper";
import React, { useState } from "react";

const Content = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showNoResultsAlert, setShowNoResultsAlert] =
        useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const chromeStorage = useChromeStorage();

    const handleClick = async () => {
        setLoading(() => true);
        const settings =
            await chromeStorage.getKey<Settings>(SETTINGS_STORAGE_KEY);

        if (!settings || settings.apiKey === "") {
            setMessage(
                () => "Please set your API key in the extension settings."
            );
            setShowNoResultsAlert(() => true);
            setLoading(() => false);
            chrome.runtime.sendMessage({ action: "openPopup" });
            return;
        }

        const result = await scrapeLinkedinDMs();
        if (!result.length) {
            setMessage(() => "No unread messages found to organize.");
            setShowNoResultsAlert(() => true);
        } else {
            console.log(result);
        }

        setLoading(() => false);
    };

    return (
        <div
            style={{
                zIndex: 50,
                position: "fixed",
                bottom: "60px",
                right: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end"
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%"
                }}
            >
                {showNoResultsAlert && (
                    <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        onClose={() => setShowNoResultsAlert(false)}
                    >
                        {message ?? "No messages found to organize."}
                    </Alert>
                )}
            </div>

            <Button
                variant="contained"
                size="large"
                startIcon={<CleaningServices />}
                disabled={loading}
                onClick={handleClick}
            >
                {loading ? "Loading..." : "Organize DM's"}
            </Button>
        </div>
    );
};

export default Content;
