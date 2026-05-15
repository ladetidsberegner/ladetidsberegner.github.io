
/* =========================
   DATA
========================= */

const weekdays = [
  "SØNDAG",
  "MANDAG",
  "TIRSDAG",
  "ONSDAG",
  "TORSDAG",
  "FREDAG",
  "LØRDAG"
];

const months = [
  "JANUAR",
  "FEBRUAR",
  "MARTS",
  "APRIL",
  "MAJ",
  "JUNI",
  "JULI",
  "AUGUST",
  "SEPTEMBER",
  "OKTOBER",
  "NOVEMBER",
  "DECEMBER"
];


/* =========================
   NUMBERS → WORDS
========================= */

const numberWords = {

  0: "",
  1: "ET",
  2: "TO",
  3: "TRE",
  4: "FIRE",
  5: "FEM",
  6: "SEKS",
  7: "SYV",
  8: "OTTE",
  9: "NI",
  10: "TI",
  11: "ELLEVE",
  12: "TOLV",
  13: "TRETTEN",
  14: "FJORTEN",
  15: "FEMTEN",
  16: "SEKSTEN",
  17: "SYTTEN",
  18: "ATTEN",
  19: "NITTEN",
  20: "TYVE",
  21: "ENOGTYVE",
  22: "TOOGTYVE",
  23: "TREOGTYVE",
  24: "FIREOGTYVE",
  25: "FEMOGTYVE",
  26: "SEKSOGTYVE",
  27: "SYVOGTYVE",
  28: "OTTEOGTYVE",
  29: "NIOGTYVE"

};


/* =========================
   DATE ORDINALS
========================= */

const ordinalWords = {

  1: "FØRSTE",
  2: "ANDEN",
  3: "TREDJE",
  4: "FJERDE",
  5: "FEMTE",
  6: "SJETTE",
  7: "SYVENDE",
  8: "OTTENDE",
  9: "NIENDE",
  10: "TIENDE",
  11: "ELLEVTE",
  12: "TOLVTE",
  13: "TRETTENDE",
  14: "FJORTENDE",
  15: "FEMTENDE",
  16: "SEKSTENDE",
  17: "SYTTENDE",
  18: "ATTENDE",
  19: "NITTENDE",
  20: "TYVENDE",
  21: "ENOGTYVENDE",
  22: "TOOGTYVENDE",
  23: "TREOGTYVENDE",
  24: "FIREOGTYVENDE",
  25: "FEMOGTYVENDE",
  26: "SEKSOGTYVENDE",
  27: "SYVOGTYVENDE",
  28: "OTTEOGTYVENDE",
  29: "NIOGTYVENDE",
  30: "TREDIVENDE",
  31: "ENOGTREDIVENDE"

};


/* =========================
   HELPERS
========================= */

function setText(id, value) {

  document.getElementById(id).textContent = value;

}


/* =========================
   UPDATE CLOCK
========================= */

function updateClock() {

  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();

  /* =========================
     DATE
  ========================= */

  setText("weekday", weekdays[now.getDay()]);

  setText("day", ordinalWords[now.getDate()]);

  setText("month", months[now.getMonth()]);

  setText("year", now.getFullYear());


  /* =========================
     TIME
  ========================= */

  let displayHour = hours % 12;
  if (displayHour === 0) displayHour = 12;

  let nextHour = displayHour + 1;
  if (nextHour > 12) nextHour = 1;


  /* rounded minute logic */

  let roundedMinutes = Math.round(minutes / 5) * 5;

  let relation = "";


  if (roundedMinutes === 0) {

    setText("minuteWord", "");

    relation = "";

    setText("hourWord", numberWords[displayHour]);

  }

  else if (roundedMinutes <= 25) {

    setText("minuteWord", numberWords[roundedMinutes]);

    relation = "minutter over";

    setText("hourWord", numberWords[displayHour]);

  }

  else if (roundedMinutes === 30) {

    setText("minuteWord", "");

    relation = "halv";

    setText("hourWord", numberWords[nextHour]);

  }

  else {

    let remain = 60 - roundedMinutes;

    setText("minuteWord", numberWords[remain]);

    relation = "minutter i";

    setText("hourWord", numberWords[nextHour]);

  }


  document.getElementById("relationText").textContent = relation;


  /* =========================
     DAY PERIOD
  ========================= */

  let period = "";

  if (hours >= 5 && hours < 12) {

    period = "OM MORGENEN";

  }

  else if (hours >= 12 && hours < 18) {

    period = "OM EFTERMIDDAGEN";

  }

  else {

    period = "OM AFTENEN";

  }

  setText("dayPeriod", period);

}


/* =========================
   START
========================= */

updateClock();

setInterval(updateClock, 60000);