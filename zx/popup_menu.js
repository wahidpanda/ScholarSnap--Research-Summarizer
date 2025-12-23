const GEMINI_API_KEY = "AIzaSyDM6iNyBrEYyXN6i39EEU7M9XznDTnWM84";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

let btnGemini = document.getElementById("btn_gemini");
let btnExtract = document.getElementById("btn_extract");
let darkModeToggle = document.getElementById("darkModeToggle");
let inputText = document.getElementById("input_text");
let resultText = document.getElementById("result_text");
let progressBar = document.getElementById("progress_bar");
let progressBarFill = progressBar.querySelector('div');

// Function to show or hide the progress bar
function toggleProgressBar(show) {
    progressBar.style.display = show ? 'block' : 'none';
    if (!show) {
        progressBarFill.style.width = '0%'; // Reset the progress bar width
    }
}

// Function to update the progress bar based on progress
function updateProgressBar(progress) {
    progressBarFill.style.width = `${progress}%`;
}

// Function to simulate progress during API calls
function simulateProgress(duration) {
    let progress = 0;
    const interval = setInterval(() => {
        if (progress >= 90) {
            clearInterval(interval);
        } else {
            progress += 10;
            updateProgressBar(progress);
        }
    }, duration / 10);
}

// Function to summarize the input text using the Gemini API
async function summarizeText(text) {
    btnGemini.disabled = true;
    toggleProgressBar(true);
    simulateProgress(5000);

    const prompt = 
    `You are an expert research Scientist. Read the following research paper content and extract the key points, main findings, methodologies, important data, and any critical insights. Structure your response with clear headings and bullet points: First in title mention the research paper name that you are extracting make it center and bold the title
    1. **Main Findings**: Summarize the primary conclusions drawn from the research.
    2. **Key Data Points**: Highlight essential statistics or data from the study.
    3. **Methodologies Used**: Briefly describe the methods and approaches taken in this study.
    4. **Important Insights**: Provide additional insights or implications that are significant.
    5. **Provide citation ready**: Provide citation ready of that paper as APA/IEEE format for readers.
    
    Here is the text: 
    ${text}`;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        btnGemini.disabled = false;
        toggleProgressBar(false);

        if (result.candidates && result.candidates[0]?.content) {
            const responseText = result.candidates[0].content.parts[0]?.text;
            resultText.innerText = responseText || "No summary available.";
        } else {
            resultText.innerText = "No summary available.";
        }
    } catch (error) {
        console.error('Error:', error);
        resultText.innerText = "An error occurred while summarizing.";
        btnGemini.disabled = false;
        toggleProgressBar(false);
    }
}

// Add event listener for the summarize button
btnGemini.addEventListener("click", () => {
    const textToSummarize = inputText.value.trim();
    if (textToSummarize) {
        summarizeText(textToSummarize);
    } else {
        resultText.innerText = "Please enter text or extract from the page.";
    }
});

// Add event listener for the extract button
btnExtract.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getText" }, (response) => {
            if (response && response.text) {
                inputText.value = response.text;
                updateProgressBar(100); // Complete the progress bar once text is extracted
            } else {
                resultText.innerText = "Failed to extract text from the page.";
            }
        });
    });
});

// Toggle dark mode using the switch
darkModeToggle.addEventListener("change", () => {
    const body = document.body;
    const isDarkMode = darkModeToggle.checked;

    if (isDarkMode) {
        body.classList.replace("light-mode", "dark-mode");
    } else {
        body.classList.replace("dark-mode", "light-mode");
    }

    // Update input and result text areas
    inputText.classList.toggle("dark-mode", isDarkMode);
    resultText.classList.toggle("dark-mode", isDarkMode);
});
