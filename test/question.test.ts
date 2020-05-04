import { expect } from "chai";
import { Question } from "../src";
import { keyComboChooser } from "../src/msime-ja";
import { Attrs } from "../src/msime-ja/resolvers";

describe("Question", () => {
  describe("#constructor", () => {
    it("accepts a string", () => {
      expect(() => {
        new Question("string to be typed");
      }).not.to.throw();
      expect(() => {
        new Question("");
      }).not.to.throw();
    });
  });

  describe("goal", () => {
    it("same as the string given in constructor", () => {
      expect(new Question("goaltext").goal).to.equal("goaltext");
    });
  });

  describe("#getRestText", () => {
    it("returns the rest string", () => {
      expect(new Question("rest-string").getRestText()).to.equal("rest-string");
    });

    it("returns the rest string even if empty", () => {
      expect(new Question("").getRestText()).to.equal("");
    });

    it("returns the rest string after accepted inputs", () => {
      const q = new Question("さんかくかんすう");
      expect(q.supplyKeystrokes("sankaku")).to.be.ok;
      expect(q.getRestText()).to.equal("かんすう");
    });
  });

  describe("#getFirstKeyCombosFrom", () => {
    it("returns empty when goal is empty", () => {
      const q = new Question("");
      expect(q.getFirstKeyCombosFrom()).to.be.empty;
    });

    it("works with multiple patterns", () => {
      const q = new Question("しゃみこ");
      expect(q.getFirstKeyCombosFrom()).to.have.deep.members([
        [{ chars: "し", strokes: "shi", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "し", strokes: "ci", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "し", strokes: "si", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sya", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sha", attrs: Attrs.PREF_FACTOR }],
      ]);
    });

    it("works with consonants", () => {
      const q = new Question("ったこ");
      expect(q.getFirstKeyCombosFrom()).to.have.deep.members([
        [{ chars: "っ", strokes: "xtu", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "っ", strokes: "ltu", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "っ", strokes: "ltsu", attrs: Attrs.PREF_FACTOR }],
        [
          { chars: "っ", strokes: "t", attrs: Attrs.CONSONANT_PREFIX },
          { chars: "た", strokes: "ta", attrs: Attrs.NONE },
        ],
      ]);
    });

    it("works with text containing `ん`", () => {
      const q = new Question("んご");
      expect(q.getFirstKeyCombosFrom()).to.have.deep.members([
        [{ chars: "ん", strokes: "xn", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ん", strokes: "nn", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "ん", strokes: "n'", attrs: Attrs.PREF_FACTOR }],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: Attrs.NONE },
        ],
      ]);
    });

    it("respects the start index", () => {
      const q = new Question("んご");
      expect(q.getFirstKeyCombosFrom(1)).to.have.deep.members([
        [{ chars: "ご", strokes: "go", attrs: Attrs.NONE }],
      ]);
    });
  });

  describe("#getNextKeyCombos", () => {
    it("returns resolved from the current position", () => {
      const q = new Question("しゃみこ");
      expect(q.getNextKeyCombos()).to.have.deep.members([
        [{ chars: "し", strokes: "shi", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "し", strokes: "si", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "し", strokes: "ci", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sya", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sha", attrs: Attrs.PREF_FACTOR }],
      ]);
    });

    it("returns empty if entirely resolved", () => {
      const q = new Question("ったこ");
      q.supplyKeystrokes("ttako");
      expect(q.getNextKeyCombos()).to.be.empty;
    });
  });

  describe("#getNextPossibleKeyCombos", () => {
    it("takes the current pending input into account", () => {
      const q = new Question("しゃみこ");
      expect(q.getNextPossibleKeyCombos()).to.have.deep.members([
        [{ chars: "し", strokes: "shi", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "し", strokes: "si", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "し", strokes: "ci", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sya", attrs: Attrs.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sha", attrs: Attrs.PREF_FACTOR }],
      ]);
      q.supplyKeystrokes("c");
      expect(q.getNextPossibleKeyCombos()).to.have.deep.members([
        [{ chars: "し", strokes: "ci", attrs: Attrs.PREF_FACTOR }],
      ]);
    });
  });

  describe("#getKeyCombosSequence", () => {
    it("returns empty when goal is empty", () => {
      const q = new Question("");
      expect(q.getKeyCombosSequence(0)).to.be.empty;
    });

    it("returns a keysequence from the head by default", () => {
      const q = new Question("さんご");
      expect(q.getKeyCombosSequence(0)).to.deep.equal([
        [{ chars: "さ", strokes: "sa", attrs: Attrs.NONE }],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: Attrs.NONE },
        ],
      ]);
    });

    it("respects the starting index", () => {
      const q = new Question("さんご");
      expect(q.getKeyCombosSequence(1)).to.deep.equal([
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: Attrs.NONE },
        ],
      ]);
    });

    it("respects the keyComboChooser", () => {
      const q = new Question("し");
      for (let pref of ["si", "shi", "ci"]) {
        const chooser = keyComboChooser({ byChars: { し: pref } });
        expect(q.getKeyCombosSequence(0, chooser)).to.deep.equal([
          [{ chars: "し", strokes: pref, attrs: Attrs.PREF_FACTOR }],
        ]);
      }
    });
  });

  describe("#getRestKeyCombosSequence", () => {
    it("takes the current pending input into account", () => {
      const q = new Question("さんご");
      expect(q.getRestKeyCombosSequence()).to.deep.equal([
        [{ chars: "さ", strokes: "sa", attrs: Attrs.NONE }],
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: Attrs.NONE },
        ],
      ]);
      q.supplyKeystrokes("sa");
      expect(q.getRestKeyCombosSequence()).to.deep.equal([
        [
          { chars: "ん", strokes: "n", attrs: Attrs.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: Attrs.NONE },
        ],
      ]);
    });
  });

  describe("#isSolved", () => {
    it("returns true if solved", () => {
      const q = new Question("あたり");
      q.supplyKeystrokes("atari");
      expect(q.isSolved()).to.be.true;
    });

    it("returns false if solved", () => {
      const q = new Question("はずれ");
      expect(q.isSolved()).to.be.false;
    });
  });

  it("reject invalid input", () => {
    const q = new Question("あらしがすぎたあとに");
    expect(() => q.supplyKeystrokes("a")).not.to.throw(RangeError, "unacceptable");
    expect(() => q.supplyKeystrokes("r")).not.to.throw(RangeError, "unacceptable");
    expect(() => q.supplyKeystrokes("a")).not.to.throw(RangeError, "unacceptable");
    expect(() => q.supplyKeystrokes("g")).to.throw(RangeError, "unacceptable");
  });

  it("works well", () => {
    const q = new Question("あいうえお");
    expect(q.getRestText()).to.equal("あいうえお");
    expect(q.acceptsKeystrokes("a")).to.be.true;
    expect(q.acceptsKeystrokes("i")).to.be.false;
    expect(() => q.supplyKeystrokes("i")).to.throw(RangeError, "unacceptable");
    expect(q.supplyKeystrokes("a")).to.be.ok;
    expect(q.getRestText()).to.equal("いうえお");
    expect(q.supplyKeystrokes("i")).to.be.ok;
    expect(q.getRestText()).to.equal("うえお");
  });
});
