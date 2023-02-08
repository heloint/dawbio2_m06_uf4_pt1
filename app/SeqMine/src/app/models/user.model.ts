/*
 * "User" class to represent a user in the application's database.
 * @author Dániel Májer
 * */

export class User {
  #id: number;
  #username: string;
  #password: string;
  #email: string;
  #role: string;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    role: string,
  ) {
    this.#id = id;
    this.#username = username;
    this.#password = password;
    this.#email = email;
    this.#role = role;
  }

  // Get ID.
  get id(): number{
    return this.#id;
  }

  // Get username.
  get username(): string {
    return this.#username;
  }

  // Get password.
  get password(): string {
    return this.#password;
  }

  // Get email.
  get email(): string {
    return this.#email;
  }

  // Get role.
  get role(): string {
    return this.#role;
  }

  // Set username.
  set id(id: number) {
    this.id = id;
  }

  // Set username.
  set username(username: string) {
    this.#username = username;
  }

  // Set password.
  set password(password: string) {
    this.#password = password;
  }

  // Set email.
  set email(email: string) {
    this.#email = email;
  }

  // Set role.
  set role(role: string) {
    this.#role = role;
  }
}
