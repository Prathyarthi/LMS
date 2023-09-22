import Course from "../models/course.model.js";
import AppError from "../utils/appError.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select('-lectures');
        res.status(200).json({
            success: true,
            message: 'All courses',
            courses
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const getCoursesByCourseId = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('Invalid course ID', 400));
        }

        res.status(200).json({
            success: true,
            message: 'Course lectures fetched!',
            lectures: course.lectures
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy } = req.body;
        if (!title || !description || !category || !createdBy) {
            return next(new AppError('All fields are required!', 400));
        }

        const course = Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: 'Dummy',
                secure_url: 'Dummy'
            }
        })

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            });
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course created!',
            course
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}


const updateCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = Course.findByIdAndUpdate(
            courseId,
            {
                $set: req.body       // Update only the details given in the req.body
            },
            {
                runValidators: true      // Please ensure that it follows the Schema and it should not skip any validations
            }
        )

        if (!course) {
            return next(new AppError('Course does not exist!', 400));
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully!',
            course
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return next(new AppError('Course does not exist!', 400));
        }

        await Course.findByIdAndDelete(courseId);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully!',
            course
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const addLectureToCourseById = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { courseId } = req.params;

        if (!title || !description) {
            return next(new AppError('All fields are required!', 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('Course doe not exist!', 400));
        }

        const lectureData = {
            title,
            description,
            lectures: {}
        }

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
            })

            if (result) {
                lectureData.lectures.public_id = public_id;
                lectureData.lectures.secure_url = secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`);
        }

        course.lectures.push(lectureData);
        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture added successfully!',
            course
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

export {
    getAllCourses,
    getCoursesByCourseId,
    createCourse,
    updateCourse,
    deleteCourse,
    addLectureToCourseById
}