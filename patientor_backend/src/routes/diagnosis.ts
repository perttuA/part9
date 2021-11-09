import { Router } from 'express';
import diagnosisService from '../service/diagnosis';

const router = Router();

router.get('/', (_, res) => {
  res.json(diagnosisService.getAll());
});

export default router;