import express from 'express';
import userController from '../controller/user-controller.js';
import contactController from '../controller/contact-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';


const userRouter = new express.Router();
userRouter.use(authMiddleware);

userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

userRouter.get('/api/contacts', contactController.search);
userRouter.get('/api/contacts/:contactId', contactController.get);
userRouter.delete('/api/contacts/:contactId', contactController.destroy);


export default userRouter;