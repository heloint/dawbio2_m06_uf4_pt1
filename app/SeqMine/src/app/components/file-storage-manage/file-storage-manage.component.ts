import { Component } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { DatabaseService } from '../../services/database.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

export type ProgressEntity = {
  value: number;
  fileName: string;
}

@Component({
  selector: 'app-file-storage-manage',
  templateUrl: './file-storage-manage.component.html',
  styleUrls: ['./file-storage-manage.component.css']
})
export class FileStorageManageComponent {

    fileName = '';
    filesToUpload: Array<File> = [];
    progressInfos: Array<ProgressEntity> = [];

    constructor(

      private database: DatabaseService,
      private http: HttpClient
    ) {}

    // Initialize login FormGroup + FormControl.
    fastaUploadForm: FormGroup = new FormGroup({
    });

    onFileSelected(event: any): void {

        this.filesToUpload = event.target.files;

    }


  /* Iterates over the selected files and
  ** calls the "upload" method to upload the files and observe the progress of it.
   * @return void
   * */
  uploadFastaFiles(): void{
    if (this.filesToUpload) {
      for (let i = 0; i < this.filesToUpload.length; i++) {
        this.upload(i, this.filesToUpload[i]);
      }
    }
  }

  /* Uploads the fasta file and observes the progress of it.
   * @return void
   * */
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.database.uploadFasta(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
        }
      );
    }
  }
}
