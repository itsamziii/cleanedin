import { LinkedinSelectors } from "~/constants";

function getLinkedInMessages() {
    const messages = document.querySelectorAll(
        LinkedinSelectors.MessagesContainer
    );
    return Array.from(messages).map((msg) => {
        const isOther = msg.classList.contains(
            LinkedinSelectors.MessagesContainer.replace(".", "") + "--other"
        );
        const textElement = msg.querySelector<HTMLParagraphElement>(
            ".msg-s-event-listitem__body"
        );
        const profileLink = msg.querySelector<HTMLAnchorElement>(
            LinkedinSelectors.ProfileLink
        );

        return {
            sender: isOther ? "other" : "you",
            message: textElement ? textElement.innerText.trim() : "",
            profileLink: profileLink?.href ?? ""
        };
    });
}

export async function scrapeLinkedinDMs() {
    const converstaionList = document.querySelectorAll<HTMLLIElement>(
        LinkedinSelectors.ConverstationList
    );

    const unreadConversations = Array.from(converstaionList).filter((conv) =>
        conv.querySelector(LinkedinSelectors.CheckUnread)
    );

    const result = [];

    for (const conv of unreadConversations) {
        const clickable = conv.querySelector<HTMLDivElement>(
            LinkedinSelectors.ConversationClickable
        );

        clickable.click();

        await new Promise((res) => setTimeout(res, 1000));

        result.push({
            ...getLinkedInMessages(),
            name:
                conv
                    .querySelector(LinkedinSelectors.ConverserName)
                    ?.textContent.trim() ?? "Unknown"
        });
    }

    console.log(converstaionList, unreadConversations);

    return result;
}
