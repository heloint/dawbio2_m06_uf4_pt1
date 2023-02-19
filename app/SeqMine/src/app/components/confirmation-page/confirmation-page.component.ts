import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.css'],
})
export class ConfirmationPageComponent {
  id!: number | null;
  confirmDialog!: string | null;
  method!: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private database: DatabaseService,
    private location: Location
  ) {}

  executeMethod() {
    if (this.id !== 0 && this.confirmDialog !== '' && this.method !== '') {
      switch (this.method) {
        case 'userDelete':
          if (this.id !== null && this.id !== undefined) {
            const username: string | null =
              this.activatedRoute.snapshot.paramMap.get('username');
            this.database.deleteUserByID(this.id).subscribe((result) => {
              this.route.navigate([
                '/user-table',
                { status: result.result, username: username },
              ]);
            });
          }
          this.location.back();
          break;
        case 'fileDelete':
          if (this.id !== null && this.id !== undefined) {
            const filename: string | null =
              this.activatedRoute.snapshot.paramMap.get('name');
            this.database.deleteFileByID(this.id).subscribe((result) => {
              this.route.navigate([
                '/file-storage-table',
                { status: result.result, name: filename },
              ]);
            });
          }
          this.location.back();
      }
    }
  }

  returnToPage() {
    this.location.back();
  }

  ngOnInit() {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.confirmDialog =
      this.activatedRoute.snapshot.paramMap.get('confirmDialog');
    this.method = this.activatedRoute.snapshot.paramMap.get('method');
  }
}
