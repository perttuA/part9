import React from 'react';
import { CoursePart } from '../types';
import { assertNever } from '../utils';

const Part = ({ part }: { part: CoursePart }) => {
  switch(part.type) {
    case 'normal':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br/>
          <i>{part.description}</i>
        </p>
      )
    case 'groupProject':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br/>
          project exercises {part.groupProjectCount}
        </p>
      )
    case 'submission':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br/>
          <i>{part.description}</i>
          <br/>
          submit to {part.exerciseSubmissionLink}
        </p>
      )
    case 'special':
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br/>
          <i>{part.description}</i>
          <br/>
          required skills: {part.requirements.join(',')}
        </p>
      )
    default:
      return assertNever(part);
  }
};

export default Part;