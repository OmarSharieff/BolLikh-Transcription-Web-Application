import express from 'express';
import multer from 'multer';
import {
  createTranscription,
  getTranscriptions,
  getTranscriptionById,
  updateTranscription,
  deleteTranscription,
} from '../controllers/transcriptionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, upload.single('audio'), createTranscription);
router.get('/', authMiddleware, getTranscriptions);
router.get('/:id', authMiddleware, getTranscriptionById);
router.put('/:id', authMiddleware, updateTranscription);
router.delete('/:id', authMiddleware, deleteTranscription);

export default router;
