const prisma = require("../config/prisma")

exports.changeOrderStatus = async (req,res) => {
    try {
        const { orderId, orderStatus } = req.body
        //console.log(orderId, orderStatus)
        const orderUpdate = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                orderStatus: orderStatus
            }
        })

        res.json(orderUpdate)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
}

exports.getOrderAdmin = async (req,res) => {
    try {
        // เอาข้อมูลของ product มา
        const orders = await prisma.order.findMany({
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                // เลือกว่าจะเอาอะไรออกมาใน postman ด้วย เพราะว่าถ้าไม่เลือก password จะหลุดออกมาหมดเลย
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        address: true
                    }
                }
            }
        })


        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
}