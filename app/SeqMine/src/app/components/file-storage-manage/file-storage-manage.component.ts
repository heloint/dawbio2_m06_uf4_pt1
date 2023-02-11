import { Component } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { DatabaseService } from '../../services/database.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
    uploadSuccess: Boolean | null = null;
    constructor(

      private database: DatabaseService,
      private http: HttpClient
    ) {}

    // Initialize login FormGroup + FormControl.
    sequenceUploadForm: FormGroup = new FormGroup({
        taxonomyID: new FormControl('', [Validators.required, Validators.min(1), Validators.max(999999999999)]),
        geneID: new FormControl('', [Validators.required, Validators.maxLength(25)]),
        description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
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
      const fileExtensions: (string | undefined)[] =
          Array.from(this.filesToUpload).map((file: File) => file.name.split('.').at(-1));

    const allowedFileExtensions: Array<string> = [
        'fa', 'fas', 'fasta', 'gb',
        'gbk', 'gbf', 'gp', 'gpe',
        'qual', 'aln', 'scf', 'sam',
        'bam', 'vcf', 'fq', 'fastq',
        'sff', 'ace'
    ];

    // Check if all the file extensions are okay.
    const areValidExtensions: Boolean = fileExtensions.every( ext => {
        if (ext !== undefined) {
            return allowedFileExtensions.includes(ext);
        }
        return false;
    });

    // Reset form error and re-check the validation.
    this.sequenceUploadForm.controls['files'].setErrors(null);
    if (!areValidExtensions) {
        this.sequenceUploadForm.controls['files'].setErrors({invalidFileExtension: true});
    }
  }

  /* Iterates over the selected files and
  ** calls the "upload" method to upload the files and observe the progress of it.
   * @return void
   * */
  uploadSequenceFiles(): void{
    if (this.filesToUpload) {
      for (let i = 0; i < this.filesToUpload.length; i++) {
        this.upload(i, this.filesToUpload[i]);
      }
    }
  }

  /* Uploads the sequence file and observes the progress of it.
   * @return void
   * */
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.database.uploadSequence(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          }
          this.uploadSuccess = true;
        },
        (err: any) => {
          this.uploadSuccess = false;
          this.progressInfos[idx].value = 0;
        }
      );
    }
  }
}
