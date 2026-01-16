"use strict";

const TEXTS = [
    "Programmieren macht Spaß und erfordert Konzentration und Übung.",
    "Die Schreibgeschwindigkeit verbessert sich mit regelmäßigem Training.",
    "GitHub Pages ist eine einfache Möglichkeit Webseiten zu veröffentlichen.",
    "Sauberer Code ist genauso wichtig wie funktionierender Code.",
    "Ein gutes Benutzererlebnis beginnt mit durchdachtem Design."
];

const textEl = document.getElementById("text");
const inputEl = document.getElementById("input");
const timerEl = document.getElementById("timer");
const resultsEl = document.getElementById("results");
const timeSelectEl = document.getElementById("timeSelect");

let timer = null;
let timeLeft = 0;
let running = false;
let currentText = "";

function startTest() {
    clearInterval(timer);

    timeLeft = parseInt(timeSelectEl.value, 10);
    running = true;

    inputEl.value = "";
    inputEl.disabled = false;
    inputEl.focus();

    resultsEl.style.display = "none";
    timerEl.textContent = `⏱ ${timeLeft}s`;

    loadText();
    timer = setInterval(updateTimer, 1000);
}

function loadText() {
    currentText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    textEl.innerHTML = "";

    [...currentText].forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        textEl.appendChild(span);
    });
}

function updateTimer() {
    if (timeLeft <= 0) {
        endTest();
        return;
    }
    timeLeft--;
    timerEl.textContent = `⏱ ${timeLeft}s`;
}

inputEl.addEventListener("input", () => {
    if (!running) return;

    const input = inputEl.value.split("");
    const chars = textEl.querySelectorAll("span");

    chars.forEach((span, i) => {
        if (input[i] === undefined) {
            span.className = "";
        } else if (input[i] === span.textContent) {
            span.className = "correct";
        } else {
            span.className = "incorrect";
        }
    });
});

function endTest() {
    clearInterval(timer);
    running = false;
    inputEl.disabled = true;

    const typed = inputEl.value.trim();
    const charCount = typed.length;
    const wordCount = typed ? typed.split(/\s+/).length : 0;
    const errorCount = textEl.querySelectorAll(".incorrect").length;

    const duration = parseInt(timeSelectEl.value, 10);
    const wpm = Math.round((wordCount / duration) * 60);
    const accuracy = charCount
        ? Math.max(0, ((charCount - errorCount) / charCount) * 100)
        : 0;

    document.getElementById("wpm").textContent = wpm;
    document.getElementById("chars").textContent = charCount;
    document.getElementById("errors").textContent = errorCount;
    document.getElementById("accuracy").textContent = accuracy.toFixed(1) + "%";

    resultsEl.style.display = "grid";
}

window.startTest = startTest;
