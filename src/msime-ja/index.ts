import { DETERMINISTIC_KEYSTROKES_TO_CHARS } from "./keystrokes";
import {
  ALPHABET_CHARS_TO_SOLVER,
  ALPHABET_KEYSTROKES_TO_SOLVER,
  Attrs,
  CHARS_TO_SOLVERS,
  CONSONANT_SOLVERS,
  DEPENDENT_CONSONANT_SOLVERS,
  DETERMINISTIC_KEYSTROKES_TO_SOLVER,
  MSIMESolver,
  SINGLE_N_SOLVER,
  Solver,
} from "./resolvers";

/**
 * An object represents preferences of typing, such as keystrokes for the certain characters.
 */
interface Preferences {
  /**
   * A mapping from a character to the preferred key combo for it.
   */
  byChars?: { [key: string]: string };
  /**
   * Whether to accept resolving `ん` by the key combo of single `n`.
   */
  acceptSingleN?: boolean;
  /**
   * Whether to accept resolving consonants by doubling the first keystroke of the following key combo.
   */
  acceptDependentConsonant?: boolean;
}

/**
 * The default preferences of typing.
 *   - Accepts the key combo of single `n` to resolve `ん`.
 *   - Accepts consonants input depending the next keystrokes.
 */
export const DEFAULT_PREFS: Readonly<Preferences> = Object.freeze<Preferences>({
  acceptSingleN: true,
  acceptDependentConsonant: true,
});

/**
 * Class representing a key combo.
 */
class KeyCombo<T extends Solver> extends Array<T> implements Solver {
  /**
   * Create a key combo.
   * @param solvers - Component of this key combo.
   */
  constructor(...solvers: T[]) {
    super(...solvers);
    // cf. https://stackoverflow.com/questions/41592985/typescript-arrayt-inheritance/43756390#43756390
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Characters which this key combo builds.
   */
  public get chars(): string {
    return this.reduce((acc, e) => acc + e.chars, "");
  }

  /**
   * Keystrokes of this key combo.
   */
  public get strokes(): string {
    return this.reduce((acc, e) => acc + e.strokes, "");
  }

  /**
   * The average number of characters per keystroke.
   */
  public get efficiency(): number {
    return this.chars.length / this.strokes.length;
  }
}

/**
 * Class representing a key combo in MS-IME standards.
 */
export class MSIMEKeyCombo extends KeyCombo<MSIMESolver> {
  public get firstPrefFactor(): MSIMESolver | null {
    return this.find((s: MSIMESolver) => (s.attrs & Attrs.PREF_FACTOR) === Attrs.PREF_FACTOR) ?? null;
  }
}

/**
 * A utility function that create an object whose keys are the each characters in the given string.
 * The values for each key is `true`.
 *
 * @param keyChars - Characters used as keys.
 * @return A dictionary whose keys are each characters of the given string.
 * @internal
 */
function createCharToTrueDict(keyChars: string | Array<string>): { [key: string]: true } {
  const ret: { [key: string]: true } = {};
  for (let i = 0, len = keyChars.length; i < len; ++i) {
    ret[keyChars[i]] = true;
  }
  return ret;
}

/**
 * A dictionary that contains `a`, `i`, `u`, `e`, `o`, and `n` as its keys.
 * Each key is mapped to true.
 * @internal
 */
const AIUEON_TRUE_DICT: { [key: string]: true } = Object.freeze(createCharToTrueDict("aiueon"));

/**
 * A dictionary whose keys are the first keystroke of each defined key combo.
 * Each key is mapped to true.
 * @internal
 */
const HEAD_KEYSTROKE_TRUE_DICT: { [key: string]: true } = Object.freeze(
  createCharToTrueDict(Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS).map((e) => e.charAt(0)))
);

/**
 * Returns a list of the first possible key combos.
 * @param goal - A text to be typed.
 * @return A list of key combos for the head of the given text.
 */
