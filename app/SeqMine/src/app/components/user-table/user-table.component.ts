import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent {

  allUsersArr: Array<User> = [];
  recentlyDeletedUser: string | null = null;
  userDeletionStatus: Boolean | null = null;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private database: DatabaseService,
  ) { }

  /**
  * Subscribes to the result of the getAllUsers function from the database service.
  * Then, for each user returned, a new User instance is created and pushed into allUsersArr array.
  * @returns {any} - A subscription to the getAllUsers result.
  */
  fetchAllUsers(): any {
    return this.database.getAllUsers().subscribe(
      users => {
        users.result.forEach((user) => {
            this.allUsersArr.push(new User(
                user.user_id,
                user.username,
                user.role_name,
                user.password,
                user.email,
                user.first_name,
                user.last_name,
                new Date(user.registration_date)
            ));
        });
      });
  }

  /**
   * Navigates to the /user-modify route, passing in the inputUserID as a parameter.
   * @param {number} inputUserID - The user ID to be passed as a parameter to the /user-modify route.
   * @returns {void}
   */
  goToUserManage(inputUserID: number) {
    this.route.navigate(['/user-modify', {userID: inputUserID}]);
  }

  /**
   * Navigates to the /confirm-page route, passing in the following parameters:
   *     id: the id of the user to be deleted.
   *     confirmDialog: a string containing a confirmation message to be displayed.
   *     method: the method to be executed after confirming, in this case "userDelete".
   *     username: the username of the user to be deleted.
   *
   *@param {number} id - The id of the user to be deleted.
   *@param {string} username - The username of the user to be deleted.
   *@returns {void}
    */
  requireConfirmation(id: number, username: string) {
      const dialog: string = `Are you sure you want to delete "${username}" user?`;

    this.route.navigate(['/confirm-page', {id: id, confirmDialog: dialog, method: 'userDelete', username: username}]);
  }

  /**
  * Gets the status of the recent user deletion from the URL parameters.
  * If the status is not null, sets the userDeletionStatus to the status and the recentlyDeletedUser to the username of the deleted user.
  *@returns {Boolean|null} - The status of the recent user deletion or null if not set.
  * */
  getUserDeletionStatus(): Boolean | null {
    const status: string | null = this.activatedRoute.snapshot.paramMap.get('status');

    if (status !== null) {
        this.userDeletionStatus = (this.activatedRoute.snapshot.paramMap.get('status') === 'true');
        this.recentlyDeletedUser = this.activatedRoute.snapshot.paramMap.get('username');
    }

    return this.userDeletionStatus;
  }

  /**
   * Calls the fetchAllUsers method.
   *@returns {void}
   * */
  ngOnInit() {
    this.fetchAllUsers();

  }
}
