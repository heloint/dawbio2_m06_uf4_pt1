import { Component } from '@angular/core';
import { SessionHandlingService, SessionData } from '../../services/session-handling.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private sessionService: SessionHandlingService
  ){}

  /*
   * Check if the user logged in.
   * @return Boolean
   * */
  get isLoggedIn(): Boolean {
    return this.sessionService.isLoggedIn;
  }

 get userData(): SessionData {
    return this.sessionService.userData;
 }
  // Logs out the user and destroys the session tokens.
  public logout() {
    this.sessionService.doLogOut();
  }

}
