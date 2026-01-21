import Report from "../models/report.model.js";
import { generateMedicalSummary } from "../services/ai.service.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import fs from "fs";
import path from "path";


//  UPLOAD REPORT

export const uploadReport = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  const report = await Report.create({
    userId: req.user.id,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: req.file.path,
    fileType: req.file.mimetype.startsWith("image") ? "image" : "pdf",
  });

  res.status(201).json({
    success: true,
    message: "Report uploaded successfully",
    report,
  });
});


//  GET MY REPORTS 

export const getMyReports = catchAsync(async (req, res, next) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Number(req.query.limit) || 5);
  const skip = (page - 1) * limit;

  const filter = { userId: req.user.id };

  const [reports, total] = await Promise.all([
    Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Report.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    items: reports,
  });
});


//  DOWNLOAD REPORT

export const downloadReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new AppError("Report not found", 404));
  }

  // ownership check
  if (report.userId.toString() !== req.user.id) {
    return next(new AppError("Access denied", 403));
  }

  const filePath = path.resolve(report.filePath);

  if (!fs.existsSync(filePath)) {
    return next(new AppError("File not found on server", 404));
  }

  res.download(filePath, report.originalName);
});

export const runAIOnReport = catchAsync(async (req, res, next) => {
  const { reportId, reportText } = req.body

  const report = await Report.findById(reportId)

  if (!report) {
    return res.status(404).json({
      status: "fail",
      message: "Report not found"
    })
  }

  report.status = "processing";
  report.aiError = null;
  await report.save();

  const aiOutput = await generateMedicalSummary(reportText);

  report.aiOutput = aiOutput;
  report.status = "completed"
  await report.save();

  res.status(200).json({
    status: "success",
    message: "AI analysis completed",
    data: {
      reportId: report._id,
      aiOutput: report.aiOutput
    }
  })

})