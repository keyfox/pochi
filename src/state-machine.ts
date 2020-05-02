import { MSIMEKeyCombo, ParsedKeystrokes, parseKeystrokes } from "./msime-ja/index";

/**
 * Class representing a typing state machine.
 */
export class TypingStateMachine {
  /**
   * The supplied keystrokes that are not yet resolved.
   * @internal
   */
  private _pendingKeystrokes = "";
  /**
   * The resolved keystrokes.
   * @internal
   */
  private _keyCombos: MSIMEKeyCombo[] = [];
  /**
   * A string that the resolved keystrokes composes.
   * @internal
   */
  private _resolvedText = "";
  /**
   * A string that represents the resolved keystrokes so far.
   * @internal
   */
  private _resolvedKeystrokes = "";

  /**
   * Supply keystrokes.
   * @param keystrokes - Keystrokes to supply.
   * @return Parsing result of the given keystrokes.
   */
  supplyKeystrokes(keystrokes: string): ParsedKeystrokes {
    const resolvedKeystrokes = parseKeystrokes(this._pendingKeystrokes + keystrokes);
    this._supplyResolvedKeystrokes(resolvedKeystrokes);
    return resolvedKeystrokes;
  }

  /**
   * Supply keystrokes in ParsedKeystrokes form.
   * @param resolvedKeystrokes - A ResolvedKeystrokes instance to supply.
   * @internal
   */
  _supplyResolvedKeystrokes(resolvedKeystrokes: ParsedKeystrokes): void {
    const { resolved, pending } = resolvedKeystrokes;
    if (resolved[0] && !resolved[0].strokes.startsWith(this._pendingKeystrokes)) {
      throw new RangeError(
        `the given keystrokes (${resolved[0].chars}) conflicts
        with the current pending keystrokes (${this._pendingKeystrokes})`
      );
    }
    this._keyCombos = [...this._keyCombos, ...resolved];
    this._pendingKeystrokes = pending;
    resolved.forEach((e: MSIMEKeyCombo) => {
      this._resolvedText += e.chars;
      this._resolvedKeystrokes += e.strokes;
    });
  }

  /**
   * Parsed keystrokes that is supplied so far.
   */
  get parsedKeystrokes(): ParsedKeystrokes {
    return { resolved: [...this._keyCombos], pending: this._pendingKeystrokes };
  }

  /**
   * The key combos so far.
   */
  get keyCombos(): MSIMEKeyCombo[] {
    return [...this._keyCombos];
  }

  /**
   * The current keystrokes that are not yet resolved.
   */
  get pendingKeystrokes(): string {
    return this._pendingKeystrokes;
  }

  /**
   * The text that are resolved from keystrokes.
   */
  get resolvedText(): string {
    return this._resolvedText;
  }

  /**
   * The current interpretation of keystrokes in string form.
   */
  get text(): string {
    return this._resolvedText + this._pendingKeystrokes;
  }

  /**
   * The part of supplied keystrokes which are already resolved.
   */
  get resolvedKeystrokes(): string {
    return this._resolvedKeystrokes;
  }

  /**
   * The entire supplied keystrokes so far.
   */
  get keystrokes(): string {
    return this._resolvedKeystrokes + this._pendingKeystrokes;
  }
}
