import * as msime from "./msime-ja/index";
import {
  getFirstKeyCombos,
  KeyComboChooser,
  MSIMEKeyCombo,
  ParsedKeystrokes,
  parseKeystrokes,
} from "./msime-ja";
import { TypingStateMachine } from "./state-machine";

/**
 * Class represents a question.
 */
export class Question extends TypingStateMachine {
  /**
   * KeyComboChooser function to use.
   * @internal
   */
  private readonly _keyComboChooser: KeyComboChooser;

  /**
   * @param goal - A text to be eventually typed.
   * @param opts - An option object.
   */
  constructor(
    public readonly goal: string,
    opts?: {
      /**
       * A key combo chooser function.
       */
      keyComboChooser?: KeyComboChooser;
    }
  ) {
    super();
    this._keyComboChooser = opts?.keyComboChooser ?? msime.keyComboChooser();
  }

  /**
   * Returns a part of the goal text that are not yet typed.
   * @return The text that is not typed yet.
   */
  getRestText(): string {
    return this.goal.substring(this.resolvedText.length);
  }

  /**
   * Returns the first valid key combos to type the goal text.
   * @param index - A zero-based index that indicates the position of text to start typing.
   * @return The valid first key combos.
   */
  getFirstKeyCombosFrom(index = 0): MSIMEKeyCombo[] {
    return getFirstKeyCombos(this.goal.substring(index));
  }

  /**
   * Returns the first valid key combo to type the current position of goal text.
   * @return The valid first key combos.
   */
  getNextKeyCombos(): MSIMEKeyCombo[] {
    return this.getFirstKeyCombosFrom(this.resolvedText.length);
  }

  /**
   * Returns the first possible key combo to type the current position of goal text.
   * @return The possible first key combos taking the pending inputs into consideration.
   */
  getNextPossibleKeyCombos(): MSIMEKeyCombo[] {
    return this.getNextKeyCombos().filter((combo) => combo.strokes.startsWith(this.pendingKeystrokes));
  }

  /**
   * Returns a sequence of key combos for entire goal text based on sequence chooser function.
   * @param index - A zero-based index that indicates the position of text to start typing.
   * @param keyComboChooser - A key combo chooser function; uses the instance's default if not specified.
   * @return A sequence of key combos for entire goal text.
   */
  getKeyCombosSequence(index: number, keyComboChooser = this._keyComboChooser): MSIMEKeyCombo[] {
    const resolvers: MSIMEKeyCombo[] = [];
    let rest = this.goal.substring(index);
    while (rest !== "") {
      const firstKeyCombos = getFirstKeyCombos(rest);
      const resolver = keyComboChooser(firstKeyCombos);
      resolvers.push(resolver);
      rest = rest.substring(resolver.chars.length);
    }
    return resolvers;
  }

  /**
   * Returns a sequence of key combo from the current position to the end of goal text based on key combo chooser function.
   * @param keyComboChooser - A key combo chooser function; uses the instance's default if not specified.
   * @return A sequence of key combos from the current position to the end of goal text based on key combo chooser function.
   */
  getRestKeyCombosSequence(keyComboChooser = this._keyComboChooser): MSIMEKeyCombo[] {
    return this.getKeyCombosSequence(this.resolvedText.length, keyComboChooser);
  }

  /**
   * Supply keystrokes as an answer.
   * If the given keystrokes is invalid as an answer to the goal text, throws a RangeError.
   * @param keystrokes - Keystrokes to supply.
   * @return Parsing result of the given keystrokes.
   */
  supplyKeystrokes(keystrokes: string): ParsedKeystrokes {
    // Check for both resolved part and pending part
    const resolvedKeystrokes = parseKeystrokes(this.pendingKeystrokes + keystrokes);
    if (!this._acceptsResolvedKeystrokes(resolvedKeystrokes)) {
      throw new RangeError(`unacceptable input: ${keystrokes}`);
    }
    super._supplyResolvedKeystrokes(resolvedKeystrokes);
    return resolvedKeystrokes;
  }

  /**
   * Returns a boolean that indicates whether the given keystrokes are acceptable.
   * @param keystrokes - Keystrokes to test if acceptable.
   * @return True if acceptable, and false if not.
   */
  acceptsKeystrokes(keystrokes: string): boolean {
    const resolvedKeystrokes = parseKeystrokes(this.pendingKeystrokes + keystrokes);
    return this._acceptsResolvedKeystrokes(resolvedKeystrokes);
  }

  /**
   * Returns a boolean that indicates whether the given keystrokes are acceptable.
   * @param keystrokes - Keystrokes to test if acceptable.
   * @return True if acceptable, and false if not.
   * @internal
   */
  _acceptsResolvedKeystrokes(keystrokes: ParsedKeystrokes): boolean {
    const textToResolve = keystrokes.resolved.map((e: MSIMEKeyCombo) => e.chars).join("");
    return (
      this.getRestText().startsWith(textToResolve) &&
      (!keystrokes.pending ||
        this.getFirstKeyCombosFrom(this.resolvedText.length + textToResolve.length).some((e) =>
          e.strokes.startsWith(keystrokes.pending)
        ))
    );
  }

  /**
   * Returns whether the supplied key inputs are interpreted to be the goal text.
   * @return  True if solved, and false if not.
   */
  isSolved(): boolean {
    return this.text === this.goal;
  }
}
