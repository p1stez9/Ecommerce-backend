const prisma = require("../config/prisma")

// post in postman
exports.create = async (req,res) => {
    try {
        //code
        const { name } = req.body  
        // prisma.ชื่อtableของdatabase.function
        const category = await prisma.category.create({
            data:{
                name: name
            }
        })

        res.send(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

// get in postman
exports.list = async (req,res) => {
    try {
        //code
        const category = await prisma.category.findMany()
        res.send(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.remove = async (req,res) => {
    try {
        //code
        const { id } = req.params // params คือดู id ได้
        const category = await prisma.category.delete({
            where:{ 
                id: Number(id) // คือข้อมูล id มันส่งมาเป็น string เราต้องทำให้มันเป็น number ก่อน
             }
        })
        res.send(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

