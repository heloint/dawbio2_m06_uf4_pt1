import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import {
  DatabaseService,
  DBUser,
  DBRole,
} from '../../services/database.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userID: number | null = null;
  modificationResult: Boolean | null = null;
  registrationResult: Boolean | null = null;
  errorMessage: string = 'Failed to create user! ';
  internalErrorMsg: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService
  ) {}

  // Initialize login FormGroup + FormControl.
  userRegistrationForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^[a-zA-Záéíóúñ0-9]+$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^[a-zA-Z0-9+$.!]+$'),
    ]),
    passwordConfirmation: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$'),
    ]),
  });

  /* Receives an ID as an argument,
   * then requests the corresponding user to that ID from the server.
   * @param inputID number
   * */
  fetchUserByID(inputID: number) {
    return this.database.getUserByID(inputID).subscribe((result) => {
      if (Object.keys(result).length > 0) {
        const foundUser: DBUser = result.result[0];
        this.userRegistrationForm.controls['id'].setValue(foundUser.user_id);
        this.userRegistrationForm.controls['username'].setValue(
          foundUser.username
        );
        this.userRegistrationForm.controls['role'].setValue(
          foundUser.role_name
        );
        this.userRegistrationForm.controls['password'].setValue(
          foundUser.password
        );
        this.userRegistrationForm.controls['email'].setValue(foundUser.email);
        this.userRegistrationForm.controls['firstName'].setValue(
          foundUser.first_name
        );
        this.userRegistrationForm.controls['lastName'].setValue(
          foundUser.last_name
        );
      }
    });
  }

  /**
   * Fetches the last user ID from the database and sets it as the next user ID.
   * @return {void}
   */
  fetchLastUserID() {
    return this.database.getLastUserID().subscribe((result) => {
      this.userRegistrationForm.controls['id'].setValue(result.result + 1);
    });
  }

  /**
   * Updates a user in the database.
   * @return {void}
   */
  doModifyUser() {
    return this.database
      .updateUser({
        user_id: this.userRegistrationForm.get('id')?.value,
        username: this.userRegistrationForm.get('username')?.value,
        role_name: this.userRegistrationForm.get('role')?.value,
        password: this.userRegistrationForm.get('password')?.value,
        email: this.userRegistrationForm.get('email')?.value,
        first_name: this.userRegistrationForm.get('firstName')?.value,
        last_name: this.userRegistrationForm.get('lastName')?.value,
        registration_date: new Date(),
      })
      .subscribe({
        next: (result) => {
          this.modificationResult = result.result;
        },
        error: (error) => {
          this.modificationResult = false;
        },
      });
  }

  /**
   * Registers a user in the database.
   * @return {void}
   */
  doRegisterUser() {
    return this.database
      .registerUser({
        user_id: 0,
        username: this.userRegistrationForm.get('username')?.value,
        role_name: 'investigator',
        password: this.userRegistrationForm.get('password')?.value,
        email: this.userRegistrationForm.get('email')?.value,
        first_name: this.userRegistrationForm.get('firstName')?.value,
        last_name: this.userRegistrationForm.get('lastName')?.value,
        registration_date: new Date(),
      })
      .subscribe({
        next: (result) => {
          this.registrationResult = result.result;
        },
        error: (error) => {

            if (error.status !== 403) {
                this.internalErrorMsg = 'An internal error has occured.';
            } else {
              this.registrationResult = false;
              this.errorMessage = error.error.errorMsg;
            }
        },
      });
  }

  ngOnInit() {}
}
