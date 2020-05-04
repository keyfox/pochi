import { expect } from "chai";
import { getFirstKeyCombos as getNextKeyseqsList, keyComboChooser, parseKeystrokes } from "../src/msime-ja";
import { DETERMINISTIC_KEYSTROKES_TO_CHARS } from "../src/msime-ja/keystrokes";
import { Attrs } from "../src/msime-ja/resolvers";

const CHARS_TO_DETERMINISTIC_KEYSTROKES_LIST = (() => {
  const dict = Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS).reduce<{ [key: string]: string[] }>(
    (dict, strokes) => {
      const chars = DETERMINISTIC_KEYSTROKES_TO_CHARS[strokes];
      const list = dict[chars] ?? (dict[chars] = []);
      list.push(strokes);
      return dict;
    },
    {}
  );
  Object.keys(dict).forEach((k) => Object.freeze(dict[k]));
  return Object.freeze(dict);
})();

describe("msime-ja", () => {
  describe("DETERMINISTIC_KEYSEQUENCE_TO_CHARS", () => {
    function expectToBeDeterministic(arr: string[]) {
      const keysLen = arr.length;
      for (let i = 0; i < keysLen; ++i) {
        for (let j = i + 1; j < keysLen; ++j) {
          expect(arr[i].startsWith(arr[j])).to.be.false;
          expect(arr[j].startsWith(arr[i])).to.be.false;
        }
      }
    }

    it("is deterministic", () => {
      const keys = Object.keys(DETERMINISTIC_KEYSTROKES_TO_CHARS);
      expectToBeDeterministic(keys);
    });
  });

  const CONSONANTS = [
    [{ chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR }],
    [{ chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR }],
    [{ chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR }],
  ];
  const EXPLICIT_N = [
    [{ chars: "ん", strokes: "xn", attrs: Attrs.PREF_FACTOR }],
    [{ chars: "ん", strokes: "nn", attrs: Attrs.PREF_FACTOR }],
    [{ chars: "ん", strokes: "n'", attrs: Attrs.PREF_FACTOR }],
  ];

  const TEST_CASES: [string, { chars: string; strokes: string; attrs: Attrs }[][]][] = [
    // empty
    ["", []],

    // single pattern
    ["あ", [[{ chars: "あ", strokes: "a", attrs: Attrs.NONE }]]],

    // 2 or more pattern
    [
      "い",
      [
        [{ chars: "い", strokes: "i", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "い", strokes: "yi", attrs: Attrs.PREF_FACTOR }],
      ],
    ],
    [
      "か",
      [
        [{ chars: "か", strokes: "ka", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "か", strokes: "ca", attrs: Attrs.PREF_FACTOR }],
      ],
    ],

    // // 2 or more character
    [
      "ふぇ",
      [
        [{ chars: "ふ", strokes: "fu", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ふ", strokes: "hu", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ふぇ", strokes: "fe", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ふぇ", strokes: "fye", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ふぇ", strokes: "fwe", attrs: Attrs.PREF_FACTOR }],
      ],
    ],
    [
      "ちゃ",
      [
        [{ chars: "ち", strokes: "chi", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ち", strokes: "ti", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ちゃ", strokes: "cha", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ちゃ", strokes: "tya", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ちゃ", strokes: "cya", attrs: Attrs.PREF_FACTOR }],
      ],
    ],

    // begin with 'っ'
    ["っ", CONSONANTS],
    [
      "った",
      [
        [
          {
            chars: "っ",
            strokes: "t",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "た", strokes: "ta", attrs: Attrs.NONE },
        ],
        ...CONSONANTS,
      ],
    ],
    [
      "っか",
      [
        [
          {
            chars: "っ",
            strokes: "k",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "か", strokes: "ka", attrs: Attrs.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "c",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "か", strokes: "ca", attrs: Attrs.PREF_FACTOR },
        ],
        ...CONSONANTS,
      ],
    ],
    [
      "っっ",
      [
        [
          {
            chars: "っ",
            strokes: "x",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "l",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "l",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR },
        ],
        ...CONSONANTS,
      ],
    ],

    [
      "っった",
      [
        [
          {
            chars: "っ",
            strokes: "x",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "l",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "l",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "t",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          {
            chars: "っ",
            strokes: "t",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "た", strokes: "ta", attrs: Attrs.NONE },
        ],
        ...CONSONANTS,
      ],
    ],

    // in the following cases we cannot type 'っ' doubling the first key of next character
    ["っあ", CONSONANTS],
    ["っん", CONSONANTS],
    ["っな", CONSONANTS],
    ["っにゃ", CONSONANTS],
    // in the following cases we need to type `n` explicitly
    ["んな", EXPLICIT_N], // `nna` won't be accepted since it makes `んあ` instead
    ["んあ", EXPLICIT_N], // `na` won't be accepted since it makes `な` instead
    // in consecutive `ん`, one can be dealt with single `n` as long as the other is typed explicitly
    [
      "んん",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ん", strokes: "xn", attrs: Attrs.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んんっ",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ん", strokes: "xn", attrs: Attrs.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んんって",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ん", strokes: "xn", attrs: Attrs.PREF_FACTOR },
        ],
      ],
    ],
    // `ん` can be dealt with single `n` if the first keystroke for the character next to `ん` is not `n`
    [
      "んか",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "か", strokes: "ka", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "か", strokes: "ca", attrs: Attrs.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んぁ",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ぁ", strokes: "xa", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ぁ", strokes: "la", attrs: Attrs.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んっ",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んって",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          {
            chars: "っ",
            strokes: "t",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "て", strokes: "te", attrs: Attrs.NONE },
        ],
      ],
    ],
    [
      "んっっ",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          {
            chars: "っ",
            strokes: "x",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          {
            chars: "っ",
            strokes: "l",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          {
            chars: "っ",
            strokes: "l",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んっって",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          {
            chars: "っ",
            strokes: "x",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          {
            chars: "っ",
            strokes: "l",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          {
            chars: "っ",
            strokes: "l",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          {
            chars: "っ",
            strokes: "t",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          {
            chars: "っ",
            strokes: "t",
            attrs: Attrs.CONSONANT_PREFIX,
          },
          { chars: "て", strokes: "te", attrs: Attrs.NONE },
        ],
      ],
    ],
    // when the goal is terminated `ん`, then we have to type `n` explicitly
    ["ん", EXPLICIT_N],

    // symbols and numbers
    ["ー", [[{ chars: "ー", strokes: "-", attrs: Attrs.SYMBOL }]]],
    ["１", [[{ chars: "１", strokes: "1", attrs: Attrs.NUMBER }]]],

    // if any undefined key is supplied, then just return it
    ["a", [[{ chars: "a", strokes: "a", attrs: Attrs.UNDEFINED }]]],
  ];

  describe("getNextSequencesList", () => {
    for (let testCase of TEST_CASES) {
      const [src, dst] = testCase;
      it(`"${src}" to {${
        (dst[0] &&
          dst
            .map((e) => e.reduce((acc, f) => acc + f.strokes, ""))
            .map((e) => `"${e}"`)
            .join(", ")) ||
        ""
      }}`, () => {
        const ret = getNextKeyseqsList(src);
        expect(ret).to.have.lengthOf(dst.length);
        expect(ret).to.have.deep.members(dst);
      });
    }
  });

  describe("keyComboChooser", () => {
    const candidates_u = getNextKeyseqsList("う");
    const defaultChooser = keyComboChooser();

    it("raises TypeError when empty", () => {
      // @ts-ignore
      expect(() => defaultChooser()).to.throw(TypeError);
    });

    it("choose efficient one when no preference", () => {
      expect(defaultChooser(candidates_u)).to.have.property("strokes", "u");
    });

    it("choose preffered one", () => {
      const candidates_shi = getNextKeyseqsList("し");
      const shiChooser = keyComboChooser({ byChars: { し: "shi" } });
      expect(shiChooser(candidates_shi)).to.have.property("strokes", "shi");
      const siChooser = keyComboChooser({ byChars: { し: "si" } });
      expect(siChooser(candidates_shi)).to.have.property("strokes", "si");
    });

    it("choose preferred one even if inefficient", () => {
      for (let strokes of ["u", "wu", "whu"]) {
        const preferredChooser = keyComboChooser({
          byChars: { う: strokes },
        });
        expect(preferredChooser(candidates_u)).to.have.property("strokes", strokes);
      }
    });

    it("keeps the reference of given preferences object", () => {
      const prefs = { byChars: { う: "u" } };
      const preferredChooser = keyComboChooser(prefs);
      expect(preferredChooser(candidates_u)).to.have.property("strokes", "u");
      prefs.byChars["う"] = "whu";
      expect(preferredChooser(candidates_u)).to.have.property("strokes", "whu");
    });

    it("respects single N preference", () => {
      const candidates_nda = getNextKeyseqsList("んだ");

      const chosenAcceptive = keyComboChooser({ acceptSingleN: true })(candidates_nda);
      expect(chosenAcceptive).to.have.property("chars", "んだ");
      expect(chosenAcceptive).to.have.property("strokes", "nda");

      const chosenUnacceptive = keyComboChooser({ acceptSingleN: false })(candidates_nda);
      expect(chosenUnacceptive).to.have.property("chars", "ん");
      expect(chosenUnacceptive)
        .to.have.property("strokes")
        .that.is.oneOf(CHARS_TO_DETERMINISTIC_KEYSTROKES_LIST["ん"]);
    });

    it("respects dependent consonants preference", () => {
      const candidates_tte = getNextKeyseqsList("って");

      const chosenAcceptive = keyComboChooser({
        acceptDependentConsonant: true,
      })(candidates_tte);
      expect(chosenAcceptive).to.have.property("chars", "って");
      expect(chosenAcceptive).to.have.property("strokes", "tte");

      const chosenUnacceptive = keyComboChooser({
        acceptDependentConsonant: false,
      })(candidates_tte);
      expect(chosenUnacceptive).to.have.property("chars", "っ");
      expect(chosenUnacceptive)
        .to.have.property("strokes")
        .that.is.oneOf(CHARS_TO_DETERMINISTIC_KEYSTROKES_LIST["っ"]);
    });

    it("dependent consonants acceptance precedes ineffective keysequence", () => {
      const candidates_tte = getNextKeyseqsList("って");

      const chosen = keyComboChooser({
        acceptDependentConsonant: true,
        byChars: { っ: "xtsu" },
      })(candidates_tte);
      expect(chosen).to.have.property("chars", "って");
      expect(chosen).to.have.property("strokes", "tte");
    });

    it("respects preferred keysequence even in dependent consonants", () => {
      const candidates_sshi = getNextKeyseqsList("っし");
      const basePrefs = { acceptDependentConsonant: true };

      expect(keyComboChooser({ ...basePrefs, byChars: { し: "shi" } })(candidates_sshi)).to.have.property(
        "strokes",
        "sshi"
      );
      expect(keyComboChooser({ ...basePrefs, byChars: { し: "si" } })(candidates_sshi)).to.have.property(
        "strokes",
        "ssi"
      );
    });
  });

  describe("resolveKeystrokes", () => {
    const TEST_CASES: [string, [string, string, Attrs][][], string][] = [
      // resolves nothing when the input is empty
      ["", [], ""],
      // anything resolved will be put into an array, and others will be returned as a string
      ["a", [[["a", "あ", Attrs.NONE]]], ""],
      ["b", [], "b"],
      ["ka", [[["ka", "か", Attrs.PREF_FACTOR]]], ""],
      ["kak", [[["ka", "か", Attrs.PREF_FACTOR]]], "k"],
      // dependent consonants
      [
        "tta",
        [
          [
            ["t", "っ", Attrs.CONSONANT_PREFIX],
            ["ta", "た", Attrs.NONE],
          ],
        ],
        "",
      ],
      [
        "ttta",
        [
          [
            ["t", "っ", Attrs.CONSONANT_PREFIX],
            ["t", "っ", Attrs.CONSONANT_PREFIX],
            ["ta", "た", Attrs.NONE],
          ],
        ],
        "",
      ],
      [
        "furess",
        [[["fu", "ふ", Attrs.PREF_FACTOR]], [["re", "れ", Attrs.NONE]], [["s", "っ", Attrs.CONSONANT_PREFIX]]],
        "s",
      ],
      [
        "tatte",
        [
          [["ta", "た", Attrs.NONE]],
          [
            ["t", "っ", Attrs.CONSONANT_PREFIX],
            ["te", "て", Attrs.NONE],
          ],
        ],
        "",
      ],
      // `n` characters
      ["kan", [[["ka", "か", Attrs.PREF_FACTOR]]], "n"],
      ["kann", [[["ka", "か", Attrs.PREF_FACTOR]], [["nn", "ん", Attrs.PREF_FACTOR]]], ""],
      [
        "kankei",
        [
          [["ka", "か", Attrs.PREF_FACTOR]],
          [
            ["n", "ん", Attrs.SINGLE_N],
            ["ke", "け", Attrs.NONE],
          ],
          [["i", "い", Attrs.PREF_FACTOR]],
        ],
        "",
      ],
      ["nnka", [[["nn", "ん", Attrs.PREF_FACTOR]], [["ka", "か", Attrs.PREF_FACTOR]]], ""],
      ["nnnnn", [[["nn", "ん", Attrs.PREF_FACTOR]], [["nn", "ん", Attrs.PREF_FACTOR]]], "n"],
      // arbitary text
      [
        "orehajaiangakidaishou",
        [
          [["o", "お", Attrs.NONE]],
          [["re", "れ", Attrs.NONE]],
          [["ha", "は", Attrs.NONE]],
          [["ja", "じゃ", Attrs.PREF_FACTOR]],
          [["i", "い", Attrs.PREF_FACTOR]],
          [["a", "あ", Attrs.NONE]],
          [
            ["n", "ん", Attrs.SINGLE_N],
            ["ga", "が", Attrs.NONE],
          ],
          [["ki", "き", Attrs.NONE]],
          [["da", "だ", Attrs.NONE]],
          [["i", "い", Attrs.PREF_FACTOR]],
          [["sho", "しょ", Attrs.PREF_FACTOR]],
          [["u", "う", Attrs.PREF_FACTOR]],
        ],
        "",
      ],
      [
        "hokkaidou",
        [
          [["ho", "ほ", Attrs.NONE]],
          [
            ["k", "っ", Attrs.CONSONANT_PREFIX],
            ["ka", "か", Attrs.PREF_FACTOR],
          ],
          [["i", "い", Attrs.PREF_FACTOR]],
          [["do", "ど", Attrs.NONE]],
          [["u", "う", Attrs.PREF_FACTOR]],
        ],
        "",
      ],
      [
        "170senchi74kiro",
        [
          [["1", "１", Attrs.NUMBER]],
          [["7", "７", Attrs.NUMBER]],
          [["0", "０", Attrs.NUMBER]],
          [["se", "せ", Attrs.PREF_FACTOR]],
          [
            ["n", "ん", Attrs.SINGLE_N],
            ["chi", "ち", Attrs.PREF_FACTOR],
          ],
          [["7", "７", Attrs.NUMBER]],
          [["4", "４", Attrs.NUMBER]],
          [["ki", "き", Attrs.NONE]],
          [["ro", "ろ", Attrs.NONE]],
        ],
        "",
      ],
      // characters that is not on the basic rules
      [
        "mk2",
        [
          [["m", "ｍ", Attrs.FALLBACK_ALPHABET]],
          [["k", "ｋ", Attrs.FALLBACK_ALPHABET]],
          [["2", "２", Attrs.NUMBER]],
        ],
        "",
      ],
      // those characters won't make `っ` even if they are typed consecutively
      [
        "mk2222",
        [
          [["m", "ｍ", Attrs.FALLBACK_ALPHABET]],
          [["k", "ｋ", Attrs.FALLBACK_ALPHABET]],
          [["2", "２", Attrs.NUMBER]],
          [["2", "２", Attrs.NUMBER]],
          [["2", "２", Attrs.NUMBER]],
          [["2", "２", Attrs.NUMBER]],
        ],
        "",
      ],

      [
        "sysyu",
        [
          [["s", "ｓ", Attrs.FALLBACK_ALPHABET]],
          [["y", "ｙ", Attrs.FALLBACK_ALPHABET]],
          [["syu", "しゅ", Attrs.PREF_FACTOR]],
        ],
        "",
      ],
    ];

    for (let testCase of TEST_CASES) {
      const [src, resolvers, pending] = testCase;
      it(`resolves "${src}" => "${resolvers.map((e) => e.map((e) => e[1])).join("")}"${
        pending !== "" ? ` and "${pending}"` : ""
      }`, () => {
        expect(parseKeystrokes(src)).to.deep.equal({
          resolved: resolvers.map((combo) =>
            combo.map(([strokes, chars, attrs]) => ({
              strokes,
              chars,
              attrs,
            }))
          ),
          pending,
        });
      });
    }
  });
});
