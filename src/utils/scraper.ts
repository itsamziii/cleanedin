import { LinkedinSelectors } from "~/constants";

type LinkedInMessage = {
    sender: "me" | "other";
    message: string;
};

export type ScrapedResults = {
    name: string;
    profileLink: string;
    messages: LinkedInMessage[];
};

function getLinkedInMessages(): LinkedInMessage[] {
    const messages = document.querySelectorAll(
        LinkedinSelectors.MessagesContainer
    );
    return Array.from(messages).map((msg) => {
        const isOther = msg.classList.contains(
            LinkedinSelectors.MessagesContainer.replace(".", "") + "--other"
        );
        const textElement = msg.querySelector<HTMLParagraphElement>(
            LinkedinSelectors.MessageBody
        );

        return {
            sender: isOther ? "other" : "me",
            message: textElement ? textElement.innerText.trim() : ""
        };
    });
}

export function getConversationList({
    unreadOnly = false
}: { unreadOnly?: boolean } = {}): HTMLLIElement[] {
    const conversationList = document.querySelectorAll<HTMLLIElement>(
        LinkedinSelectors.ConverstationList
    );

    const allConversations = Array.from(conversationList);

    if (unreadOnly) {
        return allConversations.filter((conv) =>
            conv.querySelector(LinkedinSelectors.CheckUnread)
        );
    }

    return allConversations;
}

export async function scrapeLinkedinDMs({
    unreadOnly = true
}: { unreadOnly?: boolean } = {}): Promise<ScrapedResults[]> {
    const conversationsToScrape = getConversationList({ unreadOnly });

    const result: ScrapedResults[] = [];

    for (const conv of conversationsToScrape) {
        const clickable = conv.querySelector<HTMLDivElement>(
            LinkedinSelectors.ConversationClickable
        );

        if (!clickable) continue;

        clickable.click();

        await new Promise((res) => setTimeout(res, 1000));

        result.push({
            name:
                conv
                    .querySelector(LinkedinSelectors.ConverserName)
                    ?.textContent?.trim() ?? "Unknown",
            profileLink:
                document.querySelector<HTMLAnchorElement>(
                    LinkedinSelectors.ProfileLink
                )?.href ?? "",
            messages: getLinkedInMessages()
        });
    }

    return result;
}