export function getFirstKeyCombos(goal: string): MSIMEKeyCombo[] {
  if (goal === "") {
    return [];
  }

  // Gather up acceptable key keyCombos based on the basic rules
  const firstKeyCombos: MSIMEKeyCombo[] = [];
  const goalLen = goal.length;
  let endIndex = 1;
  while (endIndex <= goalLen) {
    const leadingChars = goal.substring(0, endIndex);
    const solvers = CHARS_TO_SOLVERS[leadingChars];
    if (typeof solvers === "undefined") {
      // though it is possible to search for resolved by all substring,
      // we'll stop searching once a substring doesn't have corresponding solver as that is enough.
      break;
    }
    solvers.forEach((solver) => {
      firstKeyCombos.push(new MSIMEKeyCombo(solver));
    });
    ++endIndex;
  }

  const headChar = goal.charAt(0);

  if (firstKeyCombos.length === 0) {
    const alphabetSolver = ALPHABET_CHARS_TO_SOLVER[headChar];
    if (alphabetSolver) {
      // Returns a key combo that just contains one alphabet
      firstKeyCombos.push(new MSIMEKeyCombo(alphabetSolver));
    } else {
      // or returns the given character if the key combo for it is not defined
      firstKeyCombos.push(new MSIMEKeyCombo({ chars: headChar, strokes: headChar, attrs: Attrs.UNDEFINED }));
    }
  } else if (headChar === "ん") {
    // If the goal begins with `ん` and the key combo for the text following `ん` is
    // something other than /[aiueon]/, then `ん` can be resolved with the single `n`.
    const restText = goal.substring(1);
    getFirstKeyCombos(restText).forEach((restFirstKeyCombo) => {
      if (!AIUEON_TRUE_DICT[restFirstKeyCombo[0].strokes.charAt(0)]) {
        const keyCombo = new MSIMEKeyCombo(SINGLE_N_SOLVER, ...restFirstKeyCombo);
        firstKeyCombos.push(keyCombo);
      }
    });
  } else if (headChar === "っ") {
    // If the goal begins with (perhaps consecutive) `っ`
    // and they are followed by at least 1 character other than `/[あ-おな-のん]/`,
    // the consonants can be resolved by double-pressing the first keystroke of the next character.

    // use regex for readability
    const match = /^(?<consonantChars>っ+)(?<restText>[^あ-おな-のん].*)/.exec(goal);

    if (match?.groups) {
      const { consonantChars, restText } = match.groups;
      const consonantsLen = consonantChars.length;

      // Handle consonants with something like `xxtu`, `xxxtu`, ...
      for (let consecutiveLen = 2; consecutiveLen <= consonantsLen; ++consecutiveLen) {
        CONSONANT_SOLVERS.forEach((solver, i) => {
          const solvers = Array(consecutiveLen).fill(DEPENDENT_CONSONANT_SOLVERS[i], 0, consecutiveLen - 1);
          solvers[consecutiveLen - 1] = solver;
          // OPTIMIZE: Is there any other way to do this without creating the array twice...?
          firstKeyCombos.push(new MSIMEKeyCombo(...solvers));
        });
      }

      // Handle consonants with something like `tta`, `tte`, ...
      getFirstKeyCombos(restText).forEach((restFirstKeyCombo) => {
        const combo = new MSIMEKeyCombo(
          ...Array(consonantsLen).fill(
            {
              chars: "っ",
              strokes: restFirstKeyCombo[0].strokes.charAt(0),
              attrs: Attrs.CONSONANT_PREFIX,
            },
            0,
            consonantsLen
          ),
          ...restFirstKeyCombo
        );
        firstKeyCombos.push(combo);
      });
    }
  }

  return firstKeyCombos;
}

/**
 * A reducer function that chooses the one key combo from the given key combos and returns it.
 */
export type KeyComboChooser =
  /**
   * @param keyCombos - Key combos to choose from.
   * @return A chosen key combo.
   */
  (keyCombos: MSIMEKeyCombo[]) => MSIMEKeyCombo;

/**
 * Returns a function that chooses a key combo based on the given preferences.
 *
 * A chooser function keeps the reference to the given preferences object,
 * thus any changes in the preference will take effect.
 *
 * @param prefs - Preferences of typing.
 * @return A function that that chooses a key combo from the given list of key combos.
 */
export function keyComboChooser(prefs = DEFAULT_PREFS): KeyComboChooser {
  return (keyCombos): MSIMEKeyCombo => {
    // NOTE: always evaluates those values since the content of prefs might be changed
    const { acceptSingleN, acceptDependentConsonant } = prefs;

    return keyCombos.reduce((acc, k) => {
      // Readability first for now
      const prefFactor = k.firstPrefFactor;
      const preferred = prefFactor && prefFactor.strokes === prefs.byChars?.[prefFactor.chars];

      const attrs: Attrs = k.reduce(
        (acc, f) => acc | (f.attrs & (Attrs.SINGLE_N | Attrs.CONSONANT_PREFIX)),
        Attrs.NONE
      );
      const singleN = (attrs & Attrs.SINGLE_N) === Attrs.SINGLE_N;
      const dependentConsonants = (attrs & Attrs.CONSONANT_PREFIX) === Attrs.CONSONANT_PREFIX;
      if ((singleN && !acceptSingleN) || (dependentConsonants && !acceptDependentConsonant)) {
        return acc;
      }
      if (k.efficiency > acc.efficiency || preferred) {
        // the key combo in question is more efficient or preferred, compared with to the best key combo so far
        return k;
      } else {
        return acc;
      }
    });
  };
}

/**
 * Keystrokes categorized as "resolved" and "pending".
 */
export interface ParsedKeystrokes {
  /**
   * Keystrokes that have been solved.
   */
  resolved: MSIMEKeyCombo[];
  /**
   * Keystrokes that are not solved yet.
   */
  pending: string;
}

