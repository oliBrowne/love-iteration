// Every stored record carries this metadata. Dates are ISO strings.
export type RecordMetadata = {
  id: string;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
};
