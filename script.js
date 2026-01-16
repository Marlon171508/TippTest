"use strict";

// Texte
const TEXTS = {
    tech: "Technologie verändert unsere Welt grundlegend. Software, künstliche Intelligenz und Automatisierung beeinflussen unseren Alltag immer stärker. Programmieren ist heute eine der wichtigsten Fähigkeiten der modernen Gesellschaft.",
    science: "Die Wissenschaft versucht seit Jahrhunderten die Geheimnisse des Universums zu entschlüsseln. Physik, Chemie und Biologie arbeiten zusammen, um neue Erkenntnisse zu gewinnen, die unser Leben verbessern und die Welt besser verstehen lassen.",
    history: "Geschichte erzählt die Entwicklung der Menschheit. Von antiken Hochkulturen über das Mittelalter bis zur digitalen Revolution formten Ereignisse unsere heutige Welt.",
    nature: "Die Natur ist ein komplexes Zusammenspiel aus Pflanzen, Tieren und Ökosystemen. Wälder produzieren Sauerstoff, Meere regulieren das Klima und Tiere erhalten das Gleichgewicht.",
    gaming: "Gaming ist längst mehr als nur ein Hobby. Es verbindet Millionen Menschen weltweit, fördert Reaktionsfähigkeit und strategisches Denken.",
    school: "Schule ist ein Ort des Lernens und der persönlichen Entwicklung. Neben Wissen werden soziale Fähigkeiten und Verantwortung vermittelt.",
    work: "Die Arbeitswelt befindet sich im Wandel. Homeoffice, flexible Arbeitszeiten und digitale Tools verändern klassische Strukturen.",
    fantasy: "In einer Welt voller Magie und Drachen kämpfen Helden gegen dunkle Mächte. Alte Prophezeiungen und verlorene Königreiche bestimmen ihr Schicksal.",
    nonsense: "blorf zantri meklo piven traska lonfu gribex norla pexin trubo malfi zenko riven tokla snarp belto krimpa zorli flento",
    random: function() {
        const keys = Object.keys(this).filter(k => k !== "random");
        return this[keys[Math.floor(Math.random() * keys.length)]];
    }
};

// DOM
const textEl = document.getElementById("text");
const inputEl = document.getElementById("input");
const timerEl = document.getElementById("timer");
const resultsEl = document.getElementById("results");
const timeSelectEl = document.getElementById("timeSelect");
const textSelectEl = document.getElementById("textSelect");
const customTextEl = document.getElementById("customText");

let timer = null;
let timeLeft = 0;
let running = false;

// Eigener Text anzeigen/ausblenden
textSelectEl.addEventListener("change", () => {
    customTextEl.style.display = textSelectEl.value === "custom" ? "block" : "none";
    if (textSelectEl.value === "custom") customTextEl.focus();
});

// Start
function startTest() {
    clearInterval(timer);

    // Zeit
    timeLeft = parseInt(timeSelectEl.value, 10);
    if (isNaN(timeLeft) || timeLeft < 10) {
        alert("Bitte Zeit auswählen.");
        return;
    }

    // Text auswählen
    let selected = textSelectEl.value;
    let text = "";

    if (selected === "custom") {
        text = customTextEl.value.trim();
        if (!text) {
            alert("Bitte eigenen Text eingeben.");
            return;
        }
        customTextEl.style.display = "none"; // Textfeld ausblenden
    } else if (selected === "random") {
        text = TEXTS.random();
    } else if (TEXTS[selected]) {
        text = TEXTS[selected];
    } else {
        alert("Text konnte nicht gefunden werden.");
        return;
    }

    // Reset
    running = true;
    inputEl.value = "";
    inputEl.disabled = false;
    inputEl.focus();
    resultsEl.style.display = "none";
    textEl.innerHTML = "";
    [...text].forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        textEl.appendChild(span);
    });

    timerEl.textContent = `⏱ ${timeLeft}s`;
    timer = setInterval(updateTimer, 1000);
}

// Timer
function updateTimer() {
    if (!running) return;
    if (timeLeft <= 0 || allTyped()) {
        endTest();
        return;
    }
    timeLeft--;
    timerEl.textContent = `⏱ ${timeLeft}s`;
}

// Prüfen ob alle Zeichen korrekt
function allTyped() {
    const chars = textEl.querySelectorAll("span");
    return chars.length > 0 && [...chars].every(span => span.classList.contains("correct"));
}

// Eingabe prüfen
inputEl.addEventListener("input", () => {
    if (!running) return;
    const input = inputEl.value.split("");
    const chars = textEl.querySelectorAll("span");
    chars.forEach((span, i) => {
        if (input[i] === undefined) span.className = "";
        else if (input[i] === span.textContent) span.className = "correct";
        else span.className = "incorrect";
    });
    if (allTyped()) endTest();
});

// Test beenden
function endTest() {
    clearInterval(timer);
    running = false;
    inputEl.disabled = true;

    const typed = inputEl.value.trim();
    const charCount = typed.length;
    const wordCount = typed ? typed.split(/\s+/).length : 0;
    const errorCount = textEl.querySelectorAll(".incorrect").length;
    const wpm = Math.round((wordCount / timeSelectEl.value) * 60);
    const accuracy = charCount ? Math.max(0, ((charCount - errorCount) / charCount) * 100) : 0;

    document.getElementById("wpm").textContent = wpm;
    document.getElementById("chars").textContent = charCount;
    document.getElementById("errors").textContent = errorCount;
    document.getElementById("accuracy").textContent = accuracy.toFixed(1) + "%";
    resultsEl.style.display = "grid";

    if (allTyped()) {
        if (confirm("Glückwunsch! Noch eine Runde?")) resetToSelection();
    }
}

// Reset auf Auswahl
function resetToSelection() {
    inputEl.value = "";
    inputEl.disabled = true;
    resultsEl.style.display = "none";
    textEl.innerHTML = "";
    textSelectEl.value = "random";
    timeSelectEl.value = "60";
    customTextEl.style.display = "none";
}

window.startTest = startTest;
