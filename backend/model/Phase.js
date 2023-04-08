import mongoose from "mongoose";

const PhaseSchema = new mongoose.Schema(
    {
        phase_id : {
            type : String,
            require : true,
            max : 10,
        },
        phase_name : {
            type : String,
            require : true,
            min : 5,
            max : 100,
        },
        marks : {
            type : Number,
            default : 0,
        },
    },
    { timestamps : true },
);

const Phase = mongoose.model("Phase",PhaseSchema);
export default Phase;