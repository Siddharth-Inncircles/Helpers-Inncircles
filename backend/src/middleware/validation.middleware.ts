import { body } from 'express-validator';

export const helperValidation = [
    body('employeeCode')
        .notEmpty()
        .withMessage('Employee code is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Employee code must be between 3-20 characters'),
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2-100 characters'),
    body('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['Nurse', 'Driver', 'Newspaper', 'Laundry', 'Maid', 'Plumber', 'Cook'])
        .withMessage('Invalid helper type'),
    body('organization')
        .notEmpty()
        .withMessage('Organization is required')
        .isIn(['ASBL', 'Springs', 'Springs Helpers'])
        .withMessage('Invalid Organization type'),
    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Invalid gender'),
    body('language')
        .isArray({ min: 1 })
        .withMessage('At least one language is required'),
    body('mobileNo')
        .notEmpty()
        .withMessage('Mobile number is required')
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Invalid mobile number format'),
    body('emailId')
        .optional()
        .isEmail()
        .withMessage('Invalid email format'),
    body('joinedOn')
        .notEmpty()
        .withMessage('Joined date is required')
        .isISO8601()
        .withMessage('Invalid date format')
];