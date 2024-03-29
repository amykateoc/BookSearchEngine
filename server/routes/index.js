const router = require('express').Router();
const path = require('path');
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// serve up react front-end in production
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/'));
});

module.exports = router;
