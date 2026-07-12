const Report = require('../models/Report');

const createReport = async (req, res) => {
  const { title, description, imageUrl, category } = req.body;
  try {
    const report = await Report.create({ postedBy: req.user._id, title, description, imageUrl, category });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('postedBy', 'username role').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const voteReport = async (req, res) => {
  const { voteType } = req.body;
  const userId = req.user._id;
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.upvotes = report.upvotes.filter(id => id.toString() !== userId.toString());
    report.downvotes = report.downvotes.filter(id => id.toString() !== userId.toString());

    if (voteType === 'upvote') report.upvotes.push(userId);
    if (voteType === 'downvote') report.downvotes.push(userId);

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const commentReport = async (req, res) => {
  const { text } = req.body;
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.comments.push({ user: req.user._id, username: req.user.username, text });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const flagReport = async (req, res) => {
  const { flag } = req.body;
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.moderatorFlag = flag;
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyReport = async (req, res) => {
  const { status } = req.body;
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.authorityStatus = status;
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getReports, voteReport, commentReport, flagReport, verifyReport };