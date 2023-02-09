import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { User } from '../../models/user.model';
import { DatabaseService, DBUser } from '../../services/database.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent {

    #userID!: number;
    queriedUser!: User;
    isAddUserMode: Boolean = false;

    constructor(
        private route: ActivatedRoute,
        private database: DatabaseService,

    ){}

    // Initialize login FormGroup + FormControl.
    userManageForm: FormGroup = new FormGroup({
      id: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
    });

    ngOnInit() {
      this.#userID = Number(this.route.snapshot.paramMap.get('userID'));
      if (this.#userID) {
        this.isAddUserMode = true;
        this.database.getUserByID(this.#userID).subscribe(
          result => {

            if (Object.keys(result).length > 0) {
              const foundUser: DBUser = result.result[0];

              this.userManageForm.controls['id'].setValue(foundUser.user_id);
              this.userManageForm.controls['username'].setValue(foundUser.username);
              this.userManageForm.controls['role'].setValue(foundUser.role);
              this.userManageForm.controls['password'].setValue(foundUser.password);
              this.userManageForm.controls['email'].setValue(foundUser.email);
              this.userManageForm.controls['firstName'].setValue(foundUser.first_name);
              this.userManageForm.controls['lastName'].setValue(foundUser.last_name);
            }
          }
        );
      }
    }
}
