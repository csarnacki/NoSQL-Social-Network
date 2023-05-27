const router = require('express').Router();
const apiRputes = require('./api');

router.use('/api', apiRputes);

router.use((req, res) => {
    res.status(400).send('Error has occurred!');
});

module.exports = router;