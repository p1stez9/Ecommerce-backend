const prisma = require("../config/prisma")

// post in postman
exports.create = async (req, res) => {
    try {
        //code
        const { title, description, price, quantity, categoryId, images } = req.body
        // console.log(title,description,price,quantity,images)
        const product = await prisma.product.create({
            data: {
                // ฝั่งซ้ายจาก database ฝั่งขวาจาก frontend
                title: title,
                description: description,
                price: parseFloat(price), // ต้องแปลงด้วยนะ
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        // คือ 1 product เนี่ยมันมีได้หลายรูปก็เลยใช้การ map เพื่อที่จะเอารูปจาก frontend มาให้หมดเลย
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url_id,
                        secure_url: item.secure_id
                    }))
                }
            }
        })
        res.send(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

// post in postman
exports.list = async (req, res) => {
    try {
        //code
        const { count } = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count), // กำหนดให้ว่าอยากดูสินค้ากี่ชิ้นโดยการใช้ params ใส่ count แต่ตอนแรกที่ใส่ค่ามันจะเป็น string ให้เเปลี่ยนเป็น int
            orderBy: {
                createdAt : "desc" // เรียงจากมากไปน้อย อะไรที่ถูกเพิ่มล่าสุดก็จะอยู่ด้านบน
            }, 
            include: {
                category: true, // ใช้ include จะทำการเพิ่มข้อมูลของ category เข้ามาแสดงว่าสินค้านี้ประเภทนี้นะ
                images: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

// post in postman
exports.read = async (req, res) => {
    try {
        //code
        const { id } = req.params
        // อ่านสินค้าแค่ชนิดเดียว
        const products = await prisma.product.findFirst({ 
            where: {
                id: Number(id)
            },
            include: {
                category: true, // ใช้ include จะทำการเพิ่มข้อมูลของ category เข้ามาแสดงว่าสินค้านี้ประเภทนี้นะ
                images: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}


// post in postman
exports.remove = async (req, res) => {
    try {
        //code
        const { id } = req.params

        // หนังชีวิต


        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
        res.send('Delete Success')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

// ทำเหมือนๆ create เลย
exports.update = async (req, res) => {
    try {
        //code
        const { title, description, price, quantity, categoryId, images } = req.body
        // console.log(title,description,price,quantity,images)

        // clear images ถ้าจะ update มันต้องลบรูปก่อน เพื่อที่จะ loop เข้าไปใหม่
        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id)
            }
        })

        const product = await prisma.product.update({
            where: { // ต้อง serch id ก่อนแล้วถึงจะ update ได้
                id: Number(req.params.id)
            },
            data: {
                // ฝั่งซ้ายจาก database ฝั่งขวาจาก frontend
                title: title,
                description: description,
                price: parseFloat(price), // ต้องแปลงด้วยนะ
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        // คือ 1 product เนี่ยมันมีได้หลายรูปก็เลยใช้การ map เพื่อที่จะเอารูปจาก frontend มาให้หมดเลย
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url_id,
                        secure_url: item.secure_id
                    }))
                }
            }
        })
        res.send(product)
    } catch (error) {
        res.status(400).json({
            message: "Server Error"
        })
    }
}

// post in postman
exports.listby = async (req, res) => {
    try {
        //code
        const { sort, order, limit } = req.body
        console.log(sort, order, limit)
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: {
                [sort]: order
            },
            include: {
                category: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

// function เกี่ยวกับการหาชื่อที่เราพิมพ์ไป ถ้าไม่มีก็จะไม่ขึ้น
const handleQuery = async (req,res,query) => {
    try{
        // code
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query, // contains คือการเอาสิ่งที่เราพิมพ์มา
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (error) {
        // error
        console.log(error)
        res.status(500).json({
            message: 'Search Error'
        })
    }
}

const handlePrice = async (req,res,priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    // เวลาใส่ค่าเงิน 2 ค่า มันจะเป็น array ช่องที่ 0 กับ 1 เลยใช้เป็นแบบนี้
                    gte: priceRange[0],
                    lte: priceRange[1]
                },
            },
            include: {
                    category: true,
                    images: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Price Error'
        })
    }
}

const handleCategory = async (req,res,categoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((id) => Number(id)) // ทำการ map เพราะไม่ได้หาอันเดียว
                },
            },
            include: {
                    category: true,
                    images: true
            }
        })
        res.send(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Price Error'
        })
    }
}


// post in postman
exports.searchFilters = async (req, res) => {
    try {
        //code
        const { query, category, price } = req.body

        if(query) {
            console.log('query -> ', query)
            await handleQuery(req,res,query) // มันจะมาทำ function นี้
        }
        if(category) {
            console.log('category -> ', category)
            await handleCategory(req,res,category)
        }
        if(price) {
            console.log('price -> ', price)
            await handlePrice(req,res,price)
        }

        // res.send('Hello searchFilters Product')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}


