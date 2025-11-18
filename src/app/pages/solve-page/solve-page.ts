import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Challenge, challengeSchema } from '../../model/models';

@Component({
  selector: 'app-solve-page',
  imports: [],
  templateUrl: './solve-page.html',
  styleUrl: './solve-page.css',
})
export class SolvePage {
  challenge: Challenge | null;

  constructor(private route: ActivatedRoute) {
    const encoded = this.route.snapshot.paramMap.get('encoded');
    if (!encoded) {
      this.challenge = null;
      return;
    }
    const str = atob(decodeURIComponent(encoded));
    try {
      this.challenge = challengeSchema.parse(JSON.parse(str));
    } catch (error) {
      console.error(error);
      this.challenge = null;
      return;
    }
  }
}
