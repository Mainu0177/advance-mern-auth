const router = require('express').Router()


const {
    handleProcessRegister,
    // handleActivateUserAccount,
} = require('../controllers/userController')


router.post('/process-register', handleProcessRegister);
// router.post('/activate', handleActivateUserAccount);


module.exports = router;