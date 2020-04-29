/** @module msime-ja */

/**
 * A dictionary from keystrokes to characters.
 *
 * cf. {@link https://support.microsoft.com/ja-jp/help/883232}
 *
 * @type {Object<string, string>}
 * @readonly
 */
export const KEYSTROKES_TO_CHARS = Object.freeze({
  a: "あ",
  i: "い",
  yi: "い",
  u: "う",
  wu: "う",
  whu: "う",
  e: "え",
  o: "お",

  wha: "うぁ",
  whi: "うぃ",
  // The keysequence `wi` also makes `ゐ`
  wi: "うぃ",
  whe: "うぇ",
  // THe keysequence `we` also makes `ゑ`
  we: "うぇ",
  who: "うぉ",

  la: "ぁ",
  xa: "ぁ",
  li: "ぃ",
  xi: "ぃ",
  lyi: "ぃ",
  xyi: "ぃ",
  lu: "ぅ",
  xu: "ぅ",
  le: "ぇ",
  xe: "ぇ",
  lye: "ぇ",
  xye: "ぇ",
  lo: "ぉ",
  xo: "ぉ",

  ye: "いぇ",

  ka: "か",
  ca: "か",
  ki: "き",
  ku: "く",
  cu: "く",
  qu: "く",
  ke: "け",
  ko: "こ",
  co: "こ",

  kya: "きゃ",
  kyi: "きぃ",
  kyu: "きゅ",
  kye: "きぇ",
  kyo: "きょ",

  qya: "くゃ",
  qyu: "くゅ",
  qyo: "くょ",

  qwa: "くぁ",
  qa: "くぁ",
  kwa: "くぁ",
  qwi: "くぃ",
  qyi: "くぃ",
  qi: "くぃ",
  qwu: "くぅ",
  qwe: "くぇ",
  qe: "くぇ",
  qye: "くぇ",
  qwo: "くぉ",
  qo: "くぉ",

  ga: "が",
  gi: "ぎ",
  gu: "ぐ",
  ge: "げ",
  go: "ご",

  gya: "ぎゃ",
  gyi: "ぎぃ",
  gyu: "ぎゅ",
  gye: "ぎぇ",
  gyo: "ぎょ",

  gwa: "ぐぁ",
  gwi: "ぐぃ",
  gwu: "ぐぅ",
  gwe: "ぐぇ",
  gwo: "ぐぉ",

  lka: "ヵ",
  xka: "ヵ",
  lke: "ヶ",
  xke: "ヶ",

  sa: "さ",
  si: "し",
  ci: "し",
  shi: "し",
  su: "す",
  se: "せ",
  ce: "せ",
  so: "そ",

  sya: "しゃ",
  sha: "しゃ",
  syi: "しぃ",
  syu: "しゅ",
  shu: "しゅ",
  sye: "しぇ",
  she: "しぇ",
  syo: "しょ",
  sho: "しょ",

  swa: "すぁ",
  swi: "すぃ",
  swu: "すぅ",
  swe: "すぇ",
  swo: "すぉ",

  za: "ざ",
  zi: "じ",
  ji: "じ",
  zu: "ず",
  ze: "ぜ",
  zo: "ぞ",

  zya: "じゃ",
  ja: "じゃ",
  jya: "じゃ",
  zyi: "じぃ",
  jyi: "じぃ",
  zyu: "じゅ",
  ju: "じゅ",
  jyu: "じゅ",
  zye: "じぇ",
  je: "じぇ",
  jye: "じぇ",
  zyo: "じょ",
  jo: "じょ",
  jyo: "じょ",

  ta: "た",
  ti: "ち",
  chi: "ち",
  tu: "つ",
  tsu: "つ",
  te: "て",
  to: "と",

  tya: "ちゃ",
  cha: "ちゃ",
  cya: "ちゃ",
  tyi: "ちぃ",
  cyi: "ちぃ",
  tyu: "ちゅ",
  chu: "ちゅ",
  cyu: "ちゅ",
  tye: "ちぇ",
  che: "ちぇ",
  cye: "ちぇ",
  tyo: "ちょ",
  cho: "ちょ",
  cyo: "ちょ",

  tsa: "つぁ",
  tsi: "つぃ",
  tse: "つぇ",
  tso: "つぉ",

  tha: "てゃ",
  thi: "てぃ",
  thu: "てゅ",
  the: "てぇ",
  tho: "てょ",

  twa: "とぁ",
  twi: "とぃ",
  twu: "とぅ",
  twe: "とぇ",
  two: "とぉ",

  da: "だ",
  di: "ぢ",
  du: "づ",
  de: "で",
  do: "ど",

  dya: "ぢゃ",
  dyi: "ぢぃ",
  dyu: "ぢゅ",
  dye: "ぢぇ",
  dyo: "ぢょ",

  dha: "でゃ",
  dhi: "でぃ",
  dhu: "でゅ",
  dhe: "でぇ",
  dho: "でょ",

  dwa: "どぁ",
  dwi: "どぃ",
  dwu: "どぅ",
  dwe: "どぇ",
  dwo: "どぉ",

  ltu: "っ",
  xtu: "っ",
  ltsu: "っ",

  na: "な",
  ni: "に",
  nu: "ぬ",
  ne: "ね",
  no: "の",

  nya: "にゃ",
  nyi: "にぃ",
  nyu: "にゅ",
  nye: "にぇ",
  nyo: "にょ",

  ha: "は",
  hi: "ひ",
  hu: "ふ",
  fu: "ふ",
  he: "へ",
  ho: "ほ",

  hya: "ひゃ",
  hyi: "ひぃ",
  hyu: "ひゅ",
  hye: "ひぇ",
  hyo: "ひょ",

  fwa: "ふぁ",
  fa: "ふぁ",
  fwi: "ふぃ",
  fyi: "ふぃ",
  fi: "ふぃ",
  fwu: "ふぅ",
  fwe: "ふぇ",
  fe: "ふぇ",
  fye: "ふぇ",
  fwo: "ふぉ",
  fo: "ふぉ",

  fya: "ふゃ",
  fyu: "ふゅ",
  fyo: "ふょ",

  ba: "ば",
  bi: "び",
  bu: "ぶ",
  be: "べ",
  bo: "ぼ",

  bya: "びゃ",
  byi: "びぃ",
  byu: "びゅ",
  bye: "びぇ",
  byo: "びょ",

  va: "ヴぁ",
  vi: "ヴぃ",
  vu: "ヴ",
  ve: "ヴぇ",
  vo: "ヴぉ",

  vya: "ヴゃ",
  vyi: "ヴぃ",
  vyu: "ヴゅ",
  vye: "ヴぇ",
  vyo: "ヴょ",

  pa: "ぱ",
  pi: "ぴ",
  pu: "ぷ",
  pe: "ぺ",
  po: "ぽ",

  pya: "ぴゃ",
  pyi: "ぴぃ",
  pyu: "ぴゅ",
  pye: "ぴぇ",
  pyo: "ぴょ",

  ma: "ま",
  mi: "み",
  mu: "む",
  me: "め",
  mo: "も",

  mya: "みゃ",
  myi: "みぃ",
  myu: "みゅ",
  mye: "みぇ",
  myo: "みょ",

  ya: "や",
  yu: "ゆ",
  yo: "よ",

  lya: "ゃ",
  xya: "ゃ",
  lyu: "ゅ",
  xyu: "ゅ",
  lyo: "ょ",
  xyo: "ょ",

  ra: "ら",
  ri: "り",
  ru: "る",
  re: "れ",
  ro: "ろ",

  rya: "りゃ",
  ryi: "りぃ",
  ryu: "りゅ",
  rye: "りぇ",
  ryo: "りょ",

  wa: "わ",
  wo: "を",
  // NOTE: The following mapping is NOT always applicable
  n: "ん",
  nn: "ん",
  "n'": "ん",
  xn: "ん",

  lwa: "ゎ",
  xwa: "ゎ",
});

