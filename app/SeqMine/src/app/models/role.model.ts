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

    // Get ID of class.
    get id(): number {
        return this.#id;
    }

    // Get name of class.
    get name(): string{
        return this.#name;
    }

    // Set ID of class.
    set id(id: number) {
        this.#id = id;
    }

    // Set name of class.
    set name(name: string) {
        this.#name = name;
    }
}
