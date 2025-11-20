import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comms } from '../../services/comms';
import { SiteHeader } from '../../components/site-header/site-header';
import { debounced } from '../../utils/debounced';

type ValidationState = 'idle' | 'loading' | 'valid' | 'invalid';

@Component({
  selector: 'app-design-page',
  imports: [FormsModule, SiteHeader],
  templateUrl: './design-page.html',
  styleUrl: './design-page.css',
})
export class DesignPage {
  private comms = inject(Comms);

  private readonly MIN_WORD_LENGTH = 3;
  private readonly MAX_WORD_LENGTH = 9;
  private readonly MIN_GUESS_LIMIT = 2;
  private readonly MAX_GUESS_LIMIT = 20;

  wordInput = signal('');
  guessLimit = signal('6');
  allowNonsense = signal(false);

  wordDebounced = debounced(this.wordInput);

  wordValidationState = signal<ValidationState>('idle');

  private validationRequestId = 0;

  constructor() {
    effect(() => {
      const word = this.wordDebounced().trim();
      const allowNonsense = this.allowNonsense();

      if (allowNonsense) {
        this.validationRequestId++;
        this.wordValidationState.set('valid');
        return;
      }

      if (word.length < this.MIN_WORD_LENGTH) {
        this.validationRequestId++;
        this.wordValidationState.set('idle');
        return;
      }

      const currentRequest = ++this.validationRequestId;
      this.wordValidationState.set('loading');

      this.comms.validateWord(word.toLowerCase()).then((isValid) => {
        if (currentRequest !== this.validationRequestId) {
          return;
        }

        this.wordValidationState.set(isValid ? 'valid' : 'invalid');
      });
    });
  }

  shareDisabled = computed(() => {
    const trimmedWordLength = this.wordInput().trim().length;
    const guessLimit = parseInt(this.guessLimit(), 10);

    if (trimmedWordLength < this.MIN_WORD_LENGTH || trimmedWordLength > this.MAX_WORD_LENGTH) {
      return true;
    }

    if (
      Number.isNaN(guessLimit) ||
      guessLimit < this.MIN_GUESS_LIMIT ||
      guessLimit > this.MAX_GUESS_LIMIT
    ) {
      return true;
    }

    if (!this.allowNonsense() && this.wordValidationState() !== 'valid') {
      return true;
    }

    return false;
  });

  get wordInputModel() {
    return this.wordInput();
  }

  set wordInputModel(value: string) {
    const sanitized = (value ?? '')
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase()
      .slice(0, this.MAX_WORD_LENGTH);

    if (sanitized === this.wordInput()) {
      return;
    }

    this.validationRequestId++;
    this.wordInput.set(sanitized);
    this.wordValidationState.set('idle');
  }

  get guessLimitModel() {
    return this.guessLimit();
  }

  set guessLimitModel(value: string | number | null) {
    if (value == null || value === '') {
      this.guessLimit.set('');
      return;
    }

    const sanitized = String(value).replace(/\D/g, '');
    if (!sanitized) {
      this.guessLimit.set('');
      return;
    }

    const parsed = parseInt(sanitized, 10);
    if (Number.isNaN(parsed)) {
      this.guessLimit.set('');
      return;
    }

    const clamped = Math.min(this.MAX_GUESS_LIMIT, parsed);
    this.guessLimit.set(String(clamped));
  }

  get allowNonsenseModel() {
    return this.allowNonsense();
  }

  set allowNonsenseModel(value: boolean) {
    this.allowNonsense.set(value);
  }

  share = () => {
    const guessLimit = parseInt(this.guessLimit(), 10);
    const secretWord = this.wordInput().trim().toLowerCase();

    if (
      !secretWord ||
      secretWord.length < this.MIN_WORD_LENGTH ||
      secretWord.length > this.MAX_WORD_LENGTH
    ) {
      return;
    }

    if (
      Number.isNaN(guessLimit) ||
      guessLimit < this.MIN_GUESS_LIMIT ||
      guessLimit > this.MAX_GUESS_LIMIT
    ) {
      return;
    }

    if (!this.allowNonsense() && this.wordValidationState() !== 'valid') {
      return;
    }

    this.comms.shareChallenge({
      word: secretWord,
      guessLimit,
      allowNonsense: this.allowNonsense(),
    });
  };

  private placeholderOpts = [
    'crane',
    'ready',
    'audio',
    'crabs',
    'cloud',
    'bears',
    'chimp',
    'abyss',
    'bicep',
    'clerk',
  ];
  protected placeholder =
    this.placeholderOpts[Math.floor(Math.random() * this.placeholderOpts.length)];
}
