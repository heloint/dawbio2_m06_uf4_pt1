import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { StorageEntity } from '../../models/storage-entity.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-file-storage-table',
  templateUrl: './file-storage-table.component.html',
  styleUrls: ['./file-storage-table.component.css']
})
export class FileStorageTableComponent {
  allFilesArr: Array<StorageEntity> = [];
  recentlyDeletedUser: string | null = null;
  userDeletionStatus: Boolean | null = null;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private database: DatabaseService
  ) { }

  /**
  * Subscribes to the result of the getAllUsers function from the database service.
  * Then, for each file returned, a new File instance is created and pushed into allFilesArr array.
  * @returns {any} - A subscription to the getAllUsers result.
  */
  fetchAllSequenceFiles(): any {
    return this.database.getAllSequenceFiles().subscribe(
      files=> {
        files.result.forEach((file)=> {
            this.allFilesArr.push(new StorageEntity(
                file.file_id,
                file.name,
                file.size,
                file.path,
                file.gene,
                file.taxonomy_id,
                new Date(file.upload_date),
                file.uploaded_by,
            ));
        });
      });
  }

  /**
   * Navigates to the /user-modify route, passing in the inputUserID as a parameter.
   * @param {number} inputUserID - The user ID to be passed as a parameter to the /user-modify route.
   * @returns {void}
   */
  goToUserManage(inputUserID: number) {
    this.route.navigate(['/user-modify', {userID: inputUserID}]);
  }

  /**
   * Navigates to the /confirm-page route, passing in the following parameters:
   *     id: the id of the user to be deleted.
   *     confirmDialog: a string containing a confirmation message to be displayed.
   *     method: the method to be executed after confirming, in this case "userDelete".
   *     username: the username of the user to be deleted.
   *
   *@param {number} id - The id of the user to be deleted.
   *@param {string} username - The username of the user to be deleted.
   *@returns {void}
    */
  requireConfirmation(id: number, name: string) {
      const dialog: string = `Are you sure you want to delete "${name}" file?`;

    this.route.navigate(['/confirm-page', {id: id, confirmDialog: dialog, method: 'fileDelete', name: name}]);
  }

  /**
  * Gets the status of the recent user deletion from the URL parameters.
  * If the status is not null, sets the userDeletionStatus to the status and the recentlyDeletedUser to the username of the deleted user.
  *@returns {Boolean|null} - The status of the recent user deletion or null if not set.
  * */
  getFileDeletionStatus(): Boolean | null {
    const status: string | null = this.activatedRoute.snapshot.paramMap.get('status');

    if (status !== null) {
        this.userDeletionStatus = (this.activatedRoute.snapshot.paramMap.get('status') === 'true');
        this.recentlyDeletedUser = this.activatedRoute.snapshot.paramMap.get('name');
    }

    return this.userDeletionStatus;
  }

    getDownloadLink(id: number): string {
        return this.database.generateFileDownloadHREF(id);
    }
  /**
   * Calls the fetchAllSequenceFiles method.
   * @returns {void}
   * */
  ngOnInit() {
    this.fetchAllSequenceFiles();

  }

}
