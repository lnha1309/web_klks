const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
  const { checkId, actualLabel, comment } = req.body;
  try {
    const feedback = await Feedback.create({
      userId: req.user.id,
      checkId,
      actualLabel,
      comment
    });
    res.json({ success: true, data: feedback });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
