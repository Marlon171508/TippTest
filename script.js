"use strict";

const TEXTS = {
    tech: "Technologie verändert unsere Welt grundlegend. Software, künstliche Intelligenz und Automatisierung beeinflussen unseren Alltag immer stärker. Programmieren ist heute eine der wichtigsten Fähigkeiten der modernen Gesellschaft. Wer programmiert, kann Ideen umsetzen und Probleme lösen.",
    science: "Die Wissenschaft versucht seit Jahrhunderten die Geheimnisse des Universums zu entschlüsseln. Physik, Chemie und Biologie arbeiten zusammen, um neue Erkenntnisse zu gewinnen, die unser Leben verbessern und die Welt besser verstehen lassen.",
    history: "Geschichte erzählt die Entwicklung der Menschheit. Von antiken Hochkulturen über das Mittelalter bis zur digitalen Revolution formten Ereignisse unsere heutige Welt. Lernen aus der Vergangenheit hilft, die Gegenwart zu gestalten.",
    nature: "Die Natur ist ein komplexes Zusammenspiel aus Pflanzen, Tieren und Ökosystemen. Wälder produzieren Sauerstoff, Meere regulieren das Klima und Tiere erhalten das Gleichgewicht. Nachhaltigkeit schützt die Erde für zukünftige Generationen.",
    gaming: "Gaming ist längst mehr als nur ein Hobby. Es verbindet Millionen Menschen weltweit, fördert Reaktionsfähigkeit und strategisches Denken. Spiele inspirieren, lehren und unterhalten auf vielfältige Weise.",
    school: "Schule ist ein Ort des Lernens und der persönlichen Entwicklung. Neben Wissen werden soziale Fähigkeiten und Verantwortung vermittelt. Bildung bereitet auf das Leben vor und eröffnet Chancen.",
    work: "Die Arbeitswelt befindet sich im Wandel. Homeoffice, flexible Arbeitszeiten und digitale Tools verändern klassische Strukturen. Neue Jobs entstehen, alte verschwinden, und Anpassungsfähigkeit wird immer wichtiger.",
    fantasy: "In einer Welt voller Magie und Drachen kämpfen Helden gegen dunkle Mächte. Alte Prophezeiungen und verlorene Königreiche bestimmen ihr Schicksal. Abenteuer, Magie und Geheimnisse erwarten die mutigen Recken.",
    nonsense: "blorf zantri meklo piven traska lonfu gribex norla pexin trubo malfi zenko riven tokla snarp belto krimpa zorli flento",
    random() {
        const keys = Object.keys(this).filter(k => k !== "random");
        return this[keys[Math.floor(Math.random() * keys.length)]];
    }
};

const textEl = document.getElementById("text");
const inputEl = document.getElementById("input");
const timerEl = document.getElementById("timer");
const resultsEl = document.getElementById("results");
const timeInputEl = document.getElementById("timeInput");
const textSelectEl = document.getElementById("textSelect");
const customTextEl = document.getElementById("customText");

let timer = null;
let timeLeft = 0;
let running = false;

function startTest() {
    clearInterval(timer);

    timeLeft = parseInt(timeInputEl.value, 10);
    if (isNaN(timeLeft) || timeLeft < 10) {
        alert("Bitte eine gültige Zeit (≥10 Sekunden) eingeben.");
        return;
    }

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
    let selected = textSelectEl.value;
    let text = "";

    if (selected === "custom") {
        text = customTextEl.value.trim();
        if (!text) {
            alert("Bitte eigenen Text eingeben.");
            return;
        }
    } else if (selected === "random") {
        text = TEXTS.random();
    } else {
        text = TEXTS[selected];
    }

    textEl.innerHTML = "";
    [...text].forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        textEl.appendChild(span);
    });
}

textSelectEl.addEventListener("change", () => {
    customTextEl.style.display = textSelectEl.value === "custom" ? "block" : "none";
});

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

    const wpm = Math.round((wordCount / timeInputEl.value) * 60);
    const accuracy = charCount ? Math.max(0, ((charCount - errorCount) / charCount) * 100) : 0;

    document.getElementById("wpm").textContent = wpm;
    document.getElementById("chars").textContent = charCount;
    document.getElementById("errors").textContent = errorCount;
    document.getElementById("accuracy").textContent = accuracy.toFixed(1) + "%";

    resultsEl.style.display = "grid";
}

window.startTest = startTest;
