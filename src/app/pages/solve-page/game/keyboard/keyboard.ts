import { Component, input, output } from '@angular/core';
import { Color, colorToHex } from '../../../../schema/schema';

type KeyKind = 'letter' | 'enter' | 'delete';
type KeySize = 'normal' | 'wide';

interface KeyConfig {
  id: string;
  label: string;
  kind: KeyKind;
  size?: KeySize;
}

interface KeyboardRow {
  keys: KeyConfig[];
  offset?: boolean;
}

@Component({
  selector: 'app-keyboard',
  imports: [],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.css',
})
export class Keyboard {
  protected readonly rows = KEYBOARD_ROWS;
  states = input.required<Record<string, Color>>();
  keypress = output<string>();
  submit = output();
  delete = output();

  protected backgroundFor(key: KeyConfig) {
    if (key.kind !== 'letter') {
      return colorToHex(undefined);
    }

    const state = this.states()[key.id];
    return colorToHex(state);
  }

  handleKeypress(keyId: string) {
    if (keyId === 'enter') {
      this.submit.emit();
    } else if (keyId === 'delete') {
      this.delete.emit();
    } else {
      this.keypress.emit(keyId);
    }
  }
}

const letterRow = (letters: string): KeyConfig[] =>
  letters.split('').map((letter) => ({
    id: letter,
    label: letter,
    kind: 'letter',
  }));

const actionKey = (id: string, label: string): KeyConfig => ({
  id,
  label,
  kind: id === 'enter' ? 'enter' : 'delete',
  size: 'wide',
});

const KEYBOARD_ROWS: KeyboardRow[] = [
  { keys: letterRow('qwertyuiop') },
  { keys: letterRow('asdfghjkl'), offset: true },
  {
    keys: [actionKey('enter', 'ENTER'), ...letterRow('zxcvbnm'), actionKey('delete', 'DEL')],
  },
];
