import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
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
    userID: number | null = null;
    modificationResult: Boolean | null = null;
    creationResult: Boolean | null = null;

    constructor(
        private route: ActivatedRoute,
        private database: DatabaseService,

    ){}

    // Initialize login FormGroup + FormControl.
    userManageForm: FormGroup = new FormGroup({
      id: new FormControl('', [Validators.required]),
      username: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^[a-zA-Záéíóúñ0-9]+$'),
      ]),
      role: new FormControl('investigator', [Validators.required]),
      password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^[a-zA-Z0-9+$.!]+$'),
      ]),
      passwordConfirmation: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
      ]),
      firstName: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$')
      ]),
      lastName: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$')
      ]),
    });

    /* Receives an ID as an argument,
     * then requests the corresponding user to that ID from the server.
     * @param inputID number
     * */
    fetchUserByID(inputID: number) {
      return this.database.getUserByID(inputID).subscribe(
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

    /**
     * fetchRoles fetches all roles from the database and maps them to an array of Role objects.
     *
     * @return {void}
     */
    fetchRoles() {
      return this.database.getAllRoles().subscribe(result => {
        result.result.forEach((role) => {
          this.roles.push(new Role(
            role.role_id,
            role.role_name
          ));
        });
      });
    }

    /**
     * fetchLastUserID fetches the last user ID from the database and sets it as the next user ID.
     *
     * @return {void}
     */
    fetchLastUserID() {
      return this.database.getLastUserID().subscribe(result => {
        this.userManageForm.controls['id'].setValue(result.result+1);
      });
    }

    /**
     * doModifyUser updates a user in the database.
     *
     * @return {void}
     */
    doModifyUser(){
        return this.database.updateUser({
            user_id: this.userManageForm.get('id')?.value,
            username: this.userManageForm.get('username')?.value,
            role_name: this.userManageForm.get('role')?.value,
            password: this.userManageForm.get('password')?.value,
            email: this.userManageForm.get('email')?.value,
            first_name: this.userManageForm.get('firstName')?.value,
            last_name: this.userManageForm.get('lastName')?.value,
            registration_date: new Date()
        }).subscribe({
            next: result => { this.modificationResult = result.result; },
            error: error => { this.modificationResult = false; }
        });
    }

    /**
     * doAddUser adds a user to the database.
     *
     * @return {void}
     */
    doAddUser() {
        return this.database.addUser({
            user_id: this.userManageForm.get('id')?.value,
            username: this.userManageForm.get('username')?.value,
            role_name: this.userManageForm.get('role')?.value,
            password: this.userManageForm.get('password')?.value,
            email: this.userManageForm.get('email')?.value,
            first_name: this.userManageForm.get('firstName')?.value,
            last_name: this.userManageForm.get('lastName')?.value,
            registration_date: new Date()
        }).subscribe({
            next: result => { this.creationResult = result.result; },
            error: error => { this.creationResult = false; }
        });
    }

    /* It fetches the roles, determines whether the user is in "add" or "modify" mode, and fetches the user data if in "modify" mode.
     *
     * @return {void}
     */
    ngOnInit() {
      this.fetchRoles();

      this.userID = Number(this.route.snapshot.paramMap.get('userID'));

      if (this.userID) {
        this.isAddUserMode = false;
        this.fetchUserByID(this.userID);
      } else {
        this.fetchLastUserID();
      }
    }

}
