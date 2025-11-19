import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comms } from '../../services/comms';
import { Game } from './game/game';
import { SiteHeader } from '../../components/site-header/site-header';

@Component({
  selector: 'app-solve-page',
  imports: [Game, SiteHeader],
  templateUrl: './solve-page.html',
  styleUrl: './solve-page.css',
})
export class SolvePage {
  private route = inject(ActivatedRoute);
  private comms = inject(Comms);
  challenge = this.comms.parseChallenge(this.route);
}
