import { TypingStateMachine } from "../lib";
import { expect } from "chai";
import { MSIMEKeyCombo } from "../lib/msime-ja";
import { Attrs } from "../lib/msime-ja/resolvers";

describe("TypingStateMachine", () => {
  describe("#_supplyResolvedKeystrokes", () => {
    it("throws RangeError when conflict", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("k");
      expect(q.pendingKeystrokes).to.equal("k");
      expect(() => {
        q._supplyResolvedKeystrokes({
          resolved: [new MSIMEKeyCombo({ chars: "か", strokes: "ca", attrs: Attrs.PREF_FACTOR })],
          pending: "",
        });
      }).to.throw(RangeError, "conflict");
    });
  });

  describe("#supplyKeystrokes", () => {
    it("does nothing for empty key input", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("");
      expect(q.parsedKeystrokes).to.deep.equal({
        resolved: [],
        pending: "",
      });
    });

    it("accepts a key input", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("a");
      expect(q.resolvedText).to.equal("あ");
      expect(q.pendingKeystrokes).to.equal("");
    });

    it("accepts long key inputs", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("irohanihoheto");
      expect(q.resolvedText).to.equal("いろはにほへと");
      expect(q.pendingKeystrokes).to.equal("");
    });

    it("handles key inputs that are not resolved", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("furess");
      expect(q.resolvedText).to.equal("ふれっ");
      expect(q.pendingKeystrokes).to.equal("s");
    });

    it("resolves key inputs that have been pended", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("furess");
      expect(q.resolvedText).to.equal("ふれっ");
      expect(q.pendingKeystrokes).to.equal("s");
      q.supplyKeystrokes("hu");
      expect(q.resolvedText).to.equal("ふれっしゅ");
      expect(q.pendingKeystrokes).to.equal("");
    });

    it("leave pending key input as it is indeterministic keysequence", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("shain");
      expect(q.resolvedText).to.equal("しゃい");
      expect(q.resolvedText).not.to.equal("しゃいん");
      expect(q.pendingKeystrokes).to.equal("n");
    });

    it("does same behaviours no matter how keystrokes are supplied", () => {
      for (const keystrokes of ["irohanihoheto", "hokkaidou", "shinkansenn"]) {
        const allAtOnce = new TypingStateMachine();
        const keyByKey = new TypingStateMachine();
        allAtOnce.supplyKeystrokes(keystrokes);
        for (let i = 0, j = keystrokes.length; i < j; ++i) {
          keyByKey.supplyKeystrokes(keystrokes.charAt(i));
        }
        expect(allAtOnce.keyCombos).to.deep.equal(keyByKey.keyCombos);
        expect(allAtOnce.parsedKeystrokes).to.deep.equal(keyByKey.parsedKeystrokes);
        expect(allAtOnce.resolvedText).to.deep.equal(keyByKey.resolvedText);
        expect(allAtOnce.resolvedKeystrokes).to.deep.equal(keyByKey.resolvedKeystrokes);
        expect(allAtOnce.pendingKeystrokes).to.deep.equal(keyByKey.pendingKeystrokes);
      }
    });

    it("won't throw RangeError when no conflict", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("sy");
      expect(q.pendingKeystrokes).to.equal("sy");
      expect(() => {
        q.supplyKeystrokes("s");
      }).not.to.throw(RangeError);
    });
  });

  const TEST_CASES: [string, [string, string[][], string]][] = [
    ["", ["", [], ""]],
    ["a", ["あ", [["a"]], ""]],
    ["irohanihoheto", ["いろはにほへと", [["i"], ["ro"], ["ha"], ["ni"], ["ho"], ["he"], ["to"]], ""]],
    ["hokkaidou", ["ほっかいどう", [["ho"], ["k", "ka"], ["i"], ["do"], ["u"]], ""]],
    ["shinkaxnsenn", ["しんかんせん", [["shi"], ["n", "ka"], ["xn"], ["se"], ["nn"]], ""]],
    ["bidan", ["びだ", [["bi"], ["da"]], "n"]],
    ["bidann", ["びだん", [["bi"], ["da"], ["nn"]], ""]],
    ["1jikann", ["１じかん", [["1"], ["ji"], ["ka"], ["nn"]], ""]],
    ["sysyu", ["ｓｙしゅ", [["s"], ["y"], ["syu"]], ""]],
  ];

  describe("parsedKeystrokes", () => {
    for (let [src, [resolvedText, strokes, pending]] of TEST_CASES) {
      it(`handles "${src}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeystrokes(src);
        expect(q).to.have.property("parsedKeystrokes").that.have.property("pending", pending);
        expect(q).to.have.property("parsedKeystrokes").that.have.property("resolved");
        expect(q.parsedKeystrokes.resolved.map((combo) => combo.map((s) => s.strokes))).to.deep.equal(strokes);
      });
    }
  });

  describe("pendingKeystrokes", () => {
    for (let [src, [resolvedText, strokes, pending]] of TEST_CASES) {
      const expectation = pending;
      it(`handles "${src}" to "${expectation}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeystrokes(src);
        expect(q).to.have.property("pendingKeystrokes", expectation);
      });
    }
  });

  describe("resolvedText", () => {
    for (let [src, [resolvedText, resolved, pending]] of TEST_CASES) {
      it(`handles "${src}" to "${resolvedText}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeystrokes(src);
        expect(q).to.have.property("resolvedText", resolvedText);
      });
    }
  });

  describe("text", () => {
    it("returns the same value as resolvedText + pendingKeystrokes", () => {
      for (let [src, [resolvedText, strokes, pending]] of TEST_CASES) {
        const q = new TypingStateMachine();
        q.supplyKeystrokes(src);
        expect(q).to.have.property("text", q.resolvedText + q.pendingKeystrokes);
      }
    });
  });

  describe("resolvedKeystrokes", () => {
    for (let [src, [resolvedText, strokes, pending]] of TEST_CASES) {
      const expectation = strokes.map((e) => e.join("")).join("");
      it(`handles "${src}" to "${expectation}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeystrokes(src);
        expect(q).to.have.property("resolvedKeystrokes", expectation);
      });
    }
  });

  describe("keystrokes", () => {
    for (let [src, [resolvedText, strokes, pending]] of TEST_CASES) {
      const expectation = strokes.map((e) => e.join("")).join("") + pending;
      it(`handles "${src}" to "${expectation}"`, () => {
        const q = new TypingStateMachine();
        q.supplyKeystrokes(src);
        expect(q).to.have.property("keystrokes", expectation);
      });
    }
  });

  describe("keyCombos", () => {
    it("returns the resolved so far", () => {
      const q = new TypingStateMachine();
      q.supplyKeystrokes("a");
      expect(q)
        .to.have.property("keyCombos")
        .that.have.deep.members([[{ chars: "あ", strokes: "a", attrs: Attrs.NONE }]]);
    });
  });
});
