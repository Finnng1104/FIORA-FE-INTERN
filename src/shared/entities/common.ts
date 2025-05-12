export type UUID = string;

export interface BaseEntity {
  id: UUID;
  createdAt: Date;
  createdBy: UUID | null;
  updatedAt: Date;
  updatedBy: UUID | null;
}

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
