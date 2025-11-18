import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comms } from '../../services/comms';
import { debounced } from '../../utils/debounced';

@Component({
  selector: 'app-design-page',
  imports: [FormsModule],
  templateUrl: './design-page.html',
  styleUrl: './design-page.css',
})
export class DesignPage {
  private comms = inject(Comms);

  wordInput = signal('');
  word = debounced(this.wordInput);
  guessLimit = signal('6');
  allowNonsense = signal(false);

  share = () => {
    const guessLimit = parseInt(this.guessLimit());
    if (!guessLimit) {
      throw 'NaN';
    }

    this.comms.shareChallenge({
      word: this.word(),
      guessLimit,
      allowNonsense: this.allowNonsense(),
    });
  };
}