/**
 * A dictionary from *deterministic* keystrokes to characters.
 *
 * In any pair of keys, one won't be starts with the other and vice versa.
 *
 * @type {Object<string, string>}
 * @readonly
 */
export const DETERMINISTIC_KEYSTROKES_TO_CHARS = (() => {
  const val = { ...KEYSTROKES_TO_CHARS };
  // take a shortcut because only this one is indeterministic.
  delete val["n"];
  return Object.freeze(val);
})();

/**
 * A mapping from characters to deterministic keystrokes.
 * @type {Object<string, string[]>}
 * @readonly
 */
export const CHARS_TO_DETERMINISTIC_KEYSTROKES_LIST = Object.freeze(
  (() => {
    const ret = Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS).reduce((dict, keystrokes) => {
      const chars = DETERMINISTIC_KEYSTROKES_TO_CHARS[keystrokes];
      // create a list for each character and put the sequence in
      const list = dict[chars] ?? (dict[chars] = []);
      list.push(keystrokes);
      return dict;
    }, {});
    Object.keys(ret).forEach((k) => Object.freeze(ret[k]));
    return ret;
  })()
);

/**
 * Enum for attributes of a keysequence.
 * @enum {Attr}
 * @readonly
 */
export const ATTRS = Object.freeze({
  /**
   * No-op.
   */
  NONE: 0,
  /**
   * Indicates that the keysequence is not defined in the basic rules.
   */
  UNDEFINED: 1,
  /**
   * Indicates that the keysequence contains dependent consonants.
   */
  DEPENDENT_CONSONANT: 1 << 1,
  /**
   * Indicates that the keysequence contains a single `n` that resolves `ん`.
   */
  SINGLE_N: 1 << 2,
  /**
   * Indicates that the keysequence works as a preference factor.
   */
  PREF_FACTOR: 1 << 3,
});

