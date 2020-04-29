/** @module question */

import * as msime from "./msime-ja";
import { ComposedKeysequence, getNextKeysequencesList, interpretKeystrokes } from "./msime-ja";
import { TypingStateMachine } from "./state-machine";

export class Question extends TypingStateMachine {
  /**
   *
   * @param {string} goal - A text to be typed.
   * @param {object} [opts] - An option object.
   * @param {module:msime-ja.SequenceChooser} [opts.sequenceChooser] - A sequence picker function used as the default.
   */
  constructor(goal, opts) {
    super();
    if (typeof goal !== "string") {
      throw new TypeError(`goal must be a string (got ${typeof goal})`);
    }
    this._goal = goal;
    this._sequenceChooser = opts?.sequenceChooser ?? msime.sequenceChooser();
  }

  /**
   * The text to be eventually typed.
   * @type {string}
   */
  get goal() {
    return this._goal;
  }

  /**
   * Returns a part of the goal text that are not yet typed.
   * @return {string} - The text that is not typed yet.
   */
  getRestText() {
    return this._goal.substring(this.resolvedText.length);
  }

  /**
   * Returns the first keysequence of every valid keysequence to type the goal text.
   * @param {number} index - A zero-based index that indicates the position of text to start typing.
   * @return {module:msime-ja~Keysequence[]} - The valid first keysequences.
   */
  getFirstKeysequencesFrom(index = 0) {
    return getNextKeysequencesList(this._goal.substring(index));
  }

  /**
   * Returns the first keysequence of every valid keysequence to type the next characters.
   * @return {Keysequence[]} - The valid first keysequences.
   */
  getNextKeysequences() {
    return this.getFirstKeysequencesFrom(this.resolvedText.length);
  }

  /**
   * Returns the first keysequences of every possible keysequence taking the current pending inputs into account.
   * @return {Keysequence[]} - The possible first keysequences taking the pending inputs into consideration
   */
  getNextPossibleKeysequences() {
    return this.getNextKeysequences().filter((keyseq) => keyseq.strokes.startsWith(this.pendingKeystrokes));
  }

  /**
   * Returns keysequences for entire goal text based on sequence chooser function.
   * @param {number} index - A zero-based index that indicates the position of text to start typing.
   * @param {SequenceChooser} [sequenceChooser] - A sequence chooser function; uses the instance's default if not specified.
   * @return {ComposedKeysequence}
   */
  getKeysequenceFrom(index, sequenceChooser = this._sequenceChooser) {
    const resolvers = new ComposedKeysequence();
    let rest = this._goal.substring(index);
    while (rest !== "") {
      const nextKeyseqs = getNextKeysequencesList(rest);
      const resolver = sequenceChooser(nextKeyseqs);
      resolvers.push(resolver);
      rest = rest.substring(resolver.chars.length);
    }
    return resolvers;
  }

  /**
   * Returns keysequences from the current position to the end of goal text based on sequence chooser function.
   * @param {SequenceChooser} [sequenceChooser] - A sequence chooser function; uses the instance's default if not specified.
   * @return {ComposedKeysequence}
   */
  getRestKeysequence(sequenceChooser = this._sequenceChooser) {
    return this.getKeysequenceFrom(this.resolvedText.length, sequenceChooser);
  }

  /**
   * Supply key inputs as an answer.
   * If the given key inputs is invalid as an answer to the goal text, this method does nothing and returns null.
   * @param {string} keyInputs - Key inputs to supply.
   * @return {null|KeystrokesInterpretation} The interpretation of the given key inputs, or null if the inputs are not accepted.
   */
  supplyKeyInputs(keyInputs) {
    const resolvedKeystrokes = interpretKeystrokes(this.pendingKeystrokes + keyInputs);
    if (!this._acceptsKeystrokes(resolvedKeystrokes)) {
      return null;
    }
    super.supplyResolvedKeystrokes(resolvedKeystrokes);
    return resolvedKeystrokes;
  }

  /**
   * Returns a boolean that indicates whether the given key inputs are acceptable.
   * @param {string} keyInputs - Key inputs to test if acceptable.
   * @return {boolean} - True if acceptable, and false if not.
   */
  acceptsKeyInputs(keyInputs) {
    const resolvedKeystrokes = interpretKeystrokes(this.pendingKeystrokes + keyInputs);
    return this._acceptsKeystrokes(resolvedKeystrokes);
  }

  /**
   * Returns a boolean that indicates whether the given keystrokes are acceptable.
   * @param {KeystrokesInterpretation} keystrokes - Keystrokes to test if acceptable.
   * @return {boolean} - True if acceptable, and false if not.
   * @private
   */
  _acceptsKeystrokes(keystrokes) {
    const challenge = keystrokes.resolvers.map((e) => e.chars).join("");
    return this.getRestText().startsWith(challenge);
  }

  /**
   * Returns whether the supplied key inputs are interpreted to be the goal text.
   * @return {boolean} - True if solved, and false if not.
   */
  isSolved() {
    return this.text === this.goal;
  }
}
