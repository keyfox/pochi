import { expect } from "chai";
import { Question } from "../src/question";
import { ATTRS, sequenceChooser } from "../src/msime-ja";

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

    it("throws a TypeError when non-string is passed", () => {
      expect(() => {
        new Question();
      }).to.throw(TypeError, "goal");
      expect(() => {
        new Question(null);
      }).to.throw(TypeError, "goal");
      expect(() => {
        new Question(1234);
      }).to.throw(TypeError, "goal");
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
      expect(q.supplyKeyInputs("sankaku")).to.be.ok;
      expect(q.getRestText()).to.equal("かんすう");
    });
  });

  describe("#getFirstKeysequencesFrom", () => {
    it("returns empty when goal is empty", () => {
      const q = new Question("");
      expect(q.getFirstKeysequencesFrom()).to.be.empty;
    });

    it("works with multiple patterns", () => {
      const q = new Question("しゃみこ");
      expect(q.getFirstKeysequencesFrom()).to.have.deep.members([
        [{ chars: "し", strokes: "shi", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "し", strokes: "ci", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "し", strokes: "si", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sya", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sha", attrs: ATTRS.PREF_FACTOR }],
      ]);
    });

    it("works with consonants", () => {
      const q = new Question("ったこ");
      expect(q.getFirstKeysequencesFrom()).to.have.deep.members([
        [{ chars: "っ", strokes: "xtu", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "っ", strokes: "ltu", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "っ", strokes: "ltsu", attrs: ATTRS.PREF_FACTOR }],
        [
          { chars: "っ", strokes: "t", attrs: ATTRS.DEPENDENT_CONSONANT },
          { chars: "た", strokes: "ta", attrs: ATTRS.PREF_FACTOR },
        ],
      ]);
    });

    it("works with text containing `ん`", () => {
      const q = new Question("んご");
      expect(q.getFirstKeysequencesFrom()).to.have.deep.members([
        [{ chars: "ん", strokes: "xn", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ん", strokes: "nn", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "ん", strokes: "n'", attrs: ATTRS.PREF_FACTOR }],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: ATTRS.PREF_FACTOR },
        ],
      ]);
    });

    it("respects the start index", () => {
      const q = new Question("んご");
      expect(q.getFirstKeysequencesFrom(1)).to.have.deep.members([
        [{ chars: "ご", strokes: "go", attrs: ATTRS.PREF_FACTOR }],
      ]);
    });
  });

  describe("#getNextKeysequences", () => {
    it("returns sequences from the current position", () => {
      const q = new Question("しゃみこ");
      expect(q.getNextKeysequences()).to.have.deep.members([
        [{ chars: "し", strokes: "shi", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "し", strokes: "si", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "し", strokes: "ci", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sya", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sha", attrs: ATTRS.PREF_FACTOR }],
      ]);
    });

    it("returns empty if entirely resolved", () => {
      const q = new Question("ったこ");
      q.supplyKeyInputs("ttako");
      expect(q.getNextKeysequences()).to.be.empty;
    });
  });

  describe("#getNextPossibleKeysequences", () => {
    it("takes the current pending input into account", () => {
      const q = new Question("しゃみこ");
      expect(q.getNextPossibleKeysequences()).to.have.deep.members([
        [{ chars: "し", strokes: "shi", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "し", strokes: "si", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "し", strokes: "ci", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sya", attrs: ATTRS.PREF_FACTOR }],
        [{ chars: "しゃ", strokes: "sha", attrs: ATTRS.PREF_FACTOR }],
      ]);
      q.supplyKeyInputs("c");
      expect(q.getNextPossibleKeysequences()).to.have.deep.members([
        [{ chars: "し", strokes: "ci", attrs: ATTRS.PREF_FACTOR }],
      ]);
    });
  });

  describe("#getKeysequenceFrom", () => {
    it("returns empty when goal is empty", () => {
      const q = new Question("");
      expect(q.getKeysequenceFrom(0)).to.be.empty;
    });

    it("returns a keysequence from the head by default", () => {
      const q = new Question("さんご");
      expect(q.getKeysequenceFrom(0)).to.deep.equal([
        [{ chars: "さ", strokes: "sa", attrs: ATTRS.PREF_FACTOR }],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: ATTRS.PREF_FACTOR },
        ],
      ]);
    });

    it("respects the starting index", () => {
      const q = new Question("さんご");
      expect(q.getKeysequenceFrom(1)).to.deep.equal([
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: ATTRS.PREF_FACTOR },
        ],
      ]);
    });

    it("respects the sequenceChooser", () => {
      const q = new Question("し");
      for (let pref of ["si", "shi", "ci"]) {
        const chooser = sequenceChooser({ byChars: { し: pref } });
        expect(q.getKeysequenceFrom(0, chooser)).to.deep.equal([
          [{ chars: "し", strokes: pref, attrs: ATTRS.PREF_FACTOR }],
        ]);
      }
    });
  });

  describe("#getRestKeysequence", () => {
    it("takes the current pending input into account", () => {
      const q = new Question("さんご");
      expect(q.getRestKeysequence()).to.deep.equal([
        [{ chars: "さ", strokes: "sa", attrs: ATTRS.PREF_FACTOR }],
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: ATTRS.PREF_FACTOR },
        ],
      ]);
      q.supplyKeyInputs("sa");
      expect(q.getRestKeysequence()).to.deep.equal([
        [
          { chars: "ん", strokes: "n", attrs: ATTRS.SINGLE_N },
          { chars: "ご", strokes: "go", attrs: ATTRS.PREF_FACTOR },
        ],
      ]);
    });
  });

  describe("#isSolved", () => {
    it("returns true if solved", () => {
      const q = new Question("あたり");
      q.supplyKeyInputs("atari");
      expect(q.isSolved()).to.be.true;
    });

    it("returns false if solved", () => {
      const q = new Question("はずれ");
      expect(q.isSolved()).to.be.false;
    });
  });

  it("works well", () => {
    const q = new Question("あいうえお");
    expect(q.getRestText()).to.equal("あいうえお");
    expect(q.acceptsKeyInputs("a")).to.be.true;
    expect(q.acceptsKeyInputs("i")).to.be.false;
    expect(q.supplyKeyInputs("i")).to.be.not.ok;
    expect(q.supplyKeyInputs("a")).to.be.ok;
    expect(q.getRestText()).to.equal("いうえお");
    expect(q.supplyKeyInputs("i")).to.be.ok;
    expect(q.getRestText()).to.equal("うえお");
  });
});
