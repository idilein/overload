/*
jumpify.js erzeugt einen "jumping letters"-Effekt, ohne den Basistex dauerhaft zu verändern.
Typoglycemia-artige Vertauschungen:

Nur bei Wörtern mit Länge ≥ 4

Erster und letzter Buchstabe bleiben gleich

In der Mitte werden 2 Buchstaben getauscht

Nur bei einem Teil der Wörter pro Tick (z. B. 10%)
*/


const JUMP_CONFIG = {
  // Wie häufig (pro Tick) Wörter geändert werden: 0.05 = 5%, 0.15 = 15%
  wordProb: 0.1,

  // Tick-Rate wird in output.js gesteuert (z.B. 140ms)
  // Hier nur Algorithmus
};

// Matches "Wörter" inkl. deutscher Umlaute/ß (nur Buchstaben)
const WORD_RE = /[A-Za-zÄÖÜäöüß]{2,}/g;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function swapTwoChars(str, i, j) {
  if (i === j) return str;
  const arr = str.split("");
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
  return arr.join("");
}

function jumpWord(word) {
  // Sehr kurze Wörter nicht verändern
  if (word.length < 4) return word;

  // Erste/letzte bleiben stabil
  const first = word[0];
  const last = word[word.length - 1];
  const mid = word.slice(1, -1);

  if (mid.length < 2) return word;

  // 2 Positionen in der Mitte auswählen und tauschen
  let a = 0,
    b = 0;

  // a < b
  while (a === b) {
    a = randInt(0, mid.length - 1);
    b = randInt(0, mid.length - 1);
  }
  if (a > b) [a, b] = [b, a];

  const newMid = swapTwoChars(mid, a, b);
  return first + newMid + last;
}

export function jumpifyText(text, opts = {}) {
  const wordProb = typeof opts.wordProb === "number" ? opts.wordProb : JUMP_CONFIG.wordProb;

  // Wir ersetzen Wörter im Text selektiv
  return text.replace(WORD_RE, (word) => {
    if (Math.random() > wordProb) return word;
    return jumpWord(word);
  });
}
