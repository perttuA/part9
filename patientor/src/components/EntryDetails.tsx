import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { Diagnosis, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../types';
import { assertNever } from '../utils';

const HospitalEntryCard = ({ entry, diagnoses }: { entry: HospitalEntry, diagnoses: { [id: string]: Diagnosis } }) => {
  return (
    <Card fluid color='blue'>
      <Card.Content>
        <Card.Header>{entry.date} <Icon name='hospital' size='large' /></Card.Header>
        <Card.Meta><i>{entry.description}</i></Card.Meta>
        <Card.Description>
          {entry.diagnosisCodes && 
            <ul>
              {entry.diagnosisCodes.map(c => <li key={c}>{c} {diagnoses[c].name}</li>)}
            </ul>
          }
          {
            entry.discharge &&
            <>
              Discharged:
              <br />
              - Date: {entry.discharge.date}
              <br />
              - Criteria: {entry.discharge.criteria}
            </>
          }
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

const OccupationalEntryCard = ({ entry, diagnoses }: { entry: OccupationalHealthcareEntry, diagnoses: { [id: string]: Diagnosis } }) => {
  return (
    <Card fluid color='purple'>
      <Card.Content>
        <Card.Header>{entry.date} <Icon name='stethoscope' size='large' /> {entry.employerName}</Card.Header>
        <Card.Meta><i>{entry.description}</i></Card.Meta>
        <Card.Description>
          {entry.diagnosisCodes && 
            <ul>
              {entry.diagnosisCodes.map(c => <li key={c}>{c} {diagnoses[c].name}</li>)}
            </ul>
          }
          {
            entry.sickLeave &&
            <>
              Sick Leave:
              <br />
              - From: {entry.sickLeave.startDate}
              <br />
              - To: {entry.sickLeave.endDate}
            </>
          }
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

const HealthCheckEntryCard = ({ entry, diagnoses }: { entry: HealthCheckEntry, diagnoses: { [id: string]: Diagnosis } }) => {
  return (
    <Card fluid color='teal'>
      <Card.Content>
        <Card.Header>{entry.date} <Icon name='doctor' size='large' /></Card.Header>
        <Card.Meta><i>{entry.description}</i></Card.Meta>
        {entry.diagnosisCodes && 
          <Card.Description>
            <ul>
              {entry.diagnosisCodes.map(c => <li key={c}>{c} {diagnoses[c].name}</li>)}
            </ul>
          </Card.Description>
        }
        <Icon name='heart' color={
            entry.healthCheckRating > 2 
              ? 'red'
              : entry.healthCheckRating > 1
                ? 'orange' 
                : entry.healthCheckRating > 0
                  ? 'yellow'
                  : 'green'
          }
        />
      </Card.Content>
    </Card>
  );
};

const EntryDetails = ({ entry, diagnoses }: { entry: Entry, diagnoses: { [id: string]: Diagnosis } }) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryCard entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalEntryCard entry={entry} diagnoses={diagnoses}/>;
    case 'HealthCheck':
      return <HealthCheckEntryCard entry={entry} diagnoses={diagnoses}/>;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;