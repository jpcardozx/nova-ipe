// Form type definitions
export interface FormData {
  entries(): IterableIterator<[string, FormDataEntryValue]>;
  get(name: string): FormDataEntryValue | null;
  getAll(name: string): FormDataEntryValue[];
  has(name: string): boolean;
  set(name: string, value: string | Blob, fileName?: string): void;
  delete(name: string): void;
  append(name: string, value: string | Blob, fileName?: string): void;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message?: string;
}
