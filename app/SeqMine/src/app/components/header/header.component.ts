import { Component } from '@angular/core';
import { SessionHandlingService } from '../../services/session-handling.service';

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

  // Logs out the user and destroys the cookies of the site.
  public logout() {
    this.sessionService.doLogOut();
  }

}
