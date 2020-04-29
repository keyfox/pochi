/** @module state-machine */

import { interpretKeystrokes } from "./msime-ja";

/**
 * Class representing a typing state machine.
 */
export class TypingStateMachine {
  /**
   * Create a typing state machine.
   */
  constructor() {
    /**
     * The supplied keystrokes that are not yet resolved.
     * @type {string}
     * @private
     */
    this._pendingKeystrokes = "";

    /**
     * The resolved keystrokes.
     * @type {module:msime-ja.KeystrokesInterpretation[]}
     * @private
     */
    this._resolvers = [];

    /**
     * A string that the resolved keystrokes composes.
     * @type {string}
     * @private
     */
    this._resolvedText = "";

    /**
     * A string that represents the resolved keystrokes so far.
     * @type {string}
     * @private
     */
    this._resolvedKeystrokes = "";
  }

  /**
   * Supply keystrokes.
   * @param {string} keystrokes - Keystrokes to supply.
   * @return {module:msime-ja.KeystrokesInterpretation}
   */
  supplyKeyInputs(keystrokes) {
    const resolvedKeystrokes = interpretKeystrokes(this._pendingKeystrokes + keystrokes);
    this.supplyResolvedKeystrokes(resolvedKeystrokes);
    return resolvedKeystrokes;
  }

  /**
   * Supply keystrokes in KeystrokesInterpretation form.
   * @param {KeystrokesInterpretation} resolvedKeystrokes - A ResolvedKeystrokes instance to supply.
   */
  supplyResolvedKeystrokes(resolvedKeystrokes) {
    const { resolvers, pending } = resolvedKeystrokes;
    if (resolvers[0] && !resolvers[0].strokes.startsWith(this._pendingKeystrokes)) {
      throw new RangeError(
        `the given keystrokes (${resolvers[0].chars}) conflicts
        with the current pending keystrokes (${this._pendingKeystrokes})`
      );
    }
    this._resolvers = [...this._resolvers, ...resolvers];
    this._pendingKeystrokes = pending;
    resolvers.forEach((e) => {
      this._resolvedText += e.chars;
      this._resolvedKeystrokes += e.strokes;
    });
  }

  /**
   * The current interpretation of keystrokes supplied so far.
   * @type {KeystrokesInterpretation}
   */
  get currentInterpretation() {
    return { resolvers: [...this._resolvers], pending: this._pendingKeystrokes };
  }

  /**
   * The resolver keystrokes so far.
   * @type {Keysequence[]}
   */
  get resolvers() {
    return [...this._resolvers];
  }

  /**
   * The current keystrokes that are not yet resolved.
   * @type {string}
   */
  get pendingKeystrokes() {
    return this._pendingKeystrokes;
  }

  /**
   * The text that are resolved from keystrokes.
   * @type {string}
   */
  get resolvedText() {
    return this._resolvedText;
  }

  /**
   * The current interpretation of keystrokes in string form.
   *
   * This is a shorthand for [the resolved text]{@link TypingStateMachine#resolvedText}
   * followed by [the pending keystrokes]{@link TypingStateMachine#pendingKeystrokes}.
   * @type {string}
   */
  get text() {
    return this._resolvedText + this._pendingKeystrokes;
  }

  /**
   * The supplied keystrokes which are already resolved.
   * @type {string}
   */
  get resolvedKeystrokes() {
    return this._resolvedKeystrokes;
  }

  /**
   * The entire supplied keystrokes so far.
   * @type {string}
   */
  get keystrokes() {
    return this._resolvedKeystrokes + this._pendingKeystrokes;
  }
}
