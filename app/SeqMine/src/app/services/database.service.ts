import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { StorageEntity } from '../models/storage-entity.model';

// Represents a response with user related queries.
export type DBUserArr = {
  result: Array<DBUser>;
};

// Represents an item in a response with user related queries.
export type DBUser = {
  user_id: number;
  username: string;
  role_name: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  registration_date: Date;
};

// Represents a response with user related queries.
export type DBStorageEntityArr = {
  result: Array<DBStorageEntity>;
};

// Represents an item in a response with user related queries.
export type DBStorageEntity = {
  file_id: number;
  name: string;
  description: string;
  size: number;
  path: string;
  gene: string;
  taxonomy_id: number;
  upload_date: Date;
  uploaded_by: string;
};

// Represents a response with role related queries.
export type DBRoleArr = {
  result: Array<DBRole>;
};

// Represents an item in a response with role related queries.
export type DBRole = {
  role_id: number;
  role_name: string;
};

export type DBLastUserID = {
  result: number;
};

export type QueryConfirmation = {
  result: Boolean;
};

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  // Base URL to the REST API server.
  // #BASE_URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Requests all the users can be found in the database.
  public getAllUsers() {
    return this.http.get<DBUserArr>('/users');
  }

  // Requests all the roles can be found in the database.
  public getAllRoles() {
    return this.http.get<DBRoleArr>('/roles');
  }

  /* Requests to find a user by it's ID.
   * @param inputID number
   * */
  public getUserByID(inputID: number) {
    return this.http.post<DBUserArr>('/userByID', {
      userID: inputID,
    });
  }

  /* Requests to find a user by it's ID.
   * @param inputID number
   * */
  public getFileByID(inputID: number) {
    return this.http.post<DBStorageEntityArr>('/fileByID', {
      fileID: inputID,
    });
  }

  // Requests the last user id from the database.
  public getLastUserID() {
    return this.http.get<DBLastUserID>('/lastUserID');
  }

  /* Send a request to the server to delete a user by the argument ID.
   * @param inputID number
   * */
  public deleteUserByID(inputID: number) {
    return this.http.post<QueryConfirmation>(
      '/deleteUserByID',
      { userID: inputID }
    );
  }

  /* Send a request to the server to delete a file by the argument ID.
   * @param inputID number
   * */
  public deleteFileByID(inputID: number) {
    return this.http.post<QueryConfirmation>(
      '/deleteFileByID',
      { id: inputID }
    );
  }

  /* Send a request to the server with a User object to update it's register with the new data.
   * @param user DBUser
   * */
  public updateUser(user: DBUser) {
    return this.http.post<QueryConfirmation>(
      '/updateUser',
      user
    );
  }

  /* Send a request to the server with a User object to create a new resgister.
   * @param user DBUser
   * */
  public addUser(user: DBUser) {
    return this.http.post<QueryConfirmation>('/addUser', user);
  }

  /* Send a request to the server with a File object save it on the server.
   * @param user DBUser
   * */
  public uploadSequence(file: File) {
    let formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest(
      'POST',
      `/uploadSequence`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  /* Send a request to the server with a User object to create a new resgister.
   * @param user DBUser
   * */
  public registerUser(user: DBUser) {
    return this.http.post<QueryConfirmation>(
      '/registerUser',
      user
    );
  }

  /* Send a request to the server with a StorageEntity object
   * to register it in the database.
   * @param user DBUser
   * */
  public registerSequence(storageEntity: StorageEntity) {
    return this.http.post<QueryConfirmation>(
      '/registerSequence',
      {
        name: storageEntity.name,
        description: storageEntity.description,
        size: storageEntity.size,
        gene: storageEntity.gene,
        taxonomyID: storageEntity.taxonomyID,
        uploadedBy: storageEntity.uploadedBy,
      }
    );
  }

  // Requests all the sequence files can be found in the database.
  public getAllSequenceFiles() {
    return this.http.get<DBStorageEntityArr>('/sequenceFiles');
  }

  public generateFileDownloadHREF(id: number): string {
    return `/downloadSequenceFile?id=${id}`;
  }

  /* Send a request to the server with a DBStorageEntity object to update it's register with the new data.
   * @param user DBStorageEntity
   * */
  public updateSequenceFile(file: DBStorageEntity) {
    return this.http.post<QueryConfirmation>(
      '/updateSequenceFile',
      file
    );
  }
}