/**
 * Solve the pending keystrokes with the rest keystrokes.
 *
 * Returns an object with the key either `append` or `resolvedCombo`.
 * - `append` key comes with the value of MSIMESolver and
 *   it indicates that the pending keystrokes should be appended
 *   to the key combo just before the pending keystrokes.
 * - `resolvedCombo` key comes with the value of MSIMEKeyCombo and
 *   it indicates that the pending keystrokes is resolved
 *   into an independent key combo. Usually the returned key combo
 *   should follow the one just before the pending keystrokes.
 *
 * @param pending The pending keystrokes to parse.
 * @param restKeystrokes The rest keystrokes, following the pending keystrokes.
 * @internal
 */
function terminatePendingKeystrokes(
  pending: string,
  restKeystrokes: string
): {
  /**
   * Presents if the pending keystrokes is a solver and it should be appended
   * to the combo just before the pending keystrokes.
   */
  append?: MSIMESolver;
  /**
   * Presents if the pending keystrokes is a dependent key combo.
   */
  resolvedCombo?: MSIMEKeyCombo;
} {
  {
    // Resolve the pending character anyway assuming there is further text
    if (pending === "n") {
      return { append: SINGLE_N_SOLVER };
    } else {
      const nextChar = restKeystrokes.charAt(0);
      if (pending === nextChar && !AIUEON_TRUE_DICT[nextChar]) {
        // the pending character is meant to solve `っ`
        return {
          append: { chars: "っ", strokes: pending, attrs: Attrs.CONSONANT_PREFIX },
        };
      } else {
        // the pending character was considered as a part of roman letter input,
        // but actually it is not
        const solver = ALPHABET_KEYSTROKES_TO_SOLVER[pending];
        return {
          resolvedCombo: new MSIMEKeyCombo(solver),
        };
      }
    }
  }
}

/**
 * Parse the given keystrokes.
 * @param keystrokes - Keystrokes to parse.
 * @param terminatePending - Whether to solve the pending keystrokes anyway.
 * @return Keystrokes of resolved part and pending part.
 */
export function parseKeystrokes(
  keystrokes: string,
  {
    terminatePending = false,
  }: {
    terminatePending?: boolean;
  } = {}
): ParsedKeystrokes {
  const resolvedCombos: MSIMEKeyCombo[] = [];
  let pending = "";

  let combo: MSIMEKeyCombo | null = null;
  while (keystrokes !== "") {
    if (combo && pending !== "") {
      // Resolve the pending character anyway assuming there is further text
      const { append, resolvedCombo } = terminatePendingKeystrokes(pending, keystrokes);
      if (append) {
        combo.push(append);
      } else if (resolvedCombo) {
        resolvedCombos.push(resolvedCombo);
        // terminate the combo
        combo = null;
      }
      pending = "";
    }

    let solver: MSIMESolver | null = null;
    const candidates: string[] = [];
    const headKeystroke = keystrokes.charAt(0);

    if (HEAD_KEYSTROKE_TRUE_DICT[headKeystroke]) {
      for (const deterministicKeystrokes of Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS)) {
        if (keystrokes.startsWith(deterministicKeystrokes)) {
          // solved!
          solver = DETERMINISTIC_KEYSTROKES_TO_SOLVER[deterministicKeystrokes];
          break;
        }
        if (
          deterministicKeystrokes.startsWith(keystrokes) &&
          keystrokes.length < deterministicKeystrokes.length
        ) {
          // the keystrokes is not resolved, but it is a part of valid key combo.
          // e.g) keystrokes `s` could be a part of valid key combo such as `shi`, `syu`, `so`, ....
          // (this is likely to occur in the last chunk of keystrokes)
          candidates.push(keystrokes);
          break;
        }
      }
    } else {
      // not on rules
      solver = { chars: headKeystroke, strokes: headKeystroke, attrs: Attrs.UNDEFINED };
    }

    combo = combo ?? new MSIMEKeyCombo();

    if (solver) {
      // push into resolved list
      combo.push(solver);
      resolvedCombos.push(combo);
      combo = null;
      keystrokes = keystrokes.substring(solver.strokes.length);
    } else if (candidates.length > 0) {
      // can't resolve the keystrokes any further since the rest are indeterministic
      pending = keystrokes;
      keystrokes = "";
    } else {
      // can't resolve the keystrokes for now and have to see the rest string to determine
      pending = headKeystroke;
      keystrokes = keystrokes.substring(1);
    }
  }

  if (combo && combo.length >= 1) {
    resolvedCombos.push(combo);
  }

  if (terminatePending) {
    const { append, resolvedCombo } = terminatePendingKeystrokes(pending, "");
    if (append) {
      resolvedCombos.push(new MSIMEKeyCombo(append));
    } else if (resolvedCombo) {
      resolvedCombos.push(resolvedCombo);
    }
    pending = "";
  }

  return { resolved: resolvedCombos, pending };
}
