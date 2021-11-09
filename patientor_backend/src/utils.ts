import { Gender, NewEntry, NewPatient, HealthCheckRating, Diagnosis } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};


const parseString = (value: unknown, label: string): string => {
  if (!value || !isString(value)) {
    throw new Error(`Incorrect or missing ${label}`);
  }
  return value;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health check rating');
  }
  return rating;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<Diagnosis['code']> | undefined => {
  if (!diagnosisCodes) return undefined;
  if (!Array.isArray(diagnosisCodes) || diagnosisCodes.some(e => !isString(e))) {
    throw new Error('Incorrect diagnosis  codes');
  }
  return diagnosisCodes as Array<Diagnosis['code']>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDischarge = (discharge: any): { date: string, criteria: string } => {
  if (!discharge) {
    throw new Error('Invalid or missing discharge');
  }
  return {
    date: parseDate(discharge.date),
    criteria: parseString(discharge.criteria, 'discharge criteria')
  };
};

type Fields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: Fields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(name, 'name'),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn, 'string'),
    gender: parseGender(gender),
    occupation: parseString(occupation, 'occupation')
  };

  return newPatient;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = ({ entry }: any): NewEntry => {
  if (!entry) throw new Error('missing entry');
  const description = parseString(entry.description, 'description');
  const date = parseDate(entry.date);
  const specialist = parseString(entry.specialist, 'specialist');

  switch(entry.type) {
    case 'Hospital':
      return {
        type: 'Hospital',
        description,
        date,
        specialist,
        diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
        discharge: parseDischarge(entry.discharge)
      };
    case 'OccupationalHealthcare':
      return {
        type: 'OccupationalHealthcare',
        description,
        date,
        specialist,
        diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
        employerName: parseString(entry.employerName, 'employer name'),
        ...(entry.sickLeave ? { sickLeave: {
          startDate: parseDate(entry.sickLeave.startDate),
          endDate: parseDate(entry.sickLeave.endDate),
        }}: null),
      };
    case 'HealthCheck':
      return {
        type: 'HealthCheck',
        description,
        date,
        specialist,
        diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating)
      };
    default:
      throw new Error('Incorrect or missing type');
  }
};