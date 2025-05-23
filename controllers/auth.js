const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req,res) => {
    // code
    try {
        //code

        // Step 1 Validate body
        const { email, password } = req.body
        if(!email) {
            return res.status(400).json({
                message: "Email is required!!"
            })
        }
        if(!password) {
            return res.status(400).json({
                message: "Password is required!!"
            })
        }

        // Step 2 Check Email in DB already ?
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(user) { // ถ้ามีข้อมูล
            return res.status(400).json({
                message: "Email already exits!!"
            })
        }
        
        // Step 3 HashPassword ทำให้รหัสไม่โดน hack เวลาเข้ารหัสมันจะเป็นอักขระมั่วๆ
        const hashPassword = await bcrypt.hash(password,10)
        console.log(hashPassword)

        // Step 4 Register
        await prisma.user.create({
            data:{
                email: email,
                password: hashPassword
            }
        })

        res.send('Register Success')
    } catch (error) {
        // error
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.login = async (req,res) => {
    // code
    try {
        //code
        const { email, password } = req.body

        // Step 1 Check Email
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if(!user || !user.enable) {
            return res.status(400).json({
                message: 'User Not found or not Enabled'
            })
        }

        // Step 2 Check password
        const isMatch = await bcrypt.compare(password, user.password) // มี password 2 ตัว ตัวนึงมาจากตรง user กับอีกตัวมาจาก database user
        if(!isMatch) {
            return res.status(400).json({
                message: 'Password Invalid!!'
            })
        }
        // Step 3 Create Payload
        // ทำตัว payload เป็น object เพื่อที่จะเอาไปยัดในตัว token เวลาแสดงจะได้ออกมาทีเดียว
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        // Step 4 Generate Token
        // จะหมดอายุใน 1 วัน
        jwt.sign(payload,process.env.SECRET,{ expiresIn:'1d' },(error,token) => {
            if(error) {
                return res.status(500).json({
                    message: "Server Error"
                })
            }
            // ตัว token เอาไว้แบบแยกพวก admin กับ user เวลาเข้ามาใหม่ user จะเป็นหน้าของ user เอง
            // admin ก็เป็นของ admin เอง
            res.json({ payload,token })
        })


    } catch (error) {
        // error
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.currentUser = async (req,res) => {
    try  {
        // code
        res.send('Hello Current User')
    } catch (error) {
        // error
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

