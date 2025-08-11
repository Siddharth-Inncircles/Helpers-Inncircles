import { Router } from "express";
import { HelperController } from "../controllers/helper.controller";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const helperRouter = Router();
const helperController: HelperController = new HelperController();

helperRouter.post('/', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'kycDocument', maxCount: 1 },
    { name: 'additionalPdfs' }
]), helperController.createHelper);
helperRouter.get('/', helperController.getAllHelpers);
helperRouter.get('/:id', helperController.getHelperByID);
helperRouter.put('/:id',upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'kycDocument', maxCount: 1 },
    { name: 'additionalPdfs' }
]), helperController.updateHelper);
helperRouter.delete('/:id', helperController.deleteHelper);

export default helperRouter;
