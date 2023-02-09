/*
 * "User" class to represent a user in the application's database.
 * @author Dániel Májer
 * */


              /* <th scope="col">ID</th>
              <th scope="col">Username</th>
              <th scope="col">Role</th>
              <th scope="col">Password</th>
              <th scope="col">First name</th>
              <th scope="col">Last name</th>
              <th scope="col">Registration date</th> */


export class User {
  #id: number;
  #username: string;
  #role: string;
  #password: string;
  #email: string;
  #firstName: string;
  #lastName: string;
  #registrationDate: Date;

  constructor(
    id: number,
    username: string,
    role: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    registrationDate: Date,
  ) {
    this.#id = id;
    this.#username = username;
    this.#role = role;
    this.#password = password;
    this.#email = email;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#registrationDate = registrationDate;
  }

  // Get ID.
  get id(): number{
    return this.#id;
  }

  // Get username.
  get username(): string {
    return this.#username;
  }


  // Get role.
  get role(): string {
    return this.#role;
  }

  // Get password.
  get password(): string {
    return this.#password;
  }

  // Get email.
  get email(): string {
    return this.#email;
  }

  // Get first name.
  get firstName(): string {
    return this.#firstName;
  }

  // Get last name.
  get lastName(): string {
    return this.#lastName;
  }

  // Get last name.
  get registrationDate(): Date {
    return this.#registrationDate;
  }

  // Set username.
  set id(id: number) {
    this.id = id;
  }

  // Set username.
  set username(username: string) {
    this.#username = username;
  }

  // Set role.
  set role(role: string) {
    this.#role = role;
  }

  // Set password.
  set password(password: string) {
    this.#password = password;
  }

  // Set email.
  set email(email: string) {
    this.#email = email;
  }

  // Set first name.
  set firstname(firstName: string) {
    this.#firstName = firstName;
  }

  // Set first name.
  set lastname(lastName: string) {
    this.#lastName = lastName;
  }

  // Set registration date.
  set registrationDate(registrationDate: Date) {
    this.#registrationDate= registrationDate;
  }
}
