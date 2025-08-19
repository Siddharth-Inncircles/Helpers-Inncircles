import { body, query } from 'express-validator';
import { HelperType, OrganizationType, Gender } from '../models/helper.model';
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";


export const helperValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2-100 characters'),
    body('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(Object.values(HelperType))
        .withMessage('Invalid helper type'),
    body('organization')
        .notEmpty()
        .withMessage('Organization is required')
        .isIn(Object.values(OrganizationType))
        .withMessage('Invalid Organization type'),
    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(Object.values(Gender))
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




export const ValidatePagination = [
    body('pagination.page')
        .notEmpty()
        .withMessage('Page number is required')
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    body('pagination.limit')
        .notEmpty()
        .withMessage('Limit is required')
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    body('filters.sortField')
        .optional()
        .isString()
        .withMessage('Sort field must be a string'),
    body('filters.searchQuery')
        .optional()
        .isString()
        .withMessage('Search query must be a string'),
    body('filters.type')
        .optional()
        .custom((value) => {
            if (value && !Array.isArray(value) && typeof value !== 'string') {
                throw new Error('Type must be a string or array of strings');
            }
            return true;
        }),
    body('filters.organizations')
        .optional()
        .custom((value) => {
            if (value && !Array.isArray(value) && typeof value !== 'string') {
                throw new Error('Organizations must be a string or array of strings');
            }
            return true;
        }),
    body('filters.services')
        .optional()
        .custom((value) => {
            if (value && !Array.isArray(value) && typeof value !== 'string') {
                throw new Error('Services must be a string or array of strings');
            }
            return true;
        })
]


export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};
