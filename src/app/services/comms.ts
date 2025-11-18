import { Injectable } from '@angular/core';
import { Challenge, challengeSchema } from '../schema/schema';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Comms {
  shareChallenge(challenge: Challenge) {
    if (!challenge.allowNonsense) delete challenge.allowNonsense;

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
}
