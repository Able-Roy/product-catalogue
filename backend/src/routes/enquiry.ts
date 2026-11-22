import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { sendEnquiryEmail } from '../services/emailService';
import { EnquiryPayload } from '../types';

const router = Router();

/** Validation rules for POST /api/enquiry */
const enquiryValidation = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('a valid email is required'),
  body('message').trim().notEmpty().withMessage('message is required'),
  body('productId').isInt().withMessage('productId must be an integer'),
  body('productTitle').trim().notEmpty().withMessage('productTitle is required'),
  body('phone').optional().isString(),
];

/** POST /api/enquiry — send enquiry email to sales */
router.post(
  '/',
  enquiryValidation,
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body as EnquiryPayload;
      await sendEnquiryEmail(payload);
      res.status(200).json({ success: true, message: 'Enquiry sent successfully.' });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