/**
 * A class represents a keysequence.
 */
class Keysequence {
  /**
   * Create a keysequence.
   *
   * NOTE: This instance itself does NOT check for integrity between chars and strokes.
   *
   * @param {string} chars - A character to be typed with this keysequence.
   * @param {string} strokes - An actual keystrokes.
   * @param {Attr} attrs - Attributes of this keysequence.
   */
  constructor(chars, strokes, attrs = ATTRS.NONE) {
    /**
     * Characters which this keysequence builds.
     * @type {string}
     */
    this.chars = chars;
    /**
     * Keystrokes of this keysequence.
     * @type {string}
     */
    this.strokes = strokes;
    /**
     * Attributes of this keysequence.
     * @type {Attr}
     */
    this.attrs = attrs;
    Object.freeze(this);
  }
}

/**
 * A mapping from deterministic keystrokes to the corresponding Keysequence instance.
 * @type {Object<string, Keysequence>}
 */
const DETERMINISTIC_KEYSTROKES_TO_KEYSEQUENCE = Object.freeze(
  (() => {
    const ret = {};
    Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS).forEach((keystrokes) => {
      ret[keystrokes] = Object.freeze(
        new Keysequence(DETERMINISTIC_KEYSTROKES_TO_CHARS[keystrokes], keystrokes, ATTRS.PREF_FACTOR)
      );
    });
    return ret;
  })()
);

/**
 * A mapping from characters to deterministic keysequences.
 * @type {Object<string, Keysequence[]>}
 */
export const CHARS_TO_DETERMINISTIC_KEYSEQUENCES = Object.freeze(
  (() => {
    const ret = Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS).reduce((dict, keystrokes) => {
      const chars = DETERMINISTIC_KEYSTROKES_TO_CHARS[keystrokes];
      // create a list for each character and put the sequence in
      const list = dict[chars] ?? (dict[chars] = []);
      list.push(DETERMINISTIC_KEYSTROKES_TO_KEYSEQUENCE[keystrokes]);
      return dict;
    }, {});
    Object.keys(ret).forEach((k) => Object.freeze(ret[k]));
    return ret;
  })()
);

