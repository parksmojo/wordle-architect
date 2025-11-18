import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { Challenge } from '../../../schema/schema';
import { Keyboard } from './keyboard/keyboard';
import { GuessSlot } from './guess-slot/guess-slot';

@Component({
  selector: 'app-game',
  imports: [Keyboard, GuessSlot],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  challenge = input.required<Challenge>();
  guesses = linkedSignal<string[]>(() =>
    Array.from({ length: this.challenge().guessLimit ?? 6 }, () => ''),
  );
  letters = signal<Record<string, string>>({});
}
