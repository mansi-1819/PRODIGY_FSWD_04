const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:roomId', async (req, res) => {
  const messages = await Message.find({ room: req.params.roomId });
  res.json(messages);
});

module.exports = router;
