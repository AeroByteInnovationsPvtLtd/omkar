// resumeController.js
import imagekit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";

// POST: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        const newResume = await Resume.create({ userId, title });
        return res.status(201).json({ success: true, message: 'Resume created successfully', resume: newResume });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE: /api/resumes/:resumeId
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const deleted = await Resume.findOneAndDelete({ userId, _id: resumeId });
        if (!deleted) return res.status(404).json({ message: "Resume not found or unauthorized" });

        return res.status(200).json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId }).select('-__v -createdAt -updatedAt');

        if (!resume) return res.status(404).json({ message: "Resume not found" });

        return res.status(200).json({ success: true, resume });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message }); // Fixed typo: res.ststus
    }
};

// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId });

        if (!resume) return res.status(404).json({ message: "Public resume not found" });
        return res.status(200).json({ success: true, resume });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataObj = JSON.parse(resumeData);

        if (image) {
            // Since we use memoryStorage, we pass the buffer directly to ImageKit
            const response = await imagekit.upload({
                file: image.buffer, // memoryStorage provides a buffer, not a path
                fileName: `resume_${resumeId}.png`,
                folder: 'user-resumes',
                transformation: {
                    pre: `w-300,h-300,fo-face${removeBackground === 'true' ? ',e-bgremove' : ''}`
                }
            });

            // Ensure personal_info object exists before assigning
            if (!resumeDataObj.personal_info) resumeDataObj.personal_info = {};
            resumeDataObj.personal_info.image = response.url;
        }

        // findByIdAndUpdate takes an ID string as the first argument, not an object.
        // We use findOneAndUpdate to ensure the userId also matches for security.
        const resume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId }, 
            resumeDataObj, 
            { new: true }
        );

        if (!resume) return res.status(404).json({ message: "Resume not found or unauthorized" });

        return res.status(200).json({ success: true, message: 'Saved successfully', resume });
    } catch (error) {
        console.error("Update Error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};