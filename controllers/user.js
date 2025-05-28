const prisma = require("../config/prisma")

exports.listUsers = async (req,res) => {
    try {
        // code
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                enable: true,
                address: true
            }
        })
        res.send(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.changeStatus = async (req,res) => {
    try {
        // code
        const { id, enabled } = req.body
        console.log(id, enabled)
        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                enable: enabled
            }
        })


        res.send('Update Status Success')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.changeRole = async (req,res) => {
    try {
        // code
        const { id, role } = req.body
        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                role: role
            }
        })
        res.send('Hello changeRole')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.userCart = async (req,res) => {
    try {
        // code
        const { cart } = req.body
        console.log(cart)
        console.log(req.user.id)

        const user = await prisma.user.findFirst({
            where: {
                // req.user.id มาจาก token หรือ middleware ที่แนบข้อมูล user ไว้
                // ต่างจาก id มาจาก req.body ของอัน changeRole
                id: Number(req.user.id)
            }
        })
        // console.log(user)
        // เราจะต้องลบข้อมูลเก่าก่อนเพื่อมี่จะเพิ่มข้อมูลใหม่
        await prisma.productOnCart.deleteMany({
            where: {
                // เอาตระกล้าของ user คนไหน
                cart: {
                    // ทำไมถึงไม่ใช้ req.user.id
                    // เพราะ user.id คือค่าที่เชื่อถือได้จากฐานข้อมูล แต่ของ req.user.id มันดึงมาจาก jwt
                    orderedById: user.id
                }
            }
        }),
        // ลบตระกล้าเก่า
        await prisma.cart.deleteMany({
            where: {
                orderedById: user.id
            }
        })

        // เตรียมสินค้า
        // item คือสินค้านะจ๊ะ
        let products = cart.map((item) => ({
            productId: item.id,
            count: item.count,
            price: item.price
        }))

        // หาผลรวม
        let cartTotal = products.reduce((sum, item) => 
            sum + item.price * item.count, 0)


        console.log(cartTotal)

        res.send('Hello userCart')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.getUserCart = async (req,res) => {
    try {
        // code
        res.send('Hello getUserCart')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.emptyCart = async (req,res) => {
    try {
        // code
        res.send('Hello emptyCart')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.saveAddress = async (req,res) => {
    try {
        // code
        res.send('Hello saveAddress')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.saveOrder = async (req,res) => {
    try {
        // code
        res.send('Hello saveOrder')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.getOrder = async (req,res) => {
    try {
        // code
        res.send('Hello getOrder')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}
