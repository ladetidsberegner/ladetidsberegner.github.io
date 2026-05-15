console.log("wordclock loaded");

// =========================
// MAIN UPDATE LOOP
// =========================

function updateWordClock() {
  const now = new Date();

  const dayNames = [
    "SØNDAG","MANDAG","TIRSDAG","ONSDAG",
    "TORSDAG","FREDAG","LØRDAG"
  ];

  const monthNames = [
    "JANUAR","FEBRUAR","MARTS","APRIL","MAJ","JUNI",
    "JULI","AUGUST","SEPTEMBER","OKTOBER","NOVEMBER","DECEMBER"
  ];

  const hour24 = now.getHours();
  const minute = now.getMinutes();

  // ===== DATE =====
  setWord("weekday", dayNames[now.getDay()]);
  setWord("day", getOrdinalDay(now.getDate()));
  setWord("month", monthNames[now.getMonth()]);
  setWord("year", convertYear(now.getFullYear()));

  // ===== TIME =====
  const hourData = getHour(hour24);
  const minuteData = getMinuteText(minute, hourData.hour);

  // Hour word
  setWord("hourWord", numberToWord(minuteData.displayHour));

  // Minute word
  setWord("minuteWord", formatMinute(minuteData.numberWord));

  // Relation text (over/i/halv/over halv/i halv etc.)
  setWord("relationText", minuteData.relationWord);

  // Day period
  setWord("dayPeriod", getDayPeriod(hour24));
}

// =========================
// DOM HELPER
// =========================
function setWord(id, text) {
  const el = document.getElementById(id);
  if (!el) return;

  if (!text || text.trim() === "") {
    el.style.display = "none";
    return;
  }
  el.style.display = "inline-flex";
  el.textContent = text;
}

// =========================
// DAY / DATE HELPERS
// =========================
function getOrdinalDay(day) {
  const numbers = [
    "FØRSTE","ANDEN","TREDJE","FJERDE","FEMTE","SJETTE",
    "SYVENDE","OTTENDE","NIENDE","TIENDE","ELLEVE","TOLVTE",
    "TRETTENDE","FJORTENDE","FEMTENDE","SEKSTENDE","SYTTENDE",
    "ATTENDE","NITTENDE","TYVENDE","ENOGTYVENDE","TOOGTYVENDE",
    "TREOGTYVENDE","FIREOGTYVENDE","FEMOGTYVENDE","SEKSOGTYVE",
    "SYVOGTYVENDE","OTTEOGTYVENDE","NI OG TYVE"
  ];
  return numbers[day - 1] || String(day);
}

function convertYear(year) {
  if (year === 2026) return "TOTUSINDSEKSOGTYVE";
  return String(year);
}

// =========================
// HOUR / PERIOD
// =========================
function getHour(hour24) {
  let isPM = hour24 >= 12;
  let hour = hour24 % 12;
  if (hour === 0) hour = 12;
  return { hour, isPM };
}

function getDayPeriod(hour24) {
  if (hour24 >= 0 && hour24 < 6) return "OM NATTEN";
  if (hour24 >= 6 && hour24 < 10) return "OM MORGENEN";
  if (hour24 >= 10 && hour24 < 12) return "OM FORMIDDAGEN";
  if (hour24 >= 12 && hour24 < 18) return "OM EFTERMIDDAGEN";
  return "OM AFTENEN";
}

// =========================
// DANISH MINUTE ENGINE
// =========================
function getMinuteText(minute, hour) {
  let displayHour = hour;
  let numberWord = "";
  let relationWord = "";
  let showMinute = true;

  if (minute === 0) {
    numberWord = "";
    relationWord = "";
    showMinute = false;
  } else if (minute === 15) {
    numberWord = "KVART";
    relationWord = "OVER";
    showMinute = false;
  } else if (minute === 45) {
    numberWord = "KVART";
    relationWord = "I";
    displayHour = (hour % 12) + 1;
    showMinute = false;
  } else if (minute >= 1 && minute <= 14) {
    numberWord = numberToMinuteWord(minute);
    relationWord = "OVER";
  } else if (minute >= 16 && minute <= 24) {
    numberWord = numberToMinuteWord(minute);
    relationWord = "OVER";
  } else if (minute >= 25 && minute <= 29) {
    numberWord = numberToMinuteWord(30 - minute);
    relationWord = "I HALV";
    displayHour = (hour % 12) + 1;
  } else if (minute === 30) {
    numberWord = "";
    relationWord = "HALV";
    displayHour = (hour % 12) + 1;
    showMinute = false;
  } else if (minute >= 31 && minute <= 39) {
    numberWord = numberToMinuteWord(minute - 30);
    relationWord = "OVER HALV";
    displayHour = (hour % 12) + 1;
  } else if (minute >= 40 && minute <= 44) {
    numberWord = numberToMinuteWord(60 - minute);
    relationWord = "I";
    displayHour = (hour % 12) + 1;
  } else if (minute >= 46 && minute <= 59) {
    numberWord = numberToMinuteWord(60 - minute);
    relationWord = "I";
    displayHour = (hour % 12) + 1;
  }

  return { numberWord, relationWord, displayHour, showMinute };
}

// =========================
// NUMBER TO WORD
// =========================
function numberToWord(num) {
  const words = ["ET","TO","TRE","FIRE","FEM","SEKS","SYV","OTTE","NI","TI","ELLEVE","TOLV"];
  return words[(num - 1) % 12];
}

function numberToMinuteWord(num) {
  const words = [
    "ET","TO","TRE","FIRE","FEM","SEKS","SYV","OTTE","NI","TI",
    "ELLEVE","TOLV","TRETTEN","FJORTEN","FEMTEN","SEKSTEN","SYTTEN",
    "ATTEN","NITTEN","TYVE","ENOGTYVE","TOOGTYVE","TREOGTYVE","FIREOGTYVE",
    "FEMOGTYVE","SEKSOGTYVE","SYVOGTYVE","OTTEOGTYVE","NI OG TYVE"
  ];
  return words[num - 1] || String(num);
}

function formatMinute(word) {
  if (!word || word.trim() === "") return "";
  if (word === "ET") return "ET MINUT";
  return word + " MINUTTER";
}

// =========================
// START LOOP
// =========================
updateWordClock();
setInterval(updateWordClock, 1000);