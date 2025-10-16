let runningTotal = 0;
let buffer = "0";
let previousOperator = null;

const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".calc-button");
const historyList = document.getElementById("history-list");

// Handle button clicks
function buttonClick(value) {
    if (isNaN(value) && value !== ".") {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.innerText = buffer;
}

// Handle symbols like +, −, ×, ÷, =, C, ←
function handleSymbol(symbol) {
    switch (symbol) {
        case "C":
            buffer = "0";
            runningTotal = 0;
            previousOperator = null;
            break;
        case "=":
            if (previousOperator === null) return;
            const expression = `${runningTotal} ${previousOperator} ${buffer}`;
            flushOperation(parseFloat(buffer));
            previousOperator = null;
            buffer = runningTotal.toString();
            addToHistory(`${expression} = ${buffer}`);
            runningTotal = 0;
            break;
        case "←":
            buffer = buffer.length === 1 ? "0" : buffer.slice(0, -1);
            break;
        case "+":
        case "−":
        case "×":
        case "÷":
            handleMath(symbol);
            break;
    }
}

// Handle math operations
function handleMath(symbol) {
    if (buffer === "0") return;

    const intBuffer = parseFloat(buffer);

    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }

    previousOperator = symbol;
    buffer = "0";
}

// Perform the actual calculation
function flushOperation(intBuffer) {
    if (previousOperator === "+") {
        runningTotal += intBuffer;
    } else if (previousOperator === "−") {
        runningTotal -= intBuffer;
    } else if (previousOperator === "×") {
        runningTotal *= intBuffer;
    } else if (previousOperator === "÷") {
        runningTotal /= intBuffer;
    }
}

// Handle number and decimal input
function handleNumber(numberString) {
    if (numberString === "." && buffer.includes(".")) return;
    buffer = buffer === "0" ? numberString : buffer + numberString;
}

// Add entry to history
function addToHistory(entry) {
    const historyItem = document.createElement("li");
    historyItem.textContent = entry;
    historyList.appendChild(historyItem);
}

// Animate button press
function animateButton(button) {
    button.classList.add("pressed");
    setTimeout(() => button.classList.remove("pressed"), 150);
}

// Simulate button press from keyboard
function simulateButtonPress(value) {
    const button = Array.from(buttons).find(btn => btn.innerText.trim() === value);
    if (button) animateButton(button);
}

// Initialize calculator
function init() {
    // Mouse click support
    document.querySelector(".calc-buttons").addEventListener("click", function (event) {
        if (event.target.matches("button")) {
            const value = event.target.innerText.trim();
            buttonClick(value);
            animateButton(event.target);
        }
    });

    // Keyboard support
    document.addEventListener("keydown", (event) => {
        const key = event.key;
        const keyMap = {
            "/": "÷",
            "*": "×",
            "-": "−",
            "+": "+",
            "Enter": "=",
            "=": "=",
            "Backspace": "←",
            "c": "C",
            "C": "C"
        };

        const mappedKey = keyMap[key] || key;
        if (/[\d.+\-*/=cCBackspaceEnter]/.test(key)) {
            buttonClick(mappedKey);
            simulateButtonPress(mappedKey);
        }
    });

    // Dark mode toggle
    document.getElementById("dark-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

    // Clear history
    document.getElementById("clear-history").addEventListener("click", () => {
        historyList.innerHTML = "";
    });
}

init();