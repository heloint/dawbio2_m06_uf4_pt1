import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent {

  allUsersArr!: any;
  constructor(
    private database: DatabaseService
  ) { }

  allUsers(): any {
    return this.database.getAllUsers().subscribe(
      users => {
        console.log(users);
        this.allUsersArr = users;
      });
  }

  ngOnInit() {
    this.allUsers();
  }


}
