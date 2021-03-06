import {
  ALPHABET_KEYSTROKES_TO_CHARS,
  DETERMINISTIC_KEYSTROKES_TO_CHARS,
  KEYSTROKES_TO_CHARS,
  NUMBER_KEYSTROKES_TO_CHARS,
  SYMBOL_KEYSTROKES_TO_CHARS,
} from "./keystrokes";

/**
 * A pair of characters and keystrokes. The keystrokes is resolved to the characters.
 */
export interface Solver {
  /**
   * Characters that the keystrokes resolves into.
   */
  chars: string;
  /**
   * Keystrokes that resolves into the characters.
   */
  strokes: string;
}

/**
 * Enum for attributes of a solver.
 */
export enum Attrs {
  /**
   * No-op.
   */
  NONE = 0,
  /**
   * Indicates that the solver is not defined in the basic rules.
   */
  UNDEFINED = 1,
  /**
   * Indicates that the solver works as a part of key combo only if followed by certain solver.
   */
  DEPENDENT = 1 << 1,
  /**
   * Indicates that the solver contains dependent consonants.
   */
  CONSONANT_PREFIX = Attrs.DEPENDENT | (1 << 2),
  /**
   * Indicates that the solver contains a single `n` that resolves `ん`.
   */
  SINGLE_N = Attrs.DEPENDENT | (1 << 3),
  /**
   * Indicates that the solver works as a preference factor.
   */
  PREF_FACTOR = 1 << 4,
  /**
   * Indicates that the solver solves into a symbol.
   */
  SYMBOL = 1 << 5,
  /**
   * Indicates that the solver solves into a number.
   */
  NUMBER = 1 << 6,
  /**
   * Indicates that the solver is alphabet which is not regarded as a part of roman letter input
   */
  FALLBACK_ALPHABET = 1 << 7,
}

/**
 * A solver with its attributes.
 */
export interface MSIMESolver extends Solver {
  chars: string;
  strokes: string;
  attrs: Attrs;
}

/**
 * A mapping from keystrokes to the corresponding MSIMESolver instance.
 * @internal
 */
type KeystrokesToSolver = { [key: string]: MSIMESolver };

/**
 * A mapping from characters to the corresponding MSIMESolver instances.
 * @internal
 */
type CharsToSolvers = { [key: string]: MSIMESolver[] };

/**
 * A mapping from characters to the single corresponding MSIMESolver instance.
 * @internal
 */
type CharsToSolver = { [key: string]: MSIMESolver };

/**
 * A mapping from deterministic keystrokes to the corresponding MSIMESolver instance.
 * @internal
 */
export const DETERMINISTIC_KEYSTROKES_TO_SOLVER = Object.freeze<KeystrokesToSolver>(
  ((): KeystrokesToSolver => {
    const chars = Object.values(DETERMINISTIC_KEYSTROKES_TO_CHARS);

    function hasMultipleKeystrokes(char: string): boolean {
      return chars.indexOf(char) !== chars.lastIndexOf(char);
    }

    function getAttr(keystrokes: string): Attrs {
      const char = KEYSTROKES_TO_CHARS[keystrokes];
      const q = char
        ? hasMultipleKeystrokes(char)
          ? Attrs.PREF_FACTOR
          : Attrs.NONE
        : NUMBER_KEYSTROKES_TO_CHARS[keystrokes]
        ? Attrs.NUMBER
        : SYMBOL_KEYSTROKES_TO_CHARS[keystrokes]
        ? Attrs.SYMBOL
        : Attrs.UNDEFINED;
      return q;
    }

    const ret: KeystrokesToSolver = {};
    Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS).forEach((keystrokes) => {
      ret[keystrokes] = Object.freeze<MSIMESolver>({
        chars: DETERMINISTIC_KEYSTROKES_TO_CHARS[keystrokes],
        strokes: keystrokes,
        attrs: getAttr(keystrokes),
      });
    });
    return ret;
  })()
);

/**
 * A mapping from alphabet keystrokes to the corresponding MSIMESolver instance.
 * @internal
 */
export const ALPHABET_KEYSTROKES_TO_SOLVER = Object.freeze<KeystrokesToSolver>(
  ((): KeystrokesToSolver => {
    const ret: KeystrokesToSolver = {};
    Object.keys(ALPHABET_KEYSTROKES_TO_CHARS).forEach((keystrokes) => {
      ret[keystrokes] = Object.freeze<MSIMESolver>({
        chars: ALPHABET_KEYSTROKES_TO_CHARS[keystrokes],
        strokes: keystrokes,
        attrs: Attrs.FALLBACK_ALPHABET,
      });
    });
    return ret;
  })()
);

/**
 * A mapping from characters to the corresponding MSIMESolver instances.
 * @internal
 */
export const CHARS_TO_SOLVERS: CharsToSolvers = Object.freeze(
  ((): CharsToSolvers => {
    const ret = Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS).reduce<{ [key: string]: MSIMESolver[] }>(
      (dict, keystrokes) => {
        const chars = DETERMINISTIC_KEYSTROKES_TO_CHARS[keystrokes];
        // create a list for each character and put the solver in
        const list = dict[chars] ?? (dict[chars] = []);
        list.push(DETERMINISTIC_KEYSTROKES_TO_SOLVER[keystrokes]);
        return dict;
      },
      {}
    );
    Object.keys(ret).forEach((k) => Object.freeze<MSIMESolver[]>(ret[k]));
    return ret;
  })()
);

/**
 * A mapping from alphabet characters to the corresponding MSIMESolver instances.
 * @internal
 */
export const ALPHABET_CHARS_TO_SOLVER: CharsToSolver = Object.freeze(
  Object.keys(ALPHABET_KEYSTROKES_TO_CHARS).reduce<{ [key: string]: MSIMESolver }>((dict, keystrokes) => {
    const chars = ALPHABET_KEYSTROKES_TO_CHARS[keystrokes];
    dict[chars] = ALPHABET_KEYSTROKES_TO_SOLVER[keystrokes];
    return dict;
  }, {})
);

/**
 * A list of deterministic MSIMESolver instances which resolves to `っ`.
 *
 * This instance is meant to be just for aliasing.
 * @internal
 */
export const CONSONANT_SOLVERS = CHARS_TO_SOLVERS["っ"];

/**
 * A MSIMEResolver instance which resolves to `ん` with the single keystroke of `n`.
 *
 * This instance is meant to be just for aliasing.
 * @internal
 */
export const SINGLE_N_SOLVER: MSIMESolver = Object.freeze<MSIMESolver>({
  chars: "ん",
  strokes: "n",
  attrs: Attrs.SINGLE_N,
});

/**
 * A list of MSIMEResolver instances which resolves to `っ` depending on the following xtu-like keystrokes.
 *
 * This instance is meant to be just for aliasing.
 * @internal
 */
export const DEPENDENT_CONSONANT_SOLVERS: readonly MSIMESolver[] = Object.freeze<MSIMESolver[]>(
  CONSONANT_SOLVERS.map((e) => ({
    chars: e.chars,
    strokes: e.strokes.charAt(0),
    attrs: Attrs.CONSONANT_PREFIX,
  }))
);
