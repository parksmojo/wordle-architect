import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-guess-slot',
  imports: [],
  templateUrl: './guess-slot.html',
  styleUrl: './guess-slot.css',
})
export class GuessSlot {
  guess = input.required<string>();
  length = input.required<number>();

  display = computed(() =>
    Array.from({ length: this.length() }, (_, i) => `[${this.guess()[i] ?? ' '}]`).join(''),
  );
}
