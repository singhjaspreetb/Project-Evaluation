import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Mentor from "../model/Mentor.js";

/* Register Mentor */
export const register = async(req,res) =>{
    try{
        const {
            emp_id,
            name,
            email,
            password,
        } = req.body;
        
        let temp_m;
        if (!temp) {
            const mentor = await (Mentor.findOne({emp_id:emp_id}))
            if (!mentor) return res.status(400).json({msg : "User already exist."});
            temp_m=mentor;
        }
        else {
            temp_m=temp;
        }
        const mentor= temp_m;
        if (mentor) return res.status(400).json({msg : "User already exist."});

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const newMentor = new Mentor({
            emp_id,
            name,
            email,
            password:passwordHash,
            no_stu:0,
            stu_ids:[],
        });
        const savedMentor = await newMentor.save();
        res.status(201).json(savedMentor);
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
}

/* Logging Mentor */
export const login = async (req,res) => {
    try{
        const {emp_id,email,password}= req.body;
        const temp = await (Mentor.findOne({email:email}))
        let temp_m;
        if (!temp) {
            const mentor = await (Mentor.findOne({emp_id:emp_id}))
            if (!mentor) return res.status(400).json({msg : "User does not exist."});
            temp_m=mentor;
        }
        else {
            temp_m=temp;
        }
        const mentor= temp_m;
        const isMatch = await bcrypt.compare(password,mentor.password);
        if(!isMatch) return res.status(400).json({msg : "Invalid Credentials !"});

        const token = jwt.sign({id:mentor._id},process.env.JWT_SECRET);
        delete mentor.password;
        res.status(200).json({token,mentor});
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
}