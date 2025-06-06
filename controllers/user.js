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


        // New cart
        const newCart = await prisma.cart.create({
            data: {
                // ที่ต้องทำแบบนี้เพราะเป็น many to many หรือ one to many
                products: { // ไอพวกนี้มันจะเข้้าไปอยู่ในตาราง many
                    create: products
                },
                cartTotal: cartTotal,
                orderedById: user.id
            }
        })

        console.log(newCart)
        res.send('Add Cart Ok')
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
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: {
                    // ต้อง include หลายรอบ เพราะจะได้ข้อมูลสินค้าจริงๆ
                    // แล้วที่มันเป็น product เฉยๆไม่มี s คือในตาราง database ตอนเชื่อมมันเป็นชื่อ product เฉยๆ
                    include: {
                        product: true
                    }
                }
            }
        })
        // console.log(cart)

        // ทำให้หัวข้อใน postman ชัดเจน
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
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
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            }
        })
        if(!cart) {
            return res.status(400).json({
                message: 'No cart'
            })
        }

        // ต้องลบ product ที่อยู่ใน cart ก่อนนะจ๊ะ
        await prisma.productOnCart.deleteMany({
            where: {
                cartId: cart.cartId
            }
        })
        const result = await prisma.cart.deleteMany({
            where: {
                orderedById: Number(req.user.id)
            }   
        })

        console.log(result)
        res.json({
            message: 'Cart Empty Success',
            deletedCount: result.count
        })
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
        const { address } = req.body
        console.log(address)
        const addressUser = await prisma.user.update({
            // ปกติเวลาจะหาอะไร จะต้องเริ่มด้วย key ก่อน
            where: {
                id: Number(req.user.id) // คือหาจาก jwt token นะจ๊ะะ
            },
            data: {
                address: address
            }
        })


        res.json({
            ok: true,
            message: 'Address update success'
        })
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
        // Step 1 Get Uesr Cart
        const userCart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            // จะต้องเอา product มาด้วยอิอิ
            include: {
                products: true
            }
        })

        // Check Cart Empty
        if(!userCart || userCart.products.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'Cart is Empty'
            })
        }

        // Check quantity
        // loop เข้าไปข้างในของ usercart ก็คือ product นั่นเอง
        for(const item of userCart.products) { // เข้าถึง object ข้างในอิอิ
            //console.log(item)
            // อันนี้เราจะเข้าไปในแต่ละรายการแล้วนะหาแบบว่าชิ้นนี้มีเท่าไหร่ หาสินค้าที่เรา loop มา
            const product = await prisma.product.findUnique({
                where: {
                    id: item.productId // ค้นหาสินค้าเดียวกัน
                },
                select: {
                    quantity: true,
                    title: true
                }
            })
            console.log(item)
            console.log(product)

            // ถ้า item ที่ซื้อมีมากกว่าปัจจุบัน
            if(!product || item.count > product.quantity) {
                return res.status(400).json({
                    ok: false,
                    message: `ขออภัย สินค้า ${product?.title || 'product'} หมด`
                })
            }
        }

        // Create a new Order
        const order = await prisma.order.create({
            data: {
                // อารมณ์คล้ายๆ cart เลย
                products: {
                    create: userCart.products.map((item) => ({
                        productId: item.productId,
                        count : item.count,
                        price : item.price
                    }))
                },
                // อันนี้คือตัว orderById
                orderedBy: {
                    connect: {
                        id: req.user.id
                    }
                },
                cartTotal: userCart.cartTotal
            }
        })

        // Update Product
        // ต้องทำเป็น userCart.products เพราะสิ้นค้าอยู่ในตระกลา้นะอิอิ
        const update =  userCart.products.map((item) => ({
            where: {
                id: item.productId,
            },
            data: {
                quantity: {
                    decrement: item.count // ทำการลดจำนวนของที่เหลือ
                },
                sold: {
                    increment: item.count //  เพิ่มจำนวนของที่ขายได้
                }
            }
        }))
        console.log(update)

        // รอทั้งหมด แล้วก็อัพเดต อันนี้ต้องดูดีๆมันยาก
        await Promise.all(
            update.map((updated) => prisma.product.update(updated))
        )

        await prisma.cart.deleteMany({
            where: {
                orderedById: Number(req.user.id)
            }
        })

        

        res.json({
            ok: true,
            order
        })
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
        const orders = await prisma.order.findMany({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })
        if(orders.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'No orders'
            })
        }

        res.json({
            ok: true,
            orders
        })

        console.log(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}
