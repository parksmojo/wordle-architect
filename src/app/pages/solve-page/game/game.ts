import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { Challenge, Color } from '../../../schema/schema';
import { Keyboard } from './keyboard/keyboard';
import { GuessSlot } from './guess-slot/guess-slot';

@Component({
  selector: 'app-game',
  imports: [Keyboard, GuessSlot],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  challenge = input.required<Challenge>();
  guesses = linkedSignal<undefined[]>(() => Array(this.challenge().guessLimit ?? 6));
  guessNum = signal(0);
  currentGuess = signal<string[]>([]);
  letters = signal<Record<string, Color>>({});

  addLetter(letter: string) {
    letter = letter[0];

    if (this.currentGuess().length < this.challenge().word.length) {
      this.currentGuess.update((curr) => [...curr, letter]);
    }
  }
}
