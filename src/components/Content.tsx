import { CleaningServices } from "@mui/icons-material";
import { Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import { SETTINGS_STORAGE_KEY } from "~/constants";
import { useChromeStorage } from "~/hooks/useChromeStorage";
import { AIProviderFactory } from "~/structures/AIProviderFactory";
import type { Settings } from "~/types";
import { scrapeLinkedinDMs } from "~/utils/scraper";
import {
    classifyConversations,
    mockClassifyConversations
} from "~/utils/tagClassification";
import React, { useState } from "react";

const Content = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const chromeStorage = useChromeStorage();

    const handleClick = async () => {
        try {
            setLoading(() => true);
            const settings =
                await chromeStorage.getKey<Settings>(SETTINGS_STORAGE_KEY);

            if (!settings || settings.apiKey === "") {
                setMessage(
                    () => "Please set your API key in the extension settings."
                );
                setShowAlert(() => true);
                chrome.runtime.sendMessage({ action: "openPopup" });
                return;
            }
            const aiProvider = AIProviderFactory.createProvider(
                settings.provider,
                settings.apiKey,
                settings.model
            );

            const result = await scrapeLinkedinDMs();
            console.log("Scraped messages:", result);

            if (!result.length) {
                setMessage(() => "No unread messages found to organize.");
                setShowAlert(() => true);
            } else {
                const conversations = result.map((conversation) => ({
                    name: conversation.name,
                    conversation: conversation.messages
                        .map((msg) => msg.sender + ":" + msg.message)
                        .join(" ")
                }));

                // const taggedConversations = await classifyConversations(
                //     conversations,
                //     settings.tags.map((tag) => tag.name),
                //     aiProvider.client
                // );

                // Mock the classifyConversations function
                const taggedConversations = await mockClassifyConversations(
                    conversations,
                    settings.tags.map((tag) => tag.name)
                );

                console.log("Tagged conversations:", taggedConversations);

                await chromeStorage.setKey(
                    "taggedConversations",
                    taggedConversations
                );

                if (settings.autoRemoveSpamConnections) {
                    setMessage(() => "Auto-removing spam connections...");
                    setShowAlert(() => true);

                    const spamConversations = taggedConversations.filter(
                        (conversation) => conversation.tag === "spam"
                    );

                    const profileLinks = result
                        .filter((conversation) =>
                            spamConversations.some(
                                (spam) => spam.name === conversation.name
                            )
                        )
                        .map((conversation) => conversation.profileLink);

                    // Remove spam connections now!
                    console.log("Removing spam connections:", profileLinks);
                }

                setMessage(
                    () =>
                        "Messages organized successfully. Please reload the page to see the changes!"
                );
                setShowAlert(() => true);
            }
        } catch (error) {
            console.error(error);
            setMessage(() => "An error occurred while organizing messages.");
            setShowAlert(() => true);
        } finally {
            setLoading(() => false);
        }
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
                {showAlert && (
                    <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        onClose={() => setShowAlert(false)}
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
