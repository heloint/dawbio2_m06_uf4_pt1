export class Role {
  #id: number;
  #name: string;

  constructor(
    id: number,
    name: string
  ){
    this.#id = id;
    this.#name = name;
  }

  // Get id.
  get id(): number {
    return this.#id;
  }

  // Get name.
  get name(): string {
    return this.#name;
  }

  // Set id.
  set id(id: number) {
    this.#id = id;
  }

  // Set name.
  set name(name: string) {
    this.#name = name;
  }
}
