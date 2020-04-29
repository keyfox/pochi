# pochi

The MS-IME Japanese Input emulation library for JavaScript.

## Examples

### Keystrokes → text conversion
```ecma script level 4
import { getNextKeysequencesList } from "@keyfox/pochi";

// Which keys should I type to make the text "にっか"?
console.log(getNextKeysequencesList("にっか"));
// [
//   ComposedKeysequence(1) [
//     Keysequence { chars: 'に', strokes: 'ni', attrs: 8 }
//   ]
// ]
// // the return value above indicates there is one solution
// // which is to type "ni" to resolve "に".

// After hitting the key "n" and "i", which key should I type next?
console.log(getNextKeysequencesList("っにか"));
// [
//   ComposedKeysequence(1) [
//     Keysequence { chars: 'っ', strokes: 'ltu', attrs: 8 }
//   ],
//   ComposedKeysequence(1) [
//     Keysequence { chars: 'っ', strokes: 'xtu', attrs: 8 }
//   ],
//   ComposedKeysequence(1) [
//     Keysequence { chars: 'っ', strokes: 'ltsu', attrs: 8 }
//   ],
//   ComposedKeysequence(2) [
//     Keysequence { chars: 'っ', strokes: 'k', attrs: 2 },
//     Keysequence { chars: 'か', strokes: 'ka', attrs: 8 }
//   ],
//   ComposedKeysequence(2) [
//     Keysequence { chars: 'っ', strokes: 'c', attrs: 2 },
//     Keysequence { chars: 'か', strokes: 'ca', attrs: 8 }
//   ]
// ]
// TL;DR: You have 5 options. Type "ltu", "xtu" or "ltsu" to resolve "っ",
//        or type "kka" or "cca" to resolve "っか".
```


### Typing state machine
```ecma script level 4
import { TypingStateMachine } from "@keyfox/pochi";
const stateMachine = new TypingStateMachine();

// Supply one keystroke
stateMachine.supplyKeystroke("a");
console.log(stateMachine.text); // "あ"

// MS-IME input keystrokes are available
stateMachine.supplyKeystroke("yi"); // "yi" resolves into "い"
console.log(stateMachine.text);     // "あい"

// Supply several keystrokes
stateMachine.supplyKeystroke("shite");
console.log(stateMachine.text); // "あいして"

// Supply an indeterministic keystroke
stateMachine.supplyKeystroke("r");
console.log(stateMachine.text);             // "あいしてr"
console.log(stateMachine.resolvedText);     // "r"
console.log(stateMachine.pendingKeystroke); // "あいして"

// Keystrokes can be tracked anytime
stateMachine.supplyKeystroke("u");
console.log(stateMachine.text); // "あいしてる"
console.log(stateMachine.resolvers);
// [ { chars: "あ", strokes: "a" },
//   { chars: "い", strokes: "yi" },
//   { chars: "し", strokes: "shi" },
//   { chars: "て", strokes: "te" },
//   { chars: "る", strokes: "ru" } ]
```

