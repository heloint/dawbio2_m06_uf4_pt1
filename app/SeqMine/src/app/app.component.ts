import { Component, OnInit } from '@angular/core';
import { SessionHandlingService } from './services/session-handling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SeqMine';

  constructor(
    private sessionService: SessionHandlingService
  ){}

  ngOnInit() {
    this.sessionService.validateSession();
  }

}
