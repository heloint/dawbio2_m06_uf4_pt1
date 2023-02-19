export class StorageEntity {
  #id: number;
  #name: string;
  #description: string;
  #size: number;
  #path: string;
  #gene: string;
  #taxonomyID: number;
  #uploadDate: Date;
  #uploadedBy: string;

  constructor(
    id: number = 0,
    name: string = '',
    description: string,
    size: number = 0,
    path: string = '',
    gene: string = '',
    taxonomyID: number = 0,
    uploadDate: Date = new Date(),
    uploadedBy: string = ''
  ) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#size = size;
    this.#path = path;
    this.#gene = gene;
    this.#taxonomyID = taxonomyID;
    this.#uploadDate = uploadDate;
    this.#uploadedBy = uploadedBy;
  }

  // Get id.
  get id(): number {
    return this.#id;
  }

  // Get name.
  get name(): string {
    return this.#name;
  }

  // Get description.
  get description(): string {
    return this.#description;
  }

  // Get size.
  get size(): number {
    return this.#size;
  }

  // Get path.
  get path(): string {
    return this.#path;
  }

  // Get gene.
  get gene(): string {
    return this.#gene;
  }

  // Get taxonomyID.
  get taxonomyID(): number {
    return this.#taxonomyID;
  }

  // Get uploadDate.
  get uploadDate(): Date {
    return this.#uploadDate;
  }

  // Get uploadedBy.
  get uploadedBy(): string {
    return this.#uploadedBy;
  }

  // set id.
  set id(id: number) {
    this.#id = id;
  }

  // set name.
  set name(name: string) {
    this.#name = name;
  }

  // set description.
  set description(description: string) {
    this.#description = description;
  }

  // set size.
  set size(size: number) {
    this.#size = size;
  }

  // set path.
  set path(path: string) {
    this.#path = path;
  }

  // set gene.
  set gene(gene: string) {
    this.#gene = gene;
  }

  // set taxonomyID.
  set taxonomyID(taxonomyID: number) {
    this.#taxonomyID = taxonomyID;
  }

  // set uploadDate.
  set uploadDate(uploadDate: Date) {
    this.#uploadDate = uploadDate;
  }

  // set uploadedBy.
  set uploadedBy(uploadedBy) {
    this.#uploadedBy = uploadedBy;
  }
}
