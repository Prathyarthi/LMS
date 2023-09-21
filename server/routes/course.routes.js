import express from 'express';
const Router = express.Router();
import { createCourse, deleteCourse, getAllCourses, getCoursesByCourseId, updateCourse, addLectureToCourseById } from '../controllers/course.controller.js'
import { isLoggedIn } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

Router
    .route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse
    )

Router
    .route('/:courseId')
    .get(isLoggedIn, authorizedRoles('ADMIN'), getCoursesByCourseId)
    .put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn, authorizedRoles('ADMIN'), deleteCourse)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('lecture'), addLectureToCourseById)


export default Router;