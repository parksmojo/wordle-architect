import { Injectable, signal } from '@angular/core';
import { Challenge, challengeSchema, Color } from '../schema/schema';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Comms {
  private share(text: string) {
    if (!navigator.share) {
      console.log('Copying the text');
      navigator.clipboard.writeText(text);
    } else {
      console.log('Sharing the text');
      navigator.share({ text });
    }
  }

  shareChallenge(challenge: Challenge) {
    if (!challenge.allowNonsense) delete challenge.allowNonsense;

    const challengeStr = JSON.stringify(challenge);
    const encodedChallenge = encodeURIComponent(btoa(challengeStr));
    const url = `${window.location.origin}/solve/${encodedChallenge}`;
    console.log('Generated url:', url);
    const msg = 'Try this Wordle Challenge I made!\n' + url;
    this.share(msg);
  }

  parseChallenge(route: ActivatedRoute): Challenge | null {
    try {
      const encoded = route.snapshot.paramMap.get('encoded');
      if (!encoded) return null;

      const str = atob(decodeURIComponent(encoded));
      return challengeSchema.parse(JSON.parse(str));
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  shareResult(won: boolean, result: string[]) {
    const msg = [];
    if (!won) {
      msg.push('You got me...');
    } else if (result.length <= 2) {
      msg.push('Too easy!');
    } else {
      msg.push('I got it!');
    }
    msg.push('\n');

    const map = { g: '🟩', y: '🟨', b: '⬛' };
    for (const row of result) {
      for (const letter of row) {
        msg.push(map[letter as Color]);
      }
      msg.push('\n');
    }

    this.share(msg.join(''));
  }

  validationIsLoading = signal(false);
  async validateWord(word: string) {
    this.validationIsLoading.set(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return res.status === 200;
    } catch (err) {
      console.error(err);
      return true;
    } finally {
      this.validationIsLoading.set(false);
    }
  }
}
