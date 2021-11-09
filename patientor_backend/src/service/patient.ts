import patients from '../data/patients';
import { v1 as uuid } from 'uuid';
import { Entry, NewEntry, NewPatient, Patient, PublicPatient } from '../types';

const getAllPublic = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const addPatient = (newPatient: NewPatient): PublicPatient => {
  const patient = {
    ...newPatient,
    id: uuid(),
    entries: []
  };

  patients.push(patient);

  const { id, name, dateOfBirth, gender, occupation } = patient;
  return {
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  };
};

const addPatientEntry = ( id: string, newEntry: NewEntry ): Entry | undefined => {
  const patient = patients.find(p => p.id === id);
  if (!patient) return undefined;

  const entry = {
    ...newEntry,
    id: uuid()
  };

  patient.entries = [...patient.entries, entry];
  return entry;
};

export default { getAllPublic, getPatient, addPatient, addPatientEntry };