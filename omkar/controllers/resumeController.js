// resumeController.js
import imagekit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import mongoose from "mongoose";
import fs from "fs";

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

        // Validate resumeId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ success: false, message: 'Invalid resume ID' });
        }

        const deleted = await Resume.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(resumeId),
            userId: new mongoose.Types.ObjectId(userId)
        });
        if (!deleted) return res.status(404).json({ success: false, message: "Resume not found or unauthorized" });

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

        // Validate resumeId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ success: false, message: 'Invalid resume ID' });
        }

        const resume = await Resume.findOne({
            _id: new mongoose.Types.ObjectId(resumeId),
            userId: new mongoose.Types.ObjectId(userId)
        }).select('-__v -createdAt -updatedAt');

        if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

        return res.status(200).json({ success: true, resume });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        // Validate resumeId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ success: false, message: 'Invalid resume ID' });
        }

        const resume = await Resume.findOne({
            _id: new mongoose.Types.ObjectId(resumeId),
            public: true
        });

        if (!resume) return res.status(404).json({ success: false, message: "Public resume not found" });
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

        // Validate resumeId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ success: false, message: 'Invalid resume ID' });
        }

        let resumeDataObj;
        if (typeof resumeData === 'string') {
            resumeDataObj = JSON.parse(resumeData)

        } else {
            resumeDataObj = structuredClone(resumeData)
        }

        // if (image) {
        //     // Since we use memoryStorage, we pass the buffer directly to ImageKit
        //     try {
        //         const response = await imagekit.upload({
        //             file: image.buffer, // memoryStorage provides a buffer, not a path
        //             fileName: `resume_${resumeId}.png`,
        //             folder: 'user-resumes',
        //             transformation: {
        //                 pre: `w-300,h-300,fo-face${removeBackground === 'true' ? ',e-bgremove' : ''}`
        //             }
        //         });

        //         // Ensure personal_info object exists before assigning
        //         if (!resumeDataObj.personal_info) resumeDataObj.personal_info = {};
        //         resumeDataObj.personal_info.image = response.url;
        //     } catch (imageError) {
        //         console.error("ImageKit upload error:", imageError);
        //         return res.status(400).json({ success: false, message: 'Image upload failed: ' + imageError.message });
        //     }
        // }
        if(image){
            const imageBufferData = fs.createReadStream(image.path)
            const response = await imagekit.files.upload({
                            file: imageBufferData,
                            filename: 'resume.png',
                            folder: 'user-resumes',
                            transformation : {
                                pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
                            }

            })
            resumeDataObj.personal_info.image = response.url
        }

        // findByIdAndUpdate takes an ID string as the first argument, not an object.
        // We use findOneAndUpdate to ensure the userId also matches for security.
        const resume = await Resume.findByIdAndUpdate({userId, _id: resumeId},resumeDataObj, {new: true})

        return res.status(200).json({message: 'Saved successfully', resume});
    } catch (error) {

        return res.status(400).json({message: error.message });
    }
};