import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comms } from '../../services/comms';
import { SiteHeader } from '../../components/site-header/site-header';

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
    this.wordInput.set(sanitized);
  }

  get guessLimitModel() {
    return this.guessLimit();
  }

  set guessLimitModel(value: string | number | null) {
    if (value == null || value === '') {
      this.guessLimit.set('');
      return;
    }

    const parsed = typeof value === 'number' ? value : parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      this.guessLimit.set('');
      return;
    }

    const clamped = Math.max(this.MIN_GUESS_LIMIT, Math.min(this.MAX_GUESS_LIMIT, parsed));
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
    const secretWord = this.wordInput().trim();

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
