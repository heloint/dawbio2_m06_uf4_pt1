import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent {

    #userID!: number;

    constructor(
        private route: ActivatedRoute,

    ){}

    ngOnInit() {
        this.#userID = Number(this.route.snapshot.paramMap.get('userID'));
        console.log(this.#userID);
    }
}
