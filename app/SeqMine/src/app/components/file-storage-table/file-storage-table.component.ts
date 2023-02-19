import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { StorageEntity } from '../../models/storage-entity.model';
import { Router, ActivatedRoute } from '@angular/router';
import {
  SessionHandlingService,
  SessionData,
} from '../../services/session-handling.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-storage-table',
  templateUrl: './file-storage-table.component.html',
  styleUrls: ['./file-storage-table.component.css'],
})
export class FileStorageTableComponent {
  cp: number = 1;
  rowNumberLimit: number = 10;
  allFilesArr: Array<StorageEntity> = [];
  filesToDisplay: Array<StorageEntity> = this.allFilesArr.map((e) => e);
  recentlyDeletedUser: string | null = null;
  userDeletionStatus: Boolean | null = null;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private database: DatabaseService,
    private sessionHandler: SessionHandlingService
  ) {}

  // Initialize the mini-form for the search bar.
  searchBarForm: FormGroup = new FormGroup({
    searchTerm: new FormControl('', []),
  });

  /* Filters down the array of StorageEntity objects by the search term.
   * Returns the object if any of it's values contains the term as a substring.
   * @param {string} term
   * @return {void}
   * */
  searchByTerm(term: string) {
    this.filesToDisplay = this.allFilesArr.map((e) => e);
    const searchResults: Array<StorageEntity> = this.filesToDisplay.filter(
      (entity) => {
        const entityValues: Array<string> = [
          entity.id.toString(),
          entity.name,
          entity.description,
          entity.size.toString(),
          entity.gene,
          entity.taxonomyID.toString(),
          entity.uploadDate.toString(),
          entity.uploadedBy,
        ];

        console.log(entityValues);
        for (let val of entityValues) {
          if (val.includes(term)) {
            return true;
          }
        }

        return false;
      }
    );
    this.filesToDisplay = searchResults;
  }

  /* Get the user datas of the current session.
   * @return {SessionData}
   * */
  get sessionUser(): SessionData {
    return this.sessionHandler.userData;
  }

  /**
   * Subscribes to the result of the getAllUsers function from the database service.
   * Then, for each file returned, a new File instance is created and pushed into allFilesArr array.
   * @returns {any} - A subscription to the getAllUsers result.
   */
  fetchAllSequenceFiles(): any {
    return this.database.getAllSequenceFiles().subscribe((files) => {
      files.result.forEach((file) => {
        this.allFilesArr.push(
          new StorageEntity(
            file.file_id,
            file.name,
            file.description,
            file.size,
            file.path,
            file.gene,
            file.taxonomy_id,
            new Date(file.upload_date),
            file.uploaded_by
          )
        );

        // Create a copy of the original variable, "this.allFilesArr".
        // This copy will be used to be filtered, rather than mutating the original,
        // which will contain all the found files.
        this.filesToDisplay = this.allFilesArr.map((e) => e);
      });
    });
  }

  /**
   * Navigates to the /user-modify route, passing in the inputUserID as a parameter.
   * @param {number} inputUserID - The user ID to be passed as a parameter to the /user-modify route.
   * @returns {void}
   */
  goToUserManage(inputUserID: number) {
    this.route.navigate(['/user-modify', { userID: inputUserID }]);
  }

  /**
   * Navigates to the /confirm-page route, passing in the following parameters:
   * @param {number} id - The id of the user to be deleted.
   * @param {string} name - The username of the user to be deleted.
   * @returns {void}
   */
  requireConfirmation(id: number, name: string) {
    const dialog: string = `Are you sure you want to delete "${name}" file?`;

    this.route.navigate([
      '/confirm-page',
      { id: id, confirmDialog: dialog, method: 'fileDelete', name: name },
    ]);
  }

  /**
   * Gets the status of the recent user deletion from the URL parameters.
   * If the status is not null, sets the userDeletionStatus to the status
   * and the recentlyDeletedUser to the username of the deleted user.
   * @returns { Boolean | null } - The status of the recent user deletion or null if not set.
   * */
  getFileDeletionStatus(): Boolean | null {
    const status: string | null =
      this.activatedRoute.snapshot.paramMap.get('status');

    if (status !== null) {
      this.userDeletionStatus =
        this.activatedRoute.snapshot.paramMap.get('status') === 'true';
      this.recentlyDeletedUser =
        this.activatedRoute.snapshot.paramMap.get('name');
    }

    return this.userDeletionStatus;
  }

  /* Get the download link for the file with the corresponding ID.
   * @return {string}
   * */
  getDownloadLink(id: number): string {
    return this.database.generateFileDownloadHREF(id);
  }

  /**
   * Navigates to the /file-storage-modify route, passing in the id as a parameter.
   * @param {number} id - The file ID to be passed as a parameter to the /file-storage-modify route.
   * @returns {void}
   */
  goToSeqFileManage(id: number) {
    this.route.navigate(['/file-storage-modify', { fileID: id }]);
  }

  /**
   * Calls the fetchAllSequenceFiles method.
   * @returns {void}
   * */
  ngOnInit() {
    this.fetchAllSequenceFiles();
  }
}
