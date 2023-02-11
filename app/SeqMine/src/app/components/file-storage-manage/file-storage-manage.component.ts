import { Component } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { DatabaseService } from '../../services/database.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageEntity } from '../../models/storage-entity.model';
import { CookieService } from 'ngx-cookie-service';

export type ProgressEntity = {
  value: number;
  fileName: string;
};

@Component({
  selector: 'app-file-storage-manage',
  templateUrl: './file-storage-manage.component.html',
  styleUrls: ['./file-storage-manage.component.css'],
})
export class FileStorageManageComponent {
  fileName = '';
  filesToUpload: Array<File> = [];
  progressInfos: Array<ProgressEntity> = [];
  uploadSuccess: Boolean | null = null;
  errorMessage: string =
    'Failed to upload files. Contact with our maintanence.';

  constructor(
    private database: DatabaseService,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  // Initialize login FormGroup + FormControl.
  sequenceUploadForm: FormGroup = new FormGroup({
    taxonomyID: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(999999999999),
    ]),
    geneID: new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(200),
    ]),
    files: new FormControl('', [Validators.required]),
  });

  /* Save the selected files from the event. Must use this way,
   * because Angular doesn't manage this scenary correctly.
   * Also, this method check for error in the file extensions,
   * and throws form error if not all the files are okay.
   * @param event any
   * */
  onFileSelected(event: any): void {
    this.filesToUpload = event.target.files;

    // Create an array of file extensions out of the uploaded file names.
    const fileExtensions: (string | undefined)[] = Array.from(
      this.filesToUpload
    ).map((file: File) => file.name.split('.').at(-1));

    const allowedFileExtensions: Array<string> = [
      'fa',
      'fas',
      'fasta',
      'gb',
      'gbk',
      'gbf',
      'gp',
      'gpe',
      'qual',
      'aln',
      'scf',
      'sam',
      'bam',
      'vcf',
      'fq',
      'fastq',
      'sff',
      'ace',
    ];

    // Check if all the file extensions are okay.
    const areValidExtensions: Boolean = fileExtensions.every((ext) => {
      if (ext !== undefined) {
        return allowedFileExtensions.includes(ext);
      }
      return false;
    });

    // Reset form error and re-check the validation.
    this.sequenceUploadForm.controls['files'].setErrors(null);
    if (!areValidExtensions) {
      this.sequenceUploadForm.controls['files'].setErrors({
        invalidFileExtension: true,
      });
    }
  }

  /* Iterates over the selected files and
   ** calls the "upload" method to upload the files and observe the progress of it.
   * @return void
   * */
  uploadSequenceFiles(): void {
    if (this.filesToUpload) {
      for (let i = 0; i < this.filesToUpload.length; i++) {
        this.upload(i, this.filesToUpload[i]);
      }
    }
  }

  /**
   * Upload method to register and upload a file.
   * @param {number} idx - index of the file in the progressInfos array
   * @param {File} file - the file to be uploaded
   * @return {void}
   */
  upload(idx: number, file: File): void {
    // set initial progress value and file name in progressInfos array
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    // create an instance of the StorageEntity
    const storageEntity: StorageEntity = new StorageEntity(
      0,
      file.name,
      file.size,
      '',
      this.sequenceUploadForm.get('geneID')?.value,
      this.sequenceUploadForm.get('taxonomyID')?.value,
      new Date(),
      'admin'
      // Object.keys(this.cookieService.getAll())[0]
    );

    if (file) {
      // subscribe to the registerSequence method from the database service
      this.database.registerSequence(storageEntity).subscribe({
        next: (result) => {
          // subscribe to the uploadSequence method from the database service
          this.database.uploadSequence(file).subscribe(
            (event: any) => {
              // update the progressInfos array with the progress value
              if (event.type === HttpEventType.UploadProgress) {
                this.progressInfos[idx].value = Math.round(
                  (100 * event.loaded) / event.total
                );
              }
              this.uploadSuccess = true;
            },
            (err: any) => {
              this.uploadSuccess = false;
              // set the errorMessage if there's an error
              if (err.error.error !== undefined && err.error.error !== '') {
                this.errorMessage = err.error.error;
              }
              this.progressInfos[idx].value = 0;
            }
          );
        },
        error: (error) => {
          this.uploadSuccess = false;
          // set the errorMessage if there's an error
          if (error.error.error !== undefined && error.error.error !== '') {
            this.errorMessage = error.error.error;
          }
          this.progressInfos[idx].value = 0;
        },
      });
    }
  }
}
