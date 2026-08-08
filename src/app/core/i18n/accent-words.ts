export interface AccentWord {
  text: string;
  accent: boolean;
}

/**
 * Spezza un titolo in parole per l'animazione a cascata, marcando quelle
 * che appartengono all'espressione da evidenziare.
 *
 * Cerca la sottostringa esatta invece di confrontare parola per parola:
 * in "Tre ambiti, un modo di ragionare" evidenziare "un modo" non deve
 * colorare anche l'"un" che compare altrove nella frase.
 */
export function accentWords(title: string, accent: string): AccentWord[] {
  const words = (chunk: string, isAccent: boolean): AccentWord[] =>
    chunk
      .split(' ')
      .filter((word) => word.length > 0)
      .map((text) => ({ text, accent: isAccent }));

  const at = accent ? title.indexOf(accent) : -1;
  if (at === -1) {
    return words(title, false);
  }

  return [
    ...words(title.slice(0, at), false),
    ...words(accent, true),
    ...words(title.slice(at + accent.length), false),
  ];
}
