import data from '../data/diagnoses.json';
import { Diagnosis } from '../types';

const getAll = () => {
  const diagnoses = data as Diagnosis[];
  return diagnoses;
};

export default { getAll };