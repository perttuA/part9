import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, FormikErrors } from "formik";

import { DiagnosisSelection, NumberField, SelectField, TextField, TypeOption } from "../AddPatientModal/FormField";
import { EntryWithoutId, EntryFieldValues } from "../types";
import { useStateValue } from "../state";
import { toEntry, assertNever, isDate } from "../utils";

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "OccupationalHealthcare" },
  { value: "HealthCheck", label: "HealthCheck" },
];

export const validateEntryFormFields = (values: EntryFieldValues) => {
  const requiredError = "Field is required";
  const formatError = "Incorrect format";
  const errors: FormikErrors<EntryFieldValues> = {};

  // Validate: Type
  if (!values.type) errors.type = requiredError;
  // Validate: Description
  if (!values.description) errors.description = requiredError;
  // Validate: Specialist
  if (!values.specialist) errors.specialist = requiredError;

  // Validate: Date
  if (!values.date) {
    errors.date = requiredError;
  } else if (!isDate(values.date)){
    errors.date = formatError;
  }

  switch (values.type) {
    case "Hospital":
      // Validate: Discharge Date
      if (!values.discharge.date) {
        errors.discharge =  { ...errors.discharge, date: requiredError };
      } else if (!isDate(values.discharge.date)) {
        errors.discharge = { ...errors.discharge, date: formatError };
      }
      // Validate: Discharge Criteria
      if (!values.discharge.criteria) {
        errors.discharge = { ...errors.discharge, criteria: requiredError };
      }
      break;
    case "OccupationalHealthcare":
      // Validate: Employer Name
      if (!values.employerName) {
        errors.employerName = requiredError;
      }
      if (values.sickLeave.startDate || values.sickLeave.endDate) {
        // Validate: Sick Leave Start Date
        if (!values.sickLeave.startDate) {
          errors.sickLeave = { ...errors.sickLeave, startDate: requiredError };
        } else if (!isDate(values.sickLeave.startDate)) {
          errors.sickLeave = { ...errors.sickLeave, startDate: formatError };
        }
        // Validate: Sick Leave End Date
        if (!values.sickLeave.endDate) {
          errors.sickLeave = { ...errors.sickLeave, endDate: requiredError };
        } else if (!isDate(values.sickLeave.endDate)) {
          errors.sickLeave = { ...errors.sickLeave, endDate: formatError };
        }
      } 
      break;
    case "HealthCheck":
      // Validate: Health Check Rating
      if (!values.healthCheckRating && values.healthCheckRating !== 0) {
        errors.healthCheckRating = requiredError;
      }
      break;
    default:
      return assertNever(values.type);
  }
  return errors;
};

export const AddEntryForm = ({ onSubmit, onCancel } : Props ) => {
  const [{ diagnoses }] = useStateValue();

  const initialValues: EntryFieldValues = {
    type: "HealthCheck",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    healthCheckRating: 0,
    discharge: {
      date: "",
      criteria: ""
    },
    employerName: "",
    sickLeave: {
      startDate: "",
      endDate: ""
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(toEntry(values))}
      validate={validateEntryFormFields}
    >
      {({ values, isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <SelectField
              label="Type"
              name="type"
              options={typeOptions}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            {values.type === "Hospital" &&
              <>
                <Field
                  label={"Discharge Date"}
                  placeholder={"YYYY-MM-DD"}
                  name={"discharge.date"}
                  component={TextField}
                />
                <Field
                  label={"Discharge Criteria"}
                  placeholder={"Discharge Criteria"}
                  name={"discharge.criteria"}
                  component={TextField}
                />
              </>
            }
            {values.type === "OccupationalHealthcare" &&
              <>
                <Field
                  label={"Employer Name"}
                  placeholder={"Employer Name"}
                  name={"employerName"}
                  component={TextField}
                />
                <Field
                  label={"Sick Leave Start Date"}
                  placeholder={"YYYY-MM-DD"}
                  name={"sickLeave.startDate"}
                  component={TextField}
                />
                <Field
                  label={"Sick Leave End Date"}
                  placeholder={"YYYY-MM-DD"}
                  name={"sickLeave.endDate"}
                  component={TextField}
                />
              </>            
            }
            {values.type === "HealthCheck" &&
              <Field
                label={"Health Check Rating"}
                name={"healthCheckRating"}
                component={NumberField}
                min={0}
                max={3}
              />
            }
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
