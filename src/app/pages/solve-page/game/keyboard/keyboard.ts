import { Component } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  imports: [],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.css',
})
export class Keyboard {
  // prettier-ignore
  protected readonly letters = 'qwertyuiopasdfghjklzxcvbnm'.split('');
}
