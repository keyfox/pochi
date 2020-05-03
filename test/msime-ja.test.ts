import { expect } from "chai";
import { getFirstKeyCombos as getNextKeyseqsList, keyComboChooser, parseKeystrokes } from "../src/msime-ja";
import { DETERMINISTIC_KEYSTROKES_TO_CHARS } from "../src/msime-ja/keystrokes";
import { Attrs as ATTRS } from "../src/msime-ja/resolvers";

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
    [{ chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR }],
    [{ chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR }],
    [{ chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR }],
  ];
  const EXPLICIT_N = [
    [{ chars: "ん", strokes: "xn", attrs: ATTRS.PREF_FACTOR }],
    [{ chars: "ん", strokes: "nn", attrs: ATTRS.PREF_FACTOR }],
    [{ chars: "ん", strokes: "n'", attrs: ATTRS.PREF_FACTOR }],
  ];

  const TEST_CASES: [string, { chars: string; strokes: string; attrs: ATTRS }[][]][] = [
    // empty
    ["", []],

    // single pattern
    ["あ", [[{ chars: "あ", strokes: "a", attrs: ATTRS.PREF_FACTOR }]]],

    // 2 or more pattern
    [
      "い",
      [
        [{ chars: "い", strokes: "i", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "い", strokes: "yi", attrs: ATTRS.PREF_FACTOR }],
      ],
    ],
    [
      "か",
      [
        [{ chars: "か", strokes: "ka", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "か", strokes: "ca", attrs: ATTRS.PREF_FACTOR }],
      ],
    ],

    // // 2 or more character
    [
      "ふぇ",
      [
        [{ chars: "ふ", strokes: "fu", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ふ", strokes: "hu", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ふぇ", strokes: "fe", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ふぇ", strokes: "fye", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ふぇ", strokes: "fwe", attrs: ATTRS.PREF_FACTOR }],
      ],
    ],
    [
      "ちゃ",
      [
        [{ chars: "ち", strokes: "chi", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ち", strokes: "ti", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ちゃ", strokes: "cha", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ちゃ", strokes: "tya", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ちゃ", strokes: "cya", attrs: ATTRS.PREF_FACTOR }],
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
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "た", strokes: "ta", attrs: ATTRS.PREF_FACTOR },
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
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "か", strokes: "ka", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "c",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "か", strokes: "ca", attrs: ATTRS.PREF_FACTOR },
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
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "l",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "l",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR },
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
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "l",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "l",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          {
            chars: "っ",
            strokes: "t",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          {
            chars: "っ",
            strokes: "t",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "た", strokes: "ta", attrs: ATTRS.PREF_FACTOR },
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
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ん", strokes: "xn", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んんっ",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ん", strokes: "xn", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んんって",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ん", strokes: "xn", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    // `ん` can be dealt with single `n` if the first keystroke for the character next to `ん` is not `n`
    [
      "んか",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "か", strokes: "ka", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "か", strokes: "ca", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んぁ",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ぁ", strokes: "xa", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ぁ", strokes: "la", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んっ",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んって",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          {
            chars: "っ",
            strokes: "t",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "て", strokes: "te", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んっっ",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          {
            chars: "っ",
            strokes: "x",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          {
            chars: "っ",
            strokes: "l",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          {
            chars: "っ",
            strokes: "l",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    [
      "んっって",
      [
        ...EXPLICIT_N,
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          {
            chars: "っ",
            strokes: "x",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          {
            chars: "っ",
            strokes: "l",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          {
            chars: "っ",
            strokes: "l",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR },
        ],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          {
            chars: "っ",
            strokes: "t",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          {
            chars: "っ",
            strokes: "t",
            attrs: ATTRS.CONSONANT_PREFIX,
          },
          { chars: "て", strokes: "te", attrs: ATTRS.PREF_FACTOR },
        ],
      ],
    ],
    // when the goal is terminated `ん`, then we have to type `n` explicitly
    ["ん", EXPLICIT_N],

    // if any undefined key is supplied, then just return it
    ["ー", [[{ chars: "ー", strokes: "ー", attrs: ATTRS.UNDEFINED }]]],
    ["１", [[{ chars: "１", strokes: "１", attrs: ATTRS.UNDEFINED }]]],
    ["a", [[{ chars: "a", strokes: "a", attrs: ATTRS.UNDEFINED }]]],
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
    const TEST_CASES: [string, [string, string, ATTRS][][], string][] = [
      // resolves nothing when the input is empty
      ["", [], ""],
      // anything resolved will be put into an array, and others will be returned as a string
      ["a", [[["a", "あ", ATTRS.PREF_FACTOR]]], ""],
      ["b", [], "b"],
      ["ka", [[["ka", "か", ATTRS.PREF_FACTOR]]], ""],
      ["kak", [[["ka", "か", ATTRS.PREF_FACTOR]]], "k"],
      // dependent consonants
      [
        "tta",
        [
          [
            ["t", "っ", ATTRS.CONSONANT_PREFIX],
            ["ta", "た", ATTRS.PREF_FACTOR],
          ],
        ],
        "",
      ],
      [
        "ttta",
        [
          [
            ["t", "っ", ATTRS.CONSONANT_PREFIX],
            ["t", "っ", ATTRS.CONSONANT_PREFIX],
            ["ta", "た", ATTRS.PREF_FACTOR],
          ],
        ],
        "",
      ],
      [
        "furess",
        [
          [["fu", "ふ", ATTRS.PREF_FACTOR]],
          [["re", "れ", ATTRS.PREF_FACTOR]],
          [["s", "っ", ATTRS.CONSONANT_PREFIX]],
        ],
        "s",
      ],
      [
        "tatte",
        [
          [["ta", "た", ATTRS.PREF_FACTOR]],
          [
            ["t", "っ", ATTRS.CONSONANT_PREFIX],
            ["te", "て", ATTRS.PREF_FACTOR],
          ],
        ],
        "",
      ],
      // `n` characters
      ["kan", [[["ka", "か", ATTRS.PREF_FACTOR]]], "n"],
      ["kann", [[["ka", "か", ATTRS.PREF_FACTOR]], [["nn", "ん", ATTRS.PREF_FACTOR]]], ""],
      [
        "kankei",
        [
          [["ka", "か", ATTRS.PREF_FACTOR]],
          [
            ["n", "ん", ATTRS.SINGLE_N],
            ["ke", "け", ATTRS.PREF_FACTOR],
          ],
          [["i", "い", ATTRS.PREF_FACTOR]],
        ],
        "",
      ],
      ["nnka", [[["nn", "ん", ATTRS.PREF_FACTOR]], [["ka", "か", ATTRS.PREF_FACTOR]]], ""],
      ["nnnnn", [[["nn", "ん", ATTRS.PREF_FACTOR]], [["nn", "ん", ATTRS.PREF_FACTOR]]], "n"],
      // arbitary text
      [
        "orehajaiangakidaishou",
        [
          [["o", "お", ATTRS.PREF_FACTOR]],
          [["re", "れ", ATTRS.PREF_FACTOR]],
          [["ha", "は", ATTRS.PREF_FACTOR]],
          [["ja", "じゃ", ATTRS.PREF_FACTOR]],
          [["i", "い", ATTRS.PREF_FACTOR]],
          [["a", "あ", ATTRS.PREF_FACTOR]],
          [
            ["n", "ん", ATTRS.SINGLE_N],
            ["ga", "が", ATTRS.PREF_FACTOR],
          ],
          [["ki", "き", ATTRS.PREF_FACTOR]],
          [["da", "だ", ATTRS.PREF_FACTOR]],
          [["i", "い", ATTRS.PREF_FACTOR]],
          [["sho", "しょ", ATTRS.PREF_FACTOR]],
          [["u", "う", ATTRS.PREF_FACTOR]],
        ],
        "",
      ],
      [
        "hokkaidou",
        [
          [["ho", "ほ", ATTRS.PREF_FACTOR]],
          [
            ["k", "っ", ATTRS.CONSONANT_PREFIX],
            ["ka", "か", ATTRS.PREF_FACTOR],
          ],
          [["i", "い", ATTRS.PREF_FACTOR]],
          [["do", "ど", ATTRS.PREF_FACTOR]],
          [["u", "う", ATTRS.PREF_FACTOR]],
        ],
        "",
      ],
      [
        "170senchi74kiro",
        [
          [["1", "1", ATTRS.UNDEFINED]],
          [["7", "7", ATTRS.UNDEFINED]],
          [["0", "0", ATTRS.UNDEFINED]],
          [["se", "せ", ATTRS.PREF_FACTOR]],
          [
            ["n", "ん", ATTRS.SINGLE_N],
            ["chi", "ち", ATTRS.PREF_FACTOR],
          ],
          [["7", "7", ATTRS.UNDEFINED]],
          [["4", "4", ATTRS.UNDEFINED]],
          [["ki", "き", ATTRS.PREF_FACTOR]],
          [["ro", "ろ", ATTRS.PREF_FACTOR]],
        ],
        "",
      ],
      // characters that is not on the basic rules
      [
        "mk2",
        [[["m", "m", ATTRS.UNDEFINED]], [["k", "k", ATTRS.UNDEFINED]], [["2", "2", ATTRS.UNDEFINED]]],
        "",
      ],
      // those characters won't make `っ` even if they are typed consecutively
      [
        "mk2222",
        [
          [["m", "m", ATTRS.UNDEFINED]],
          [["k", "k", ATTRS.UNDEFINED]],
          [["2", "2", ATTRS.UNDEFINED]],
          [["2", "2", ATTRS.UNDEFINED]],
          [["2", "2", ATTRS.UNDEFINED]],
          [["2", "2", ATTRS.UNDEFINED]],
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
