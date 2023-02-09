import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

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
    private database: DatabaseService
  ) { }


  allUsers(): any {
    return this.database.getAllUsers().subscribe(
      users => {
        users.result.forEach((user) => {
            this.allUsersArr.push(new User(
                user.user_id,
                user.username,
                user.role,
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
    this.route.navigate(['/user-manage', {userID: inputUserID}]);
  }

  ngOnInit() {
    this.allUsers();
  }


}
