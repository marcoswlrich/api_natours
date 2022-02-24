import express from 'express';

import userControler from '../controllers/userController';

const router = express.Router();

router.route('/').get(userControler.getAllUsers).post(userControler.createUser);

router
  .route('/:id')
  .get(userControler.getUser)
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser);

export default router;
