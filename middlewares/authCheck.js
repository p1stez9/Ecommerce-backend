const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')


exports.authCheck = async (req,res,next) => {
    try {
        //code
        const headerToken = req.headers.authorization
        if(!headerToken) {
            return res.status(401).json({
                message: 'No Token, Authorization'
            })
        }
        const token = headerToken.split(" ")[1] // เอาแต่ token ออกมา
        // ทำการ verify token ถ้าผิดมันจะ token invalid
        const decode = jwt.verify(token,process.env.SECRET)
        req.user = decode


        const user = await prisma.user.findFirst({
            where: {
                email: req.user.email
            }
        })
        if(!user.enable) {
            return res.status(401).json({
                message: 'This account cannot access'
            })
        }


        next() // next เป็นเหมือนตำรวจตั้งด่าน เช็ค55555
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Token Invalid'
        })
    }
}

exports.adminCheck = async (req,res,next) => {
    try {
        const { email } = req.user // req.user มาจากข้างบน อารมณ์แบบข้อมูล user วิ่งไปตลอด
        const adminUser = await prisma.user.findFirst({
            where: {
                email: email
            }
            // จริงๆไอ email ที่มันอยู่ใน adminUser มันก็คือ req.user ที้เหมือนอันข้างบนอ่ะแหละ
        })
        if(!adminUser || adminUser.role != 'admin') {
            return res.status(403).json({
                message: 'Acess Denied: Admin Only'
            })
        } 
        // console.log('admin check',adminUser) // จริงๆไอ email ที่มันอยู่ใน adminUser มันก็คือ req.user ที้เหมือนอันข้างบนอ่ะแหละ
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error Admin access denied'
        })
    }
}