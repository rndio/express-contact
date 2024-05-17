import express from 'express';
import userController from '../controller/user-controller.js';
import contactController from '../controller/contact-controller.js';


const publicRouter = new express.Router();
publicRouter.get('/', (req, res) => {
  res.send('Hello From Team 3');
});

publicRouter.post('/api/users', userController.register);
publicRouter.post('/api/users/login', userController.login);

publicRouter.post('/api/contacts', contactController.store);

export default publicRouter;