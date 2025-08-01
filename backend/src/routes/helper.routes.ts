import { Router } from "express";
// import { helperValidation } from "../middleware/validation.middleware";
import { HelperController } from "../controllers/helper.controller";


const helperRouter = Router();
const helperController : HelperController = new HelperController();

helperRouter.post('/', helperController.createHelper);
helperRouter.get('/', helperController.getAllHelpers);
helperRouter.get('/:id', helperController.getHelperByID);
helperRouter.put('/:id', helperController.updateHelper);
helperRouter.delete('/:id', helperController.deleteHelper);

export default helperRouter;
