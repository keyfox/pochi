import { MSIMEKeyCombo, ParsedKeystrokes, parseKeystrokes } from "./msime-ja";
import { Attrs } from "./msime-ja/resolvers";

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
    if (
      resolved.length >= 1 &&
      !resolved
        .map((c) => c.strokes)
        .join("")
        .startsWith(this._pendingKeystrokes)
    ) {
      throw new RangeError(
        `the given keystrokes (${resolved[0].strokes}) conflicts
        with the current pending keystrokes (${this._pendingKeystrokes})`
      );
    }
    const lastKeyCombo = this._keyCombos[this._keyCombos.length - 1];
    if (lastKeyCombo && (lastKeyCombo[lastKeyCombo.length - 1].attrs & Attrs.DEPENDENT) === Attrs.DEPENDENT) {
      // if the last solver in the last key combo is dependent,
      // then concatenate the newly resolved key combo into the last key combo
      if (resolved[0]) {
        // Ideally it should be `resolved.slice(0, 1)`, but we don't want create a new array just for that
        // NOTE: Wrap with the condition or it will crash in transpiled code because `...(undefined)` doesn't work
        lastKeyCombo.push(...resolved[0]);
      }
      this._keyCombos.push(...resolved.slice(1));
    } else {
      this._keyCombos.push(...resolved);
    }

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
