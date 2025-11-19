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
  guesses = linkedSignal<([string, string] | string | undefined)[]>(() =>
    Array(this.challenge().guessLimit ?? 6),
  );
  guessNum = signal(0);
  currentGuess = signal<string[]>([]);
  letters = signal<Record<string, Color>>({});

  addLetter(letter: string) {
    letter = letter[0];

    if (this.currentGuess().length < this.challenge().word.length) {
      this.currentGuess.update((curr) => [...curr, letter]);
    }
  }

  deleteLetter() {
    this.currentGuess.update((curr) => {
      curr.pop();
      return [...curr];
    });
  }

  submitGuess() {
    if (this.currentGuess().length < this.challenge().word.length) {
      return;
    }

    const colors = this.compare(this.challenge().word, this.currentGuess());

    this.guesses.update((prev) => {
      prev[this.guessNum()] = [this.currentGuess().join(''), colors.join('')];
      return [...prev];
    });
    this.guessNum.update((prev) => prev + 1);

    for (const [i, color] of colors.entries()) {
      const letter = this.currentGuess()[i];
      const prev = this.letters()[letter];

      if (!prev || (prev === 'y' && color === 'g')) {
        this.letters.update((obj) => ({
          ...obj,
          [letter]: color,
        }));
      }
    }

    this.currentGuess.set([]);
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
}
