import express from "express";
import protect from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
} from "../controllers/resumeController.js";

const resumeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Resume management APIs
 */

/**
 * @swagger
 * /api/resumes/create:
 *   post:
 *     summary: Create a new resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer Resume
 *     responses:
 *       201:
 *         description: Resume created successfully
 */
resumeRouter.post("/create", protect, createResume);

/**
 * @swagger
 * /api/resumes/update:
 *   put:
 *     summary: Update resume details and upload profile image
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resumeId:
 *                 type: string
 *               resumeData:
 *                 type: string
 *                 description: Resume JSON string
 *               image:
 *                 type: string
 *                 format: binary
 *               removeBackground:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Resume updated successfully
 */
resumeRouter.put(
  "/update",
  protect,
  upload.single("image"),
  updateResume
);

/**
 * @swagger
 * /api/resumes/delete/{resumeId}:
 *   delete:
 *     summary: Delete a resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 */
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);

/**
 * @swagger
 * /api/resumes/get/{resumeId}:
 *   get:
 *     summary: Get resume by ID (private)
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume fetched successfully
 */
resumeRouter.get("/get/:resumeId", protect, getResumeById);

/**
 * @swagger
 * /api/resumes/public/{resumeId}:
 *   get:
 *     summary: Get public resume (no authentication)
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public resume fetched successfully
 */
resumeRouter.get("/public/:resumeId", getPublicResumeById);

export default resumeRouter;
