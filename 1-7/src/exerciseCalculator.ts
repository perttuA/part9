interface ExerciseParams {
  target: number;
  hours: number[];
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const parseExerciseArguments = (args: string[]): ExerciseParams => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = Number(args[2]);
  const hours = args.slice(3).map(n => Number(n));

  if (isNaN(target) || hours.some(n => isNaN(n))) {
    throw new Error('Provided values were not numbers!');
  }

  return {
    target,
    hours
  };
};

export const calculateExercises = (target: number, hours: number[]): Result => {
  const average = hours.reduce((s, n) => s + n) / hours.length;
  const rating = Math.floor(average / target * 3);
  
  let ratingDescription = 'excellent work';

  switch(rating) {
    case 2:
      ratingDescription = 'not too bad but could be better';
      break;
    default:
      ratingDescription = 'you can do better than this';
  }

  return {
    periodLength: hours.length,
    trainingDays: hours.reduce((d, n) => n > 0 ? d + 1 : d, 0),
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average
  };
};

/*
try {
  const { target, hours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(target, hours));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(`Error: ${error.message}`);
  }
}
*/