import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Challenge } from '../../model/models';

@Component({
  selector: 'app-design-page',
  imports: [FormsModule],
  templateUrl: './design-page.html',
  styleUrl: './design-page.css',
})
export class DesignPage {
  word = signal('');

  share() {
    const challenge: Challenge = {
      word: this.word(),
    };

    const challengeStr = JSON.stringify(challenge);
    const encodedChallenge = encodeURIComponent(btoa(challengeStr));
    const url = `${window.location.origin}/solve/${encodedChallenge}`;
    console.log('Generated url:', url);

    if (!navigator.share) {
      console.log('Copying the text');
      navigator.clipboard.writeText(url);
    } else {
      console.log('Sharing the text');
      navigator.share({ url });
    }
  }
}