/**
 * A list of deterministic keysequences which resolves to `っ`.
 *
 * This instance is meant to be just for aliasing.
 *
 * @type {Keysequence[]}
 * @readonly
 */
const CONSONANT_KEYSEQUENCES = CHARS_TO_DETERMINISTIC_KEYSEQUENCES["っ"];

/**
 * A keysequence which resolves to `ん` with the single keystroke of `n`.
 *
 * This instance is meant to be just for aliasing.
 *
 * @type {Keysequence}
 */
const SINGLE_N_SEQUENCE = Object.freeze(new Keysequence("ん", "n", ATTRS.SINGLE_N));

/**
 * A list of keysequences which resolves to `っ` depending on the following xtu-like keystrokes.
 *
 * This instance is meant to be just for aliasing.
 *
 * @type {Keysequence[]}
 * @readonly
 */
const DEPENDENT_CONSONANT_KEYSEQUENCES = Object.freeze(
  CONSONANT_KEYSEQUENCES.map((e) => new Keysequence(e.chars, e.strokes.charAt(0), ATTRS.DEPENDENT_CONSONANT))
);

/**
 * An object represents the preferences of typing, such as keysequence for the certain characters.
 * @typedef {object} Prefs
 * @property {Object<string, string>} [byChars] - A mapping from a character to the preferred keysequence for it.
 * @property {boolean} [acceptSingleN] - Whether to accept resolving `ん` by the keysequence of single `n`.
 * @property {boolean} [acceptDependentConsonant] - Whether to accept resolving consonants
 *   by doubling the first key of the following keysequence.
 */

/**
 * The default preferences of typing.
 * @type {Readonly<Prefs>}
 * @readonly
 */
export const DEFAULT_PREFS = Object.freeze({
  byChars: {},
  acceptSingleN: true,
  acceptDependentConsonant: true,
});

/**
 * Attributes of a keysequence.
 * @typedef {number} Attr
 */

/**
 * A utility function that create an object whose keys are the each characters in the given string.
 * The values for each key is `true`.
 *
 * @param keyChars {string|Array<string>} - Characters used as keys.
 * @return {Object<string, true>} A dictionary whose keys are each characters of the given string.
 */
function createCharToTrueDict(keyChars) {
  const ret = {};
  for (let i = 0, len = keyChars.length; i < len; ++i) {
    ret[keyChars[i]] = true;
  }
  return ret;
}

/**
 * A dictionary that contains `a`, `i`, `u`, `e`, `o`, and `n` as its keys.
 * Each key is mapped to true.
 * @type {Object<string, true>}
 * @readonly
 */
const AIUEON_TRUE_DICT = Object.freeze(createCharToTrueDict("aiueon"));

/**
 * A dictionary whose keys are the first keystroke of each defined keysequences.
 * Each key is mapped to true.
 * @type {Object<string, true>}
 * @readonly
 */
const HEAD_KEYSTROKE_TRUE_DICT = Object.freeze(
  createCharToTrueDict(Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS).map((e) => e.charAt(0)))
);

/**
 * A class represents the composed keysequences.
 * @extends Array<Keysequence>
 */
export class ComposedKeysequence extends Array {
  /**
   *
   * @param {...Keysequence} keysequences - Keysequences to be composed.
   */
  constructor(...keysequences) {
    super(...keysequences);
  }

  /**
   * Characters which this keysequence builds.
   * @type {string}
   */
  get chars() {
    return this.reduce((acc, e) => acc + e.chars, "");
  }

  /**
   * Keystrokes of this keysequence.
   * @type {string}
   */
  get strokes() {
    return this.reduce((acc, e) => acc + e.strokes, "");
  }
}

/**
 * Returns a list of keysequences for the given text.
 * @param {string} goal - A text to be typed.
 * @return {Keysequence[]} - A mapping from characters to a list of corresponding keysequences.
 */
