import { TypingStateMachine } from "../src/state-machine";
import { expect } from "chai";
import { ATTRS, interpretKeystrokes } from "../src/msime-ja";

describe("TypingStateMachine", () => {
  describe("#supplyResolvedKeystrokes", () => {
    it("throws RangeError when conflict", () => {
      const q = new TypingStateMachine();
      q.supplyKeyInputs("k");
      expect(q.pendingKeystrokes).to.equal("k");
      expect(() => {
        q.supplyResolvedKeystrokes({
          resolvers: [{ chars: "か", strokes: "ca" }],
          pending: "",
        });
      }).to.throw(RangeError, "conflict");
    });
  });

  describe("#supplyKeyInput", () => {
    it("does nothing for empty key input", () => {
      const q = new TypingStateMachine();
      q.supplyKeyInputs("");
      expect(q.currentInterpretation).to.deep.equal({ resolvers: [], pending: "" });
    });

    it("accepts a key input", () => {
      const q = new TypingStateMachine();
      q.supplyKeyInputs("a");
      expect(q.resolvedText).to.equal("あ");
      expect(q.pendingKeystrokes).to.equal("");
    });

    it("accepts long key inputs", () => {
      const q = new TypingStateMachine();
      q.supplyKeyInputs("irohanihoheto");
      expect(q.resolvedText).to.equal("いろはにほへと");
      expect(q.pendingKeystrokes).to.equal("");
    });

    it("handles key inputs that are not resolved", () => {
      const q = new TypingStateMachine();
      q.supplyKeyInputs("furess");
      expect(q.resolvedText).to.equal("ふれっ");
      expect(q.pendingKeystrokes).to.equal("s");
    });

    it("resolves key inputs that have been pended", () => {
      const q = new TypingStateMachine();
      q.supplyKeyInputs("furess");
      expect(q.resolvedText).to.equal("ふれっ");
      expect(q.pendingKeystrokes).to.equal("s");
      q.supplyKeyInputs("hu");
      expect(q.resolvedText).to.equal("ふれっしゅ");
      expect(q.pendingKeystrokes).to.equal("");
    });

    it("leave pending key input as it is indeterministic keysequence", () => {
      const q = new TypingStateMachine();
      q.supplyKeyInputs("shain");
      expect(q.resolvedText).to.equal("しゃい");
      expect(q.resolvedText).not.to.equal("しゃいん");
      expect(q.pendingKeystrokes).to.equal("n");
    });
  });

  const TEST_CASES = [
    ["", [[], ""]],
    ["a", [["a"], ""]],
    ["irohanihoheto", [["i", "ro", "ha", "ni", "ho", "he", "to"], ""]],
    ["hokkaidou", [["ho", "k", "ka", "i", "do", "u"], ""]],
    ["shinkaxnsenn", [["shi", "n", "ka", "xn", "se", "nn"], ""]],
    ["bidan", [["bi", "da"], "n"]],
  ];

  describe("currentInterpretation", () => {
    for (let [src, [strokes, pending]] of TEST_CASES) {
      it(`handles "${src}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeyInputs(src);
        expect(q).to.have.property("currentInterpretation").that.have.property("pending", pending);
        expect(q).to.have.property("currentInterpretation").that.have.property("resolvers");
        expect(q.currentInterpretation.resolvers.map((e) => e.strokes)).to.deep.equal(strokes);
        expect(q.currentInterpretation.resolvers.map((e) => e.chars)).to.deep.equal(
          interpretKeystrokes(strokes.join("")).resolvers.map((e) => e.chars)
        );
      });
    }
  });

  describe("pendingKeystrokes", () => {
    for (let [src, [strokes, pending]] of TEST_CASES) {
      const expectation = pending;
      it(`handles "${src}" to "${expectation}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeyInputs(src);
        expect(q).to.have.property("pendingKeystrokes", expectation);
      });
    }
  });

  describe("resolvedText", () => {
    for (let [src, [strokes, pending]] of TEST_CASES) {
      const expectation = interpretKeystrokes(strokes.join(""))
        .resolvers.map((e) => e.chars)
        .join("");
      it(`handles "${src}" to "${expectation}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeyInputs(src);
        expect(q).to.have.property("resolvedText", expectation);
      });
    }
  });

  describe("text", () => {
    it("returns the same value as resolvedText + pendingKeystrokes", () => {
      for (let [src, [strokes, pending]] of TEST_CASES) {
        const q = new TypingStateMachine();
        q.supplyKeyInputs(src);
        expect(q).to.have.property("text", q.resolvedText + q.pendingKeystrokes);
      }
    });
  });

  describe("resolvedKeystrokes", () => {
    for (let [src, [strokes, pending]] of TEST_CASES) {
      const expectation = strokes.join("");
      it(`handles "${src}" to "${expectation}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeyInputs(src);
        expect(q).to.have.property("resolvedKeystrokes", expectation);
      });
    }
  });

  describe("keystrokes", () => {
    for (let [src, [strokes, pending]] of TEST_CASES) {
      const expectation = strokes.join("") + pending;
      it(`handles "${src}" to "${expectation}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeyInputs(src);
        expect(q).to.have.property("keystrokes", expectation);
      });
    }
  });

  describe("resolvers", () => {
    it("returns the resolvers so far", () => {
      const q = new TypingStateMachine();
      q.supplyKeyInputs("a");
      expect(q)
        .to.have.property("resolvers")
        .that.have.deep.members([{ chars: "あ", strokes: "a", attrs: ATTRS.PREF_FACTOR }]);
    });
  });
});
