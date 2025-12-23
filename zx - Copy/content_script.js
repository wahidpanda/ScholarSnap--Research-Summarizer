// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getText") {
        // Extract visible text from the body of the current webpage
        const bodyText = document.body.innerText;
        sendResponse({ text: bodyText });
    }
});
