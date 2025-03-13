import {
    LinkedinSelectors,
    TAGGED_CONVERSATIONS_STORAGE_KEY
} from "~/constants";
import { getConversationList } from "~/utils/scraper";
import { debounce } from "lodash";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";

export const config: PlasmoCSConfig = {
    matches: ["https://www.linkedin.com/messaging/*"],
    run_at: "document_idle"
};

export {};

const applyLabelsToConversations = debounce(() => {
    const targetElement = document.querySelector(
        LinkedinSelectors.ConverstationList
    );

    if (!targetElement) return;

    console.log("Applying labels to conversations...");

    chrome.storage.local.get(
        TAGGED_CONVERSATIONS_STORAGE_KEY,
        function (result) {
            const labelledConversations: { name: string; tag: string }[] =
                result.taggedConversations || [];

            console.log("Labelled conversations:", labelledConversations);

            if (!labelledConversations || labelledConversations.length === 0) {
                console.log("No conversation labels found in storage");
                return;
            }

            const loadedConversations = getConversationList();
            console.log("Loaded conversations:", loadedConversations);
            if (loadedConversations.length === 0) {
                console.log("No conversations found on page");
                return;
            }

            loadedConversations.forEach((conversation) => {
                const nameElement = conversation.querySelector(
                    LinkedinSelectors.ConverserName
                );

                if (!nameElement || !nameElement.textContent) {
                    return;
                }

                const name = nameElement.textContent.trim();
                const conversationData = labelledConversations.find(
                    (conv) => conv.name === name
                );

                if (!conversationData) {
                    return;
                }

                const existingLabel =
                    conversation.querySelector<HTMLDivElement>(
                        ".conversation-custom-label"
                    );
                if (existingLabel) {
                    existingLabel.textContent = conversationData.tag;
                    existingLabel.style.backgroundColor =
                        generateColorFromString(conversationData.tag);
                } else {
                    applyLabelToConversation(conversation, conversationData);
                }
            });
        }
    );

    observer.disconnect();
}, 500);

const observer = new MutationObserver(() => {
    applyLabelsToConversations();
});

function initializeObserver() {
    const targetElement = document.querySelector(
        LinkedinSelectors.ConverstationList
    );

    if (targetElement) {
        console.log("Found conversation list, setting up observer");

        observer.observe(targetElement, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        applyLabelsToConversations();
    } else {
        console.log("Conversation list not found, will retry...");
        setTimeout(initializeObserver, 1000);
    }
}

initializeObserver();

function generateColorFromString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).slice(-2);
    }

    return color;
}

function applyLabelToConversation(
    conversationItem: HTMLLIElement,
    labelData: { name: string; tag: string }
) {
    const labelElement = document.createElement("div");
    labelElement.className = "conversation-custom-label";
    labelElement.textContent = labelData.tag;
    // Stylin the label
    labelElement.style.backgroundColor = generateColorFromString(labelData.tag);
    labelElement.style.display = "inline-block";
    labelElement.style.padding = "3px 8px";
    labelElement.style.borderRadius = "12px";
    labelElement.style.color = "white";
    labelElement.style.fontSize = "12px";
    labelElement.style.fontWeight = "bold";
    labelElement.style.marginLeft = "8px";
    labelElement.style.verticalAlign = "middle";

    const titleRow = conversationItem.querySelector(
        ".msg-conversation-card__title-row"
    );

    if (titleRow) {
        const participantNamesElement = titleRow.querySelector(
            ".msg-conversation-listitem__participant-names"
        );

        if (participantNamesElement) {
            participantNamesElement.appendChild(labelElement);
        }
    }
}
