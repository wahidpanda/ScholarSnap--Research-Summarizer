// fileUploader.js
export function handleFileUpload(fileUploader, inputText, resultText) {
    fileUploader.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                inputText.value = e.target.result; // Populate the input text area
                resultText.innerText = ""; // Clear any previous results
            };
            reader.onerror = () => {
                resultText.innerText = "Error reading the file.";
            };
            reader.readAsText(file); // Read the file content as text
        } else {
            resultText.innerText = "No file selected.";
        }
    });
}
