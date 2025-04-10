const { Router } = require('express');
const { CredentialController } = require('../controllers/credentialController');

const router = Router();
const controller = new CredentialController();

router.post('/issue', controller.issueCredential.bind(controller));
router.post('/present', controller.createPresentation.bind(controller));
router.post('/verify', controller.verifyCredential.bind(controller));

module.exports = router; 