import {
  Component,
  HostListener,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Challenge, Color } from '../../../schema/schema';
import { Keyboard } from './keyboard/keyboard';
import { GuessSlot } from './guess-slot/guess-slot';
import { Comms } from '../../../services/comms';

type GuessValidationState = 'idle' | 'loading' | 'valid' | 'invalid';

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
  guessValidationState = signal<GuessValidationState>('idle');
  invalidGuessAttempted = signal(false);
  autoSubmitPending = signal(false);
  shareCopied = signal(false);

  private validationRequestId = 0;
  private clipboardResetTimeout: number | null = null;

  constructor() {
    effect(() => {
      const challenge = this.challenge();
      const allowNonsense = !!challenge.allowNonsense;
      const targetLength = challenge.word.length;
      const guess = this.currentGuess().join('').toLowerCase();

      if (allowNonsense || guess.length !== targetLength) {
        this.validationRequestId++;
        this.guessValidationState.set('idle');
        return;
      }

      const currentRequestId = ++this.validationRequestId;
      this.guessValidationState.set('loading');

      this.comms.validateWord(guess).then((isValid) => {
        if (currentRequestId !== this.validationRequestId) {
          return;
        }

        this.guessValidationState.set(isValid ? 'valid' : 'invalid');
      });
    });

    effect(() => {
      const state = this.guessValidationState();

      if (state === 'valid') {
        this.invalidGuessAttempted.set(false);

        if (this.autoSubmitPending()) {
          this.autoSubmitPending.set(false);
          this.completeGuessSubmission();
        }
      } else if (state === 'invalid') {
        this.autoSubmitPending.set(false);
      }
    });
  }

  addLetter(letter: string) {
    if (this.won() !== null) {
      return;
    }
    letter = letter[0];

    if (this.currentGuess().length < this.challenge().word.length) {
      this.currentGuess.update((curr) => [...curr, letter]);
      this.invalidGuessAttempted.set(false);
      this.autoSubmitPending.set(false);
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
    this.invalidGuessAttempted.set(false);
    this.autoSubmitPending.set(false);
  }

  submitGuess() {
    if (this.won() !== null) {
      return;
    }

    if (this.currentGuess().length < this.challenge().word.length) {
      return;
    }

    if (!this.challenge().allowNonsense) {
      const validationState = this.guessValidationState();

      if (validationState === 'invalid') {
        this.invalidGuessAttempted.set(true);
        this.autoSubmitPending.set(false);
        return;
      }

      if (validationState !== 'valid') {
        this.invalidGuessAttempted.set(true);
        this.autoSubmitPending.set(true);
        return;
      }
    }

    this.invalidGuessAttempted.set(false);
    this.autoSubmitPending.set(false);
    this.completeGuessSubmission();
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

  share = async () => {
    const guessResults = this.guesses()
      .filter((val) => Array.isArray(val))
      .map(([_, colors]) => colors);

    try {
      const result = await this.comms.shareResult(!!this.won(), guessResults);

      if (result === 'clipboard') {
        this.flashClipboardNotice();
      }
    } catch (error) {
      console.error('Unable to share game result', error);
    }
  };

  private flashClipboardNotice() {
    if (this.clipboardResetTimeout) {
      clearTimeout(this.clipboardResetTimeout);
    }

    this.shareCopied.set(true);
    this.clipboardResetTimeout = window.setTimeout(() => {
      this.shareCopied.set(false);
      this.clipboardResetTimeout = null;
    }, 1000);
  }

  private completeGuessSubmission() {
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
}
