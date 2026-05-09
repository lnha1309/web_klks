const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: { id: user.id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: { id: user.id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'fullName', 'email'] });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
