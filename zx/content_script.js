// content_script.js

// Load the PDF.js library
const script = document.createElement('script');
script.src = chrome.runtime.getURL('pdfjs/pdf.js');  // Path to your pdf.js
document.head.appendChild(script);

script.onload = () => {
    // Use PDF.js to extract text
    pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdfjs/pdf.worker.js');

    // Get the PDF document
    pdfjsLib.getDocument(window.location.href).promise.then(pdf => {
        let extractedText = "";
        const numPages = pdf.numPages;

        // Extract text from each page
        const textPromises = [];
        for (let i = 1; i <= numPages; i++) {
            textPromises.push(
                pdf.getPage(i).then(page => {
                    return page.getTextContent().then(textContent => {
                        return textContent.items.map(item => item.str).join(" ");
                    });
                })
            );
        }

        // Wait for all text extraction to complete
        Promise.all(textPromises).then(texts => {
            extractedText = texts.join(" "); // Combine text from all pages
            console.log("Extracted text: ", extractedText);
            // Send the extracted data back to your background script or popup
            chrome.runtime.sendMessage({ type: "pdfData", data: extractedText });
        });
    }).catch(err => console.error('Error extracting PDF:', err));
};
