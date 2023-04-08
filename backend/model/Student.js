import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
    {
        stu_id : {
            type : String,
            require : true,
            max : 10,
        },
        name : {
            type : String,
            require : true,
            min : 5,
            max : 100,
        },
        email : {
            type : String,
            require : true,
            max : 100,
            unique : true,
        },
        project_id : {
            type : String,
            require : true,
            max : 10,
        },
        mentor_id : {
            type : String,
            require : true,
            max : 10,
        },
        phase_cmp : {
            type : Number,
            default : 0,
        },
        phase_ids : {
            type : Array,
            default:[],
        },
    },
    { timestamps : true },
);

const Student = mongoose.model("Student",StudentSchema);
export default Student;