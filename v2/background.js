chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "pdfData") {
        console.log("Received PDF data:", request.data);
        // Do something with the extracted data, like saving it or displaying it in the popup.
    }
});
