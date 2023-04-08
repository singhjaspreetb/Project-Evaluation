import mongoose from "mongoose";

const MentorSchema = new mongoose.Schema(
    {
        emp_id : {
            type : String,
            require : true,
            unique : true,
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
        password : {
            type : String,
            require : true,
            min : 5,
        },
        no_stu : {
            type : Number,
            default:0,
        },
        stu_ids : {
            type : Array,
            default:[],
        },
    },
    { timestamps : true },
);

const Mentor = mongoose.model("Mentor",MentorSchema);
export default Mentor;