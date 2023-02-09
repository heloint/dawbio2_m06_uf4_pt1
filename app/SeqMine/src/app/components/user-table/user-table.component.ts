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
  // allUsersArr!: any;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private database: DatabaseService
  ) { }


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

  goToUserManage(inputUserID: number) {
    this.route.navigate(['/user-modify', {userID: inputUserID}]);
  }

  requireConfirmation(id: number, username: string) {
      const dialog: string = `Are you sure you want to delete "${username}" user?`;

    this.route.navigate(['/confirm-page', {id: id, confirmDialog: dialog, method: 'userDelete'}]);
  }

  ngOnInit() {
    this.fetchAllUsers();
  }


}