export function getNextKeysequencesList(goal) {
  if (goal === "") {
    return [];
  }

  // Gather up acceptable keysequences based on the basic rules
  const nextKeyseqs = [];
  const goalLen = goal.length;
  let endIndex = 1;
  while (endIndex <= goalLen) {
    const leadingChars = goal.substring(0, endIndex);
    const keyseqs = CHARS_TO_DETERMINISTIC_KEYSEQUENCES[leadingChars];
    if (typeof keyseqs === "undefined") {
      // though it is possible to search for sequences by all substring,
      // we'll stop searching once a substring doesn't have corresponding sequence as that is enough.
      break;
    }
    keyseqs.forEach((keyseq) => {
      nextKeyseqs.push(new ComposedKeysequence(keyseq));
    });
    ++endIndex;
  }

  const headChar = goal.charAt(0);

  if (nextKeyseqs.length === 0) {
    // - Returns the given character if the keysequence for it is not defined
    // - Returns empty dict if the goal is empty
    nextKeyseqs.push(new ComposedKeysequence(new Keysequence(headChar, headChar, ATTRS.UNDEFINED)));
  } else if (headChar === "ん") {
    // If the goal begins with `ん` and the keysequence for the text following `ん` is
    // something other than /[aiueon]/, then `ん` can be resolved with the single `n`.
    const followingText = goal.substring(1);
    const followingKeyseqs = getNextKeysequencesList(followingText);
    followingKeyseqs.forEach((followingKeyseqFactors) => {
      if (!AIUEON_TRUE_DICT[followingKeyseqFactors[0].strokes.charAt(0)]) {
        const seq = new ComposedKeysequence(SINGLE_N_SEQUENCE, ...followingKeyseqFactors);
        nextKeyseqs.push(seq);
      }
    });
  } else {
    // If the goal begins with (perhaps consecutive) `っ`
    // and they are followed by at least 1 character other than `/[あ-おな-のん]/`,
    // the consonants can be resolved by double-pressing the first keystroke of the next character.

    // use regex for readability
    const match = /^(?<consonantChars>っ+)(?<followingText>[^あ-おな-のん].*)/.exec(goal);

    if (match) {
      const { consonantChars, followingText } = match.groups;
      const consonantsLen = consonantChars.length;

      // Handle consonants with something like `xxtu`, `xxxtu`, ...
      for (let consecutiveLen = 2; consecutiveLen <= consonantsLen; ++consecutiveLen) {
        CONSONANT_KEYSEQUENCES.forEach((consonantKeyseq, i) => {
          const seq = Array(consecutiveLen).fill(DEPENDENT_CONSONANT_KEYSEQUENCES[i], 0, consecutiveLen - 1);
          seq[consecutiveLen - 1] = consonantKeyseq;
          nextKeyseqs.push(new ComposedKeysequence(...seq));
        });
      }

      // Handle consonants with something like `tta`, `tte`, ...
      const followingKeyseqs = getNextKeysequencesList(followingText);
      followingKeyseqs.forEach((followingKeyseqFactors) => {
        const followingKeystrokes = followingKeyseqFactors[0].strokes;

        const seq = new ComposedKeysequence(
          ...Array(consonantsLen).fill(
            new Keysequence("っ", followingKeystrokes.charAt(0), ATTRS.DEPENDENT_CONSONANT),
            0,
            consonantsLen
          ),
          ...followingKeyseqFactors
        );
        nextKeyseqs.push(seq);
      });
    }
  }

  return nextKeyseqs;
}

/**
 * Chooses the one keysequence from the given keysequences and returns it.
 * @callback SequenceChooser
 * @param {Keysequence[]} keysequences
 * @return {Keysequence}
 */

/**
 * Returns a function that chooses a sequence based on the given preferences.
 *
 * A chooser function keeps the reference to the given preferences object,
 * thus any changes in the preference will take effect.
 *
 * @param {Prefs} prefs - Preferences of typing.
 * @return {SequenceChooser} A function that that chooses a sequence from the given list of sequences.
 */
