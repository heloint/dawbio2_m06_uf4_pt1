import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.css']
})
export class ConfirmationPageComponent {
    id!: number | null;
    confirmDialog!: string | null;
    method!: string | null;

    constructor(
      private route: ActivatedRoute,
      private database: DatabaseService,
      private location: Location
    ) {

    }

    executeMethod() {
      if (this.id !== 0 &&
          this.confirmDialog !== '' &&
          this.method !== '')
      {
          switch(this.method) {
              case 'userDelete':
                  if (this.id !== null &&
                      this.id !== undefined) {
                        const username: string | null = this.route.snapshot.paramMap.get('username');
                        this.database.deleteUserByID(this.id).subscribe(result => {
                        sessionStorage['userDeletionStatus'] = JSON.stringify({status: result.result, username: username});
                    });
                  }
                  this.location.back();
                  break;
          }
      }
    }

    returnToPage() {
        this.location.back();
    }

    ngOnInit() {
      this.id = Number(this.route.snapshot.paramMap.get('id'));
      this.confirmDialog = this.route.snapshot.paramMap.get('confirmDialog');
      this.method = this.route.snapshot.paramMap.get('method');

    }
}
