
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemail');
const Users = require('../modules/User');
const generateOTP = require('../utils/otp');
const fetchUser = require('../middleware/fetchUser');
const requireRegisterSession = require('../middleware/requireRegisterSession');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid password' });

    if (!user.isVerified) return res.status(403).json({ success: false, message: 'Email not verified' });

    const token = jwt.sign({
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        image: user.image,
        pincode: user.pincode,
        city: user.region,
        email:email,
      }
    }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password, pincode, city } = req.body;
  try {
    const existingUser = await Users.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.isVerified)
      return res.status(400).json({ success: false, message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    if (existingUser) await Users.findOneAndDelete({ email: email.toLowerCase() });

    const lastUser = await Users.findOne().sort({ id: -1 });
    const nextId = lastUser ? lastUser.id + 1 : 1;
    console.log(otp);
    const newUser = new Users({
      id: nextId,
      name: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      otp,
      pincode,
      region: city
    });
    await newUser.save();

    req.session.userEmail = email.toLowerCase();

    await transporter.sendMail({
      from: "boligilivishnuvardhan@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `<p>Verification Code: ${otp}</p>`
    });

    res.status(201).json({ success: true, message: "OTP generated successfully" });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// OTP GET & VERIFY
router.get('/otp', requireRegisterSession, (req, res) => {
  res.status(200).json({ success: true, email: req.session.userEmail });
});

router.post('/otp', requireRegisterSession, async (req, res) => {
  const { otp } = req.body;
  try {
    const email = req.session.userEmail;
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (String(user.otp) !== String(otp)) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    await Users.findOneAndUpdate({ email: email.toLowerCase() }, { isVerified: true });
    delete req.session.userEmail;

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP Validation Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// FORGOT PASSWORD FLOW
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = generateOTP();
    req.session.userEmail = email.toLowerCase();
    await Users.findOneAndUpdate({ email: email.toLowerCase() }, { otp });

    await transporter.sendMail({
      from: "boligilivishnuvardhan@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Verification Code: ${otp}</p>`
    });

    res.status(201).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/forgot-otp', requireRegisterSession, async (req, res) => {
  const { otp } = req.body;
  try {
    const email = req.session.userEmail;
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (String(user.otp) !== String(otp))
      return res.status(401).json({ success: false, message: 'Invalid OTP' });

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Forgot OTP Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/password', requireRegisterSession, async (req, res) => {
  const { password } = req.body;
  try {
    const email = req.session.userEmail;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashedPassword });
    delete req.session.userEmail;

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password Update Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// PROFILE
router.post('/profile', fetchUser, async (req, res) => {
  const user = await Users.findOne({ _id: req.user.id });
  res.status(200).json({ success: true, user });
});

router.post('/edit', fetchUser, async (req, res) => {
  const { name, image } = req.body;
  try {
    await Users.findOneAndUpdate({ _id: req.user.id }, { name, image });
    res.status(200).json({ success: true, message: "User data updated successfully" });
  } catch (err) {
    console.error('Edit Error:', err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
