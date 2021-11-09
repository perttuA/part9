import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const h = req.query.height;
  const w = req.query.weight;

  if (!h || !w) { 
    return res.status(400).json({ error: 'parameters missing' });
  }

  const height = Number(h);
  const weight = Number(w);

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters '});
  }

  const result = calculateBmi(height, weight);

  return res.json({
    weight,
    height,
    result
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;
  
  if (!target || !daily_exercises) { 
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const numTarget = Number(target);
  const numHours = daily_exercises.map(n => Number(n));

  if (isNaN(numTarget) || numHours.some(n => isNaN(n))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(numTarget, numHours);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});