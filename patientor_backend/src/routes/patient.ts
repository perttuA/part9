import { Router } from 'express';
import patientService from '../service/patient';
import { toNewEntry, toNewPatient } from '../utils';

const router = Router();

router.get('/', (_, res) => {
  res.json(patientService.getAllPublic());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  if (patient) res.json(patient);
  else res.sendStatus(404);
});

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatient = toNewPatient(req.body); 
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if(error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addPatientEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if(error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;