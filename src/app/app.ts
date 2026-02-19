import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatBotComponent } from './Components/chat-bot/chat-bot.component';
// import { GiftList } from './Components/gift-list/gift-list';
// import { FromGift } from './Components/from-gift/from-gift';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatBotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('project');
}
