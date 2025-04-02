const express = require("express")
const zod = require("zod")
const {User,Account} = require("../db")
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config")
const router = express.Router()


const signUpSchema = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
})

router.post('/signup',async (req,res)=>{
    const body = req.body;

    const {success} = signUpSchema.safeParse(req.body);

    if(!success){
        return res.json({
            message : "Email already Taken/Incorrect Inputs"
        })
    }
    
    const user = User.findOne({
        username : body.username
    })
    
    if(user._id){
        return res.json({
            message : "Email already Taken/Incorrect Inputs"
        })
    }
    const dbUser = await User.create(body)
    const userId = dbUser._id
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })


    const token = jwt.sign({
        userId : dbUser._id
    },JWT_SECRET)
    res.json({
        message:"user created successfully",
        token : token
    })
})

const signinBody = zod.object({
    username : zod.string(),
    password: zod.string()
})
router.post('/signin',async (req,res)=>{
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.json({
            message : "Incorrect Inputs"
        })
    }

    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password,
    })

    if(user){
        const token = jwt.sign({
            userId : user._id
        },JWT_SECRET)

        return res.json({
            token
        })
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})


const {authMiddleware} = require("../middleware")

const updateBody = zod.object({
    password : zod.string(),
    firstname : zod.string(),
    lastname : zod.string()
})

router.put("/",authMiddleware,async (req,res)=>{
    const {success} = updateBody.safeParse(req.body)

    if(!success){
        res.status(411).json({
            message : "Error while Updating the Information"
        })
    }

    await User.updateOne({
        _id : req.userId
    },req.body)


    res.json({
        message: " Updated Successfully"
    })
})

router.get('/bulk',async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        })) 
    })
})









module.exports = router