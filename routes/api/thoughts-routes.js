const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtsById,
    createThought,
    updateThoughts,
    deleteThought,
    addResponse,
    removeResponse,
} = require('../../controllers/thoughts-controller');

router.route('/').get(getAllThoughts).post(createThought);

router  
    .route('/:id')
    .get(getThoughtsById)
    .put(updateThoughts)
    .delete(deleteThought)

router.route('/"thoughtId/response').post(addResponse);

router.route('/:thoughtId/response/:responseId').delete(removeResponse);

module.exports = router;