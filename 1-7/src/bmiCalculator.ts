interface BmiParams {
  height: number;
  weight: number;
}

export const parseBmiArguments = (args: string[]): BmiParams => {
  if (args.length > 4) throw new Error('Too many arguments');
  if (args.length < 4) throw new Error('Not enough arguments');

  const height = Number(args[0]);
  const weight = Number(args[1]);
  
  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Provided values were not numbers!');
  }

  return {
    height,
    weight
  };
};

export const calculateBmi = (height: number, weight: number) => {
  const bmi = weight / Math.pow(height / 100, 2);

  if (bmi < 16) return 'Underweight (Severe thinness)';
  else if (bmi < 17) return 'Underweight (Moderate thinness)';
  else if (bmi < 18.5) return 'Underweight (Mild thinness)';
  else if (bmi < 25) return 'Normal (Healthy weight)';
  else if (bmi < 30) return 'Overweight (Pre-obese)';
  else if (bmi < 35) return 'Obese (Class I)';
  else if (bmi < 40) return 'Obese (Class II)';
  else return 'Obese (Class II)';
};

/*
try {
  const { height, weight } = parseBmiArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(`Error: ${error.message}`);
  }
}
*/