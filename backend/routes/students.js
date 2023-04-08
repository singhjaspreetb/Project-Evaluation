import express from "express";
import {assignStudent,addNewStudent,getStudents,getStudent,getMentorStudents,updateStudent,updatePhase,removeStudent,deleteStudent} from "../controllers/students.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

/* add student */
router.post("/add",addNewStudent);

/* read student */
router.get("/get/:stu_id",getStudent);
router.get("/getmentors/:mentor_id",getMentorStudents);
router.get("/gets",getStudents);

// /* update student */
router.put("/assignStudent",assignStudent);
router.put("/update",updateStudent);
router.put("/update/phase",updatePhase);

// /* remove student */
router.delete("/remove/:stu_id",removeStudent);
router.delete("/delete/:stu_id",deleteStudent);

export default router;
