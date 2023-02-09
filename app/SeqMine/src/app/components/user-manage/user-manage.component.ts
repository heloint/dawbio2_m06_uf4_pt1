import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { User } from '../../models/user.model';
import { DatabaseService, DBUser, DBRole } from '../../services/database.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent {

    isAddUserMode: Boolean = true;
    roles: any = [];
    constructor(
        private route: ActivatedRoute,
        private database: DatabaseService,

    ){}

    // Initialize login FormGroup + FormControl.
    userManageForm: FormGroup = new FormGroup({
      id: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      role: new FormControl('investigator', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
    });

    /* Receives an ID as an argument,
     * then requests the corresponding user to that ID from the server.
     * @param inputID number
     * */
    fetchUserByID(inputID: number) {
      this.database.getUserByID(inputID).subscribe(
        result => {

          if (Object.keys(result).length > 0) {
            const foundUser: DBUser = result.result[0];

            this.userManageForm.controls['id'].setValue(foundUser.user_id);
            this.userManageForm.controls['username'].setValue(foundUser.username);
            this.userManageForm.controls['role'].setValue(foundUser.role_name);
            this.userManageForm.controls['password'].setValue(foundUser.password);
            this.userManageForm.controls['email'].setValue(foundUser.email);
            this.userManageForm.controls['firstName'].setValue(foundUser.first_name);
            this.userManageForm.controls['lastName'].setValue(foundUser.last_name);
          }
        }
      );
    }

    fetchRoles() {
      return this.database.getAllRoles().subscribe(result => {
        result.result.forEach((role) => {
          this.roles.push(role)
        });
      });
    }

    fetchLastUserID() {
      return this.database.getLastUserID().subscribe(result => {
        this.userManageForm.controls['id'].setValue(result.result+1);
      });
    }

    ngOnInit() {
      this.fetchRoles();

      const userID = Number(this.route.snapshot.paramMap.get('userID'));

      if (userID) {
        this.isAddUserMode = false;
        this.fetchUserByID(userID);
      } else {
        this.fetchLastUserID();
      }
    }
}