export function sequenceChooser(prefs = DEFAULT_PREFS) {
  return (keysequences) => {
    // NOTE: always evaluates those values since the content of prefs might be changed
    const { acceptSingleN, acceptDependentConsonant } = prefs;

    return keysequences.reduce((acc, k) => {
      // Readability first for now
      const prefFactor = k.find((f) => (f.attrs & ATTRS.PREF_FACTOR) === ATTRS.PREF_FACTOR);
      const preferred = prefFactor && prefFactor.strokes === prefs.byChars?.[prefFactor.chars];

      const attrs = k.reduce(
        (acc, f) => acc | (f.attrs & (ATTRS.SINGLE_N | ATTRS.DEPENDENT_CONSONANT)),
        ATTRS.NONE
      );
      const singleN = (attrs & ATTRS.SINGLE_N) !== 0;
      const dependentConsonants = (attrs & ATTRS.DEPENDENT_CONSONANT) !== 0;
      const accEfficiency = acc.chars.length / acc.strokes.length;
      const efficiency = k.chars.length / k.strokes.length;
      if ((singleN && !acceptSingleN) || (dependentConsonants && !acceptDependentConsonant)) {
        return acc;
      }
      if (efficiency > accEfficiency || preferred) {
        // the keysequence in question is more efficient or preferred, compared with to the best keysequence so far
        return k;
      } else {
        return acc;
      }
    });
  };
}

/**
 * Class that represents an interpretation of keystrokes.
 */
export class KeystrokesInterpretation {
  /**
   * Oh snap.
   * @param {Keysequence[]} resolvers
   * @param {string} pending
   */
  constructor(resolvers, pending) {
    this.resolvers = resolvers;
    this.pending = pending;
    Object.freeze(this);
  }
}

/**
 * Interpret the given keystrokes.
 * @param {string} keystrokes
 * @return {KeystrokesInterpretation}
 */
export function interpretKeystrokes(keystrokes) {
  const resolvers = [];
  let pending = "";

  while (keystrokes !== "") {
    if (pending !== "") {
      // Resolve the pending character anyway assuming there is further text
      if (pending === "n") {
        resolvers.push(SINGLE_N_SEQUENCE);
      } else {
        const nextChar = keystrokes.charAt(0);
        if (pending === nextChar && !AIUEON_TRUE_DICT[nextChar]) {
          // the next character is meant to solve `っ`
          resolvers.push(new Keysequence("っ", pending, ATTRS.DEPENDENT_CONSONANT));
        } else {
          // the next character is undefined
          resolvers.push(new Keysequence(pending, pending, ATTRS.UNDEFINED));
        }
      }
      pending = "";
    }

    /**
     * @type {Keysequence|null}
     */
    let resolver = null;
    let candidates = [];
    const headKeystroke = keystrokes.charAt(0);

    if (HEAD_KEYSTROKE_TRUE_DICT[headKeystroke]) {
      const deterministicKeyseqs = Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS);
      for (let deterministicKeyseq of deterministicKeyseqs) {
        if (keystrokes.startsWith(deterministicKeyseq)) {
          // resolved!
          resolver = DETERMINISTIC_KEYSTROKES_TO_KEYSEQUENCE[deterministicKeyseq];
          break;
        }
        if (deterministicKeyseq.startsWith(keystrokes)) {
          // the currentInterpretation is not resolved, but it is a part of valid keysequence.
          // e.g) currentInterpretation `s` could be a part of valid keysequence `shi`, `syu`, `so`, ....
          // (this is likely to occur in the last chunk of currentInterpretation)
          candidates.push(keystrokes);
          break;
        }
      }
    } else {
      resolver = new Keysequence(headKeystroke, headKeystroke, ATTRS.UNDEFINED);
    }

    if (resolver) {
      // push into resolvers list
      resolvers.push(resolver);
      keystrokes = keystrokes.substring(resolver.strokes.length);
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

  return new KeystrokesInterpretation(resolvers, pending);
}
