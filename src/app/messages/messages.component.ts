import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/message-service.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: any[] = [];
  errorMessage: string = '';

  constructor(
    private messagesService: MessagesService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messagesService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Error loading messages', err);
        this.errorMessage = 'Error loading messages.';
      }
    });
  }

  deleteMessages(): void {
    const username = this.tokenService.getLoggedInUser();
    if (!username) {
      this.errorMessage = 'No logged-in user found.';
      return;
    }
    this.messagesService.deleteMessages(username).subscribe({
      next: () => {
        this.loadMessages();
        alert("Successfully deleted messages.");
      },
      error: (err) => {
        console.error('Error deleting messages', err);
      }
    });
  }
}
