import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { User } from '../../models/user.model';
import { DatabaseService, DBUserArr } from '../../services/database.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent {
  cp: number = 1;
  rowNumberLimit: number = 10;
  allUsersArr: Array<User> = [];
  usersToDisplay: Array<User> = this.allUsersArr.map((e) => e);
  recentlyDeletedUser: string | null = null;
  userDeletionStatus: Boolean | null = null;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private database: DatabaseService
  ) {}

  // Initialize the mini-form for the search bar.
  searchBarForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('', []),
  });

  /* Filters down the array of User objects by the search term.
   * Returns the object if any of it's values contains the term as a substring.
   * @param {string} term
   * @return {void}
   * */
  searchByTerm(term: string) {
    this.usersToDisplay = this.allUsersArr.map((e) => e);
    const searchResults: Array<User> = this.usersToDisplay.filter((user) => {
      const userValues: Array<string> = [
        user.id.toString(),
        user.username,
        user.role,
        user.password,
        user.email,
        user.firstName,
        user.lastName,
        user.registrationDate.toString(),
      ];

      for (let val of userValues) {
        if (val.includes(term)) {
          return true;
        }
      }

      return false;
    });
    this.usersToDisplay = searchResults;
  }

  /**
   * Subscribes to the result of the getAllUsers function from the database service.
   * Then, for each user returned, a new User instance is created and pushed into allUsersArr array.
   * @returns {any} - A subscription to the getAllUsers result.
   */
  fetchAllUsers(): any {
    return this.database.getAllUsers().subscribe(
      (result: DBUserArr) => {
        result.result.forEach((user) => {
          this.allUsersArr.push(
            new User(
              user.user_id,
              user.username,
              user.role_name,
              user.password,
              user.email,
              user.first_name,
              user.last_name,
              new Date(user.registration_date)
            )
          );

          this.usersToDisplay = this.allUsersArr.map((e) => e);
        });
      },
      (error) => {
        console.log('do not have permission');
      }
    );
  }

  /**
   * Navigates to the /user-modify route, passing in the inputUserID as a parameter.
   * @param {number} inputUserID - The user ID to be passed as a parameter to the /user-modify route.
   * @returns {void}
   */
  goToUserManage(inputUserID: number) {
    this.route.navigate(['/user-modify', { userID: inputUserID }]);
  }

  /**
   * Navigates to the /confirm-page route, passing in the following parameters:
   *     id: the id of the user to be deleted.
   *     confirmDialog: a string containing a confirmation message to be displayed.
   *     method: the method to be executed after confirming, in this case "userDelete".
   *     username: the username of the user to be deleted.
   *
   * @param {number} id - The id of the user to be deleted.
   * @param {string} username - The username of the user to be deleted.
   * @returns {void}
   */
  requireConfirmation(id: number, username: string) {
    const dialog: string = `Are you sure you want to delete "${username}" user?`;

    this.route.navigate([
      '/confirm-page',
      {
        id: id,
        confirmDialog: dialog,
        method: 'userDelete',
        username: username,
      },
    ]);
  }

  /**
   * Gets the status of the recent user deletion from the URL parameters.
   * If the status is not null, sets the userDeletionStatus to the status and the recentlyDeletedUser to the username of the deleted user.
   * @returns {Boolean|null} - The status of the recent user deletion or null if not set.
   * */
  getUserDeletionStatus(): Boolean | null {
    const status: string | null =
      this.activatedRoute.snapshot.paramMap.get('status');

    if (status !== null) {
      this.userDeletionStatus =
        this.activatedRoute.snapshot.paramMap.get('status') === 'true';
      this.recentlyDeletedUser =
        this.activatedRoute.snapshot.paramMap.get('username');
    }

    return this.userDeletionStatus;
  }

  /**
   * Calls the fetchAllUsers method.
   * @returns {void}
   * */
  ngOnInit() {
    this.fetchAllUsers();
  }
}
