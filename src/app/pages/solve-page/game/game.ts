import {
  Component,
  HostListener,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Challenge, Color } from '../../../schema/schema';
import { Keyboard } from './keyboard/keyboard';
import { GuessSlot } from './guess-slot/guess-slot';
import { Comms } from '../../../services/comms';

@Component({
  selector: 'app-game',
  imports: [Keyboard, GuessSlot],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  private comms = inject(Comms);

  challenge = input.required<Challenge>();
  guesses = linkedSignal<([string, string] | string | undefined)[]>(() =>
    Array(this.challenge().guessLimit ?? 6),
  );
  guessNum = signal(0);
  currentGuess = signal<string[]>([]);
  letters = signal<Record<string, Color>>({});

  won = signal<boolean | null>(null);

  addLetter(letter: string) {
    if (this.won() !== null) {
      return;
    }
    letter = letter[0];

    if (this.currentGuess().length < this.challenge().word.length) {
      this.currentGuess.update((curr) => [...curr, letter]);
    }
  }

  deleteLetter() {
    if (this.won() !== null) {
      return;
    }
    this.currentGuess.update((curr) => {
      curr.pop();
      return [...curr];
    });
  }

  submitGuess() {
    if (this.won() !== null) {
      return;
    }

    if (this.currentGuess().length < this.challenge().word.length) {
      return;
    }

    const colors = this.compare(this.challenge().word, this.currentGuess());

    this.guesses.update((prev) => {
      prev[this.guessNum()] = [this.currentGuess().join(''), colors.join('')];
      return [...prev];
    });

    const letters = this.letters();
    for (const [i, color] of colors.entries()) {
      const letter = this.currentGuess()[i];
      if (!letters[letter] || color === 'g' || (letters[letter] === 'b' && color === 'y')) {
        letters[letter] = color;
      }
    }
    this.letters.set(letters);

    this.currentGuess.set([]);
    this.guessNum.update((prev) => prev + 1);

    if (colors.every((color) => color === 'g')) {
      this.won.set(true);
    } else if (this.guessNum() >= this.challenge().guessLimit) {
      this.won.set(false);
    }
  }

  compare(answer: string, guess: string[]) {
    const availableLetters = new Map<string, number>();
    for (const letter of answer) {
      availableLetters.set(letter, (availableLetters.get(letter) ?? 0) + 1);
    }
    const colors: Color[] = guess.map((letter, i) => {
      if (letter === answer[i]) {
        availableLetters.set(letter, (availableLetters.get(letter) ?? 1) - 1);
        return 'g';
      } else {
        return 'b';
      }
    });
    for (const [i, letter] of guess.entries()) {
      if (availableLetters.get(letter) && colors[i] !== 'g') {
        availableLetters.set(letter, (availableLetters.get(letter) ?? 1) - 1);
        colors[i] = 'y';
      }
    }
    return colors;
  }

  share() {
    const guessResults = this.guesses()
      .filter((val) => Array.isArray(val))
      .map(([_, colors]) => colors);
    this.comms.shareResult(!!this.won(), guessResults);
  }
}
