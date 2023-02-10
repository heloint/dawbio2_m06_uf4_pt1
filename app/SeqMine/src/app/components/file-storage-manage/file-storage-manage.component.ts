import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-file-storage-manage',
  templateUrl: './file-storage-manage.component.html',
  styleUrls: ['./file-storage-manage.component.css']
})
export class FileStorageManageComponent {

    fileName = '';

    constructor(private http: HttpClient) {}

    onFileSelected(event: any) {

        const file:File = event.target.files[0];

        if (file) {

            this.fileName = file.name;

            const formData = new FormData();

            formData.append("file", file);

            const upload$ = this.http.post("http://localhost:3000/uploadFasta", formData);

            upload$.subscribe();
        }
    }

}
