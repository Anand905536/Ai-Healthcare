import Report from '../models/report.model.js';
import fs from 'fs'
import path from 'path'

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const report = await Report.create({
      userId: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype.startsWith('image') ? 'image' : 'pdf',
    });
    
    return res.status(201).json({
      message: 'Report uploaded successfully',
      report,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" })
  }
}

export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // owenership check 
    if (report.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" })
    }

    const filePath = path.resolve(report.filePath)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" })
    }
    res.download(filePath, report.originalName);

  } catch (err) {
    console.error(500).json({ message: "Download failed" })
  }
}