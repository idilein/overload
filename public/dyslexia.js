// Wie stark soll verfremdet werden?
// mögliche Werte: "low", "medium", "high"
const DYSLEXIA_INTENSITY = "high";

function shouldChangeWord() {
  switch (DYSLEXIA_INTENSITY) {
    case "low":
      return Math.random() < 0.15; // nur ca. jedes 6.–7. Wort
    case "medium":
      return Math.random() < 0.35;
    case "high":
      return Math.random() < 0.6;
    default:
      return Math.random() < 0.2;
  }
}

// Hauptfunktion: kompletten Text transformieren
function simulateDyslexia(text) {
  const tokens = text.split(/(\s+)/);

  return tokens
    .map((token) => {
      // Leerraum unverändert lassen
      if (/^\s+$/.test(token)) return token;
      if (!/[A-Za-zÄÖÜäöüß]/.test(token)) return token;

      let word = token;

      // viele Wörter bleiben komplett unverändert
      if (!shouldChangeWord()) return word;

      // Kandidaten: nur Buchstabenverwechslungen
      const candidates = [];

      if (word.length >= 3) {
        candidates.push(visualConfusion);
        candidates.push(phonologicalConfusion);
      }

      if (candidates.length === 0) return word;

      const fn = candidates[Math.floor(Math.random() * candidates.length)];
      return fn(word);
    })
    .join("");
}

/* ----------------- Fehler-Muster (entschärft) ----------------- */

// 1) Visuell ähnliche Buchstaben (b/d/p/q, m/n, u/n, w/m)
function visualConfusion(word) {
  const groups = [
    ["b", "d", "p", "q"],
    ["m", "n"],
    ["u", "n"],
    ["w", "m"],
  ];

  const chars = word.split("");

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const lower = ch.toLowerCase();

    const group = groups.find((g) => g.includes(lower));
    if (!group) continue;

    // niedrige Wahrscheinlichkeit, EINEN Buchstaben zu ersetzen
    if (Math.random() < 0.3) {
      const alternatives = group.filter((c) => c !== lower);
      if (!alternatives.length) continue;

      const replacementLower =
        alternatives[Math.floor(Math.random() * alternatives.length)];

      const replacement =
        ch === lower ? replacementLower : replacementLower.toUpperCase();

      chars[i] = replacement;
      break; // nur ein Fehler pro Wort
    }
  }

  return chars.join("");
}

// 2) Phonologische Verwechslung (t/d, g/k, f/v, s/ß)
function phonologicalConfusion(word) {
  const map = {
    t: "d",
    d: "t",
    g: "k",
    k: "g",
    f: "v",
    v: "f",
    s: "ß",
    ß: "s",
  };

  const chars = word.split("");

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const lower = ch.toLowerCase();
    if (map[lower] && Math.random() < 0.3) {
      const replacementLower = map[lower];
      const replacement =
        ch === lower ? replacementLower : replacementLower.toUpperCase();
      chars[i] = replacement;
      break; // nur ein Fehler pro Wort
    }
  }

  return chars.join("");
}
