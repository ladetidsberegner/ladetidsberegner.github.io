console.log("BUILD A - FULL LOGIC - 2026-05-16-1-a");

console.log("wordclock loaded");

// =========================
// MAIN LOOP
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

  // =========================
  // DATE
  // =========================

  setWord("weekday", dayNames[now.getDay()]);
  setWord("day", getOrdinalDay(now.getDate()));
  setWord("month", monthNames[now.getMonth()]);
  setWord("year", convertYear(now.getFullYear()));

  // =========================
  // TIME ENGINE
  // =========================

  const time = getTimeText(hour24, minute);

  setWord("hourWord", numberToWord(time.hour));
  setWord("relationText", time.relation);
  setWord("minuteWord", formatMinute(time.minuteWord));
  setWord("dayPeriod", getDayPeriod(hour24));
}

// =========================
// SAFE DOM UPDATE
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
// TIME ENGINE (NO OVERLAPS)
// =========================

function getTimeText(hour24, minute) {

  let hour = hour24 % 12;
  if (hour === 0) hour = 12;

  // -------------------------
  // HEL TIME
  // -------------------------
  if (minute === 0) {
    return {
      minuteWord: "",
      relation: "",
      hour
    };
  }

  // -------------------------
  // KVART OVER
  // -------------------------
  if (minute === 15) {
    return {
      minuteWord: "KVART",
      relation: "OVER",
      hour
    };
  }

  // -------------------------
  // KVART I
  // -------------------------
  if (minute === 45) {
    return {
      minuteWord: "KVART",
      relation: "I",
      hour: nextHour(hour)
    };
  }

  // -------------------------
  // 1–14 OVER
  // -------------------------
  if (minute >= 1 && minute <= 14) {
    return {
      minuteWord: numberToMinuteWord(minute),
      relation: "OVER",
      hour
    };
  }

  // -------------------------
  // 16–24 OVER
  // -------------------------
  if (minute >= 16 && minute <= 24) {
    return {
      minuteWord: numberToMinuteWord(minute),
      relation: "OVER",
      hour
    };
  }

  // -------------------------
  // 25–29 I HALV
  // -------------------------
  if (minute >= 25 && minute <= 29) {
    return {
      minuteWord: numberToMinuteWord(30 - minute),
      relation: "I HALV",
      hour: nextHour(hour)
    };
  }

  // -------------------------
  // HALV
  // -------------------------
  if (minute === 30) {
    return {
      minuteWord: "",
      relation: "HALV",
      hour: nextHour(hour)
    };
  }

  // -------------------------
  // 31–39 OVER HALV
  // -------------------------
  if (minute >= 31 && minute <= 39) {
    return {
      minuteWord: numberToMinuteWord(minute - 30),
      relation: "OVER HALV",
      hour: nextHour(hour)
    };
  }

  // -------------------------
  // 40–44 I
  // -------------------------
  if (minute >= 40 && minute <= 44) {
    return {
      minuteWord: numberToMinuteWord(60 - minute),
      relation: "I",
      hour: nextHour(hour)
    };
  }

  // -------------------------
  // 46–59 I
  // -------------------------
  if (minute >= 46 && minute <= 59) {
    return {
      minuteWord: numberToMinuteWord(60 - minute),
      relation: "I",
      hour: nextHour(hour)
    };
  }

  return {
    minuteWord: "",
    relation: "",
    hour
  };
}

// =========================
// NEXT HOUR
// =========================

function nextHour(hour) {
  return hour === 12 ? 1 : hour + 1;
}

// =========================
// FORMAT (SAFE ONLY)
// =========================

function formatMinute(word) {

  if (!word) return "";

  if (word === "KVART") return "KVART";

  if (word === "HALV") return "HALV";

  if (word === "I HALV") return "I HALV";

  if (word === "OVER HALV") return "OVER HALV";

  if (word === "OVER") return "OVER";

  if (word === "I") return "I";

  if (word === "ET") return "ET MINUT";

  return word + " MINUTTER";
}

// =========================
// TIME OF DAY
// =========================

function getDayPeriod(hour24) {

  if (hour24 >= 0 && hour24 < 5) return "OM NATTEN";
  if (hour24 >= 5 && hour24 < 10) return "OM MORGENEN";
  if (hour24 >= 10 && hour24 < 12) return "OM FORMIDDAGEN";
  if (hour24 >= 12 && hour24 < 18) return "OM EFTERMIDDAGEN";
  return "OM AFTENEN";
}

// =========================
// NUMBER WORDS
// =========================

function numberToWord(num) {

  const words = [
    "ET","TO","TRE","FIRE","FEM","SEKS",
    "SYV","OTTE","NI","TI","ELLEVE","TOLV"
  ];

  return words[(num - 1) % 12];
}

function numberToMinuteWord(num) {

  const words = [
    "ET","TO","TRE","FIRE","FEM","SEKS","SYV","OTTE","NI","TI",
    "ELLEVE","TOLV","TRETTEN","FJORTEN","FEMTEN","SEKSTEN",
    "SYTTEN","ATTEN","NITTEN","TYVE","ENOGTYVE","TOOGTYVE",
    "TREOGTYVE","FIREOGTYVE","FEMOGTYVE","SEKSOGTYVE",
    "SYVOGTYVE","OTTEOGTYVE","NIENOGTYVE"
  ];

  return words[num - 1] || String(num);
}

// =========================
// DATE + YEAR
// =========================

function getOrdinalDay(day) {

  const ordinals = [
    "FØRSTE","ANDEN","TREDJE","FJERDE","FEMTE","SJETTE",
    "SYVENDE","OTTENDE","NIENDE","TIENDE","ELLEVTE","TOLVTE",
    "TRETTENDE","FJORTENDE","FEMTENDE","SEKSTENDE","SYTTENDE",
    "ATTENDE","NITTENDE","TYVENDE","ENOGTYVENDE","TOOGTYVENDE",
    "TREOGTYVENDE","FIREOGTYVENDE","FEMOGTYVENDE","SEKSOGTYVENDE",
    "SYVOGTYVENDE","OTTEOGTYVENDE","NIENOGTYVENDE","TREDSINDE"
  ];

  return ordinals[day - 1] || String(day);
}

function convertYear(year) {
  return year === 2026 ? "TOTUSINDSEKSOGTYVE" : String(year);
}

// =========================
// START
// =========================

updateWordClock();
setInterval(updateWordClock, 1000);