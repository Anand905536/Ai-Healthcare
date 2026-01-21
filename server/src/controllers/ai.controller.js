import { generateMedicalSummary } from "../services/ai.service.js";
import { catchAsync } from "../utils/catchAsync.js";


export const summerizeReport = catchAsync(async (req, resizeBy, next) => {
    const { reportText } = req.body;

    const summary = await generateMedicalSummary(reportText);

    res.status(200).json({
        status: "success",
        summary
    })
})