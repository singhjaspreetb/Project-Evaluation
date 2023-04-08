import Student from "../model/Student.js"
import Mentor from "../model/Mentor.js"
import Phase from "../model/Phase.js";

/* add new student */
export const addNewStudent = async(req,res) =>{
    try{
        const {
            stu_id,
            name,
            email,
            project_id,
        } = req.body;

        const temps = await (Student.findOne({email:email}))
        let temp_s;
        if (temps) {
            const student = await (Student.findOne({stu_id:stu_id}))
            if (student) return res.status(400).json({msg : "Student already exist."});
            temp_s=student;
        }
        else {
            temp_s=temps;
        }
        const student= temp_s;
        if (student) return res.status(400).json({msg : "Student already exist."});
    
        const newStudent = new Student({
            stu_id,
            name,
            email,
            project_id,
            mentor_id:"-",
            phase_cmp:0,
            phase_ids:[],
        });
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
}


/* assign student */
export const assignStudent = async(req,res) =>{
    try{
        const {
            stu_id,
            email,
            mentor_id,
            mentor_email
        } = req.body;

        const temps = await (Student.findOne({email:email}))
        let temp_s;
        if (!temps) {
            const student = await (Student.findOne({stu_id:stu_id}))
            if (!student) return res.status(400).json({msg : "Student does not exist."});
            temp_s=student;
        }
        else {
            temp_s=temps;
        }
        const student= temp_s;
        if (!student) return res.status(400).json({msg : "Student does not exist."});

        if(student.mentor_id!="-") return res.status(400).json({msg : "Alrealy Assigned"});

        const temp = await (Mentor.findOne({email:mentor_email}))
        let temp_m;
        if (!temp) {
            const mentor = await (Mentor.findOne({emp_id:mentor_id}))
            if (!mentor) return res.status(400).json({msg : "Mentor does not exist."});
            temp_m=mentor;
        }
        else {
            temp_m=temp;
        }
        const mentor= temp_m;
        if (!mentor) return res.status(400).json({msg : "Mentor does not exist."});
        if(mentor.no_stu>3) return res.status(400).json({msg : "Alrealy Have Enough Student"});
        
        mentor.no_stu++;
        mentor.stu_ids.push(stu_id);
        await mentor.save();

        student.mentor_id=mentor_id;
        await student.save();
        delete mentor.password;
        res.status(201).json({student:student,mentor:mentor});
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
}

/* update student */
export const updateStudent = async(req,res) =>{
    try{
        const {
            stu_id,
            email,
            phase_name,
            marks,
        } = req.body;

        const temps = await (Student.findOne({email:email}))
        let temp_s;
        if (!temps) {
            const student = await (Student.findOne({stu_id:stu_id}))
            if (!student) return res.status(400).json({msg : "Student does not exist."});
            temp_s=student;
        }
        else {
            temp_s=temps;
        }
        const student= temp_s;
        if (!student) return res.status(400).json({msg : "Student does not exist."});
        
        if(student.phase_cmp>3) return res.status(400).json({msg : "Phases Completed"});

        student.phase_cmp++;
        const newPhase = new Phase({
            phase_id:student.stu_id+"_ph"+student.phase_cmp.toString(),
            phase_name,
            marks,
        });
        const savedPhase = await newPhase.save();
        student.phase_ids.push(savedPhase.phase_id);
        await student.save();
        res.status(201).json({student:student,phase:savedPhase});
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
}


/* update phase */
export const updatePhase = async(req,res) =>{
    try{
        const {
            phase_id,
            phase_name,
            marks,
        } = req.body;

        const phase = await (Phase.findOne({phase_id:phase_id}))
        if (!phase) return res.status(400).json({msg : "Phase does not exist."});
            
        phase.marks=marks;
        await phase.save();
        res.status(201).json({phase:phase});
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
}

/* get student*/
export const getStudent = async (req,res)=>{
    try{
        const {stu_id}=req.params;
        const student = await Student.findOne({stu_id:stu_id});
        res.status(200).json(student);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}

/* get all students */
export const getStudents = async (req,res)=>{
    try{
        const student = await Student.find({mentor_id:"-"});
        res.status(200).json(student);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}

/* get all students */
export const getMentorStudents = async (req,res)=>{
    try{
        const {mentor_id}=req.params;
        const student = await Student.find({mentor_id:mentor_id});
        res.status(200).json(student);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}


/* delete student*/
export const deleteStudent = async (req,res)=>{
    try{
        const {stu_id}=req.params;
        const student = await Student.findOne({stu_id:stu_id});
        if(student.mentor_id!="-") return res.status(400).json({msg : "Student can not be deleted"});
        await Student.deleteOne({stu_id:stu_id});
        res.status(200).json(student);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}

/* remove student*/
export const removeStudent = async (req,res)=>{
    try{
        const {stu_id}=req.params;
        const student = await Student.findOne({stu_id:stu_id});
        for (let i = 0; i < student.phase_cmp; i++){
            await Phase.deleteOne({phase_id:student.phase_ids[i]});
        }

        const mentor = await Mentor.findOne({emp_id:student.mentor_id});
        mentor.stu_ids = mentor.stu_ids.filter(item => item !== stu_id)
        mentor.no_stu--;

        student.mentor_id="-";
        student.phase_cmp=0;
        student.phase_ids=[];
        await student.save();

        await mentor.save();
        delete mentor.password;
        res.status(200).json({student:student,mentor:mentor});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}
