import { Component, computed, input } from '@angular/core';
import { Color } from '../../../../schema/schema';

interface TileState {
  letter: string;
  color?: Color;
  filled: boolean;
}

const isColor = (value: string | undefined): value is Color =>
  value === 'b' || value === 'y' || value === 'g';

@Component({
  selector: 'app-guess-slot',
  imports: [],
  templateUrl: './guess-slot.html',
  styleUrl: './guess-slot.css',
})
export class GuessSlot {
  guess = input.required<[string, string] | string | undefined>();
  length = input.required<number>();

  tiles = computed<TileState[]>(() => {
    const guess = this.guess();
    const length = this.length();

    const empty = Array.from({ length }, () => ({ letter: '', color: undefined, filled: false }));
    if (!guess) return empty;

    const [word, colorPattern] = Array.isArray(guess) ? guess : [guess, undefined];
    const letters = (word ?? '').toUpperCase().split('').slice(0, length);
    const colors = (colorPattern ?? '').split('').slice(0, length);

    return Array.from({ length }, (_, idx) => {
      const letter = letters[idx] ?? '';
      const color = isColor(colors[idx]) ? colors[idx] : undefined;
      const filled = letter.trim().length > 0;
      return { letter, color, filled };
    });
  });
}
