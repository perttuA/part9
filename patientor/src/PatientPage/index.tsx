import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { updatePatient, useStateValue } from '../state';
import { apiBaseUrl } from '../constants';
import { Entry, EntryWithoutId, Gender, Patient } from '../types';
import { Button, Icon } from 'semantic-ui-react';
import EntryDetails from '../components/EntryDetails';
import AddEntryModal from '../AddEntryModal';

const PatientPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const { id } = useParams<{ id: string }>();
  const patient = patients[id];

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        { entry: values }
      );
      const updatedPatient = { ...patient, entries: patient.entries ? [...patient.entries, newEntry] : [newEntry] };
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if(axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        errorMessage = error.response.data.error;
      }
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    if (patient && !patient.ssn) { 
      void fetchPatient();
    }
  }, [patient, dispatch]);

  if (!patient) return null;

  return (
    <div>
      <h2>
        {patient.name}
        <Icon name={
          patient.gender === Gender.Male 
            ? 'mars' 
            : patient.gender === Gender.Female 
              ? 'venus' 
              : 'genderless'
          }
        />
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>entries</h3>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      {patient.entries && patient.entries.map(e => 
        <EntryDetails key={e.id} entry={e} diagnoses={diagnoses} />
      )}
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientPage;