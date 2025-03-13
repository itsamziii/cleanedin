import { LinkedinSelectors } from "~/constants";

type LinkedInMessage = {
    sender: "me" | "other";
    message: string;
};

type ScrapedResults = {
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

export async function scrapeLinkedinDMs(): Promise<ScrapedResults[]> {
    const converstaionList = document.querySelectorAll<HTMLLIElement>(
        LinkedinSelectors.ConverstationList
    );

    const unreadConversations = Array.from(converstaionList).filter((conv) =>
        conv.querySelector(LinkedinSelectors.CheckUnread)
    );

    const result: ScrapedResults[] = [];

    for (const conv of unreadConversations) {
        const clickable = conv.querySelector<HTMLDivElement>(
            LinkedinSelectors.ConversationClickable
        );

        clickable.click();

        await new Promise((res) => setTimeout(res, 1000));

        result.push({
            name:
                conv
                    .querySelector(LinkedinSelectors.ConverserName)
                    ?.textContent.trim() ?? "Unknown",
            profileLink: document.querySelector<HTMLAnchorElement>(
                LinkedinSelectors.ProfileLink
            )?.href,
            messages: getLinkedInMessages()
        });
    }

    return result;
}
