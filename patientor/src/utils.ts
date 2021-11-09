import { EntryWithoutId, EntryFieldValues } from "./types";

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

/**
 * Converts Entry Form Values to a Single Entry.
 * @param values Entry form values.
 * @returns Entry without id.
 */
export const toEntry = (values: EntryFieldValues): EntryWithoutId => {
  switch(values.type) {
    case "Hospital":
      return {
        type: values.type,
        description: values.description,
        date: values.date,
        specialist: values.specialist,
        diagnosisCodes: values.diagnosisCodes,
        discharge: values.discharge
      };
    case "OccupationalHealthcare":
      return {
        type: values.type,
        description: values.description,
        date: values.date,
        specialist: values.specialist,
        diagnosisCodes: values.diagnosisCodes,
        employerName: values.employerName,
        sickLeave: values.sickLeave
      };
    case "HealthCheck":
      return {
        type: values.type,
        description: values.description,
        date: values.date,
        specialist: values.specialist,
        diagnosisCodes: values.diagnosisCodes,
        healthCheckRating: values.healthCheckRating
      };
    default:
      return assertNever(values.type);
  }
};