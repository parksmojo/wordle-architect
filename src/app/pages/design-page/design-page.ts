import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comms } from '../../services/comms';

@Component({
  selector: 'app-design-page',
  imports: [FormsModule],
  templateUrl: './design-page.html',
  styleUrl: './design-page.css',
})
export class DesignPage {
  private comms = inject(Comms);

  wordInput = signal('');
  guessLimit = signal('6');
  allowNonsense = signal(false);

  wordPreview = computed(() => this.wordInput().toUpperCase());
  wordPreviewLength = computed(() => {
    const value = this.wordInput().trim().length;
    return value > 0 ? value : 5;
  });
  wordLength = computed(() => this.wordInput().trim().length);
  shareDisabled = computed(() => this.wordInput().trim().length === 0);

  get wordInputModel() {
    return this.wordInput();
  }

  set wordInputModel(value: string) {
    this.wordInput.set(value.replace(/[^a-zA-Z]/g, '').toUpperCase());
  }

  get guessLimitModel() {
    return this.guessLimit();
  }

  set guessLimitModel(value: string | number | null) {
    this.guessLimit.set(value == null ? '' : String(value));
  }

  get allowNonsenseModel() {
    return this.allowNonsense();
  }

  set allowNonsenseModel(value: boolean) {
    this.allowNonsense.set(value);
  }

  share = () => {
    const guessLimit = parseInt(this.guessLimit());
    if (!guessLimit) {
      throw 'NaN';
    }

    const secretWord = this.wordInput();
    if (!secretWord) return;

    this.comms.shareChallenge({
      word: secretWord,
      guessLimit,
      allowNonsense: this.allowNonsense(),
    });
  };
}
