// Step 1 import
const express = require('express')
const app = express()
const morgan = require('morgan')
// เป็นการเก็บแบบ array นะ
const { readdirSync } = require('fs') // เป็นการเข้าไปอ่านใน directory เลยไม่ต้องมานั่ง import เยอะแยะให้มันรกในไฟล์ของ routes
const cors = require('cors')
// const authRouter = require('./routes/auth')
// const categoryRouter = require('./routes/category')

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
// app.use('/api', authRouter) // อันนี้ทำการแยกไฟล์ให้มันไม่เยอะในไฟล์เดียว มาจาก auth.js
// app.use('/api', categoryRouter)

// ทำการ loop import
readdirSync('./routes').map((item) => app.use('/api', require('./routes/' + item)))

// Step 3 Router
// app.post('/api',(req,res) => {
//     // code
//     const { username,password } = req.body // อันนี้เรียกว่าเป็นการ restructering
//     console.log(username,password)
//     res.send('Jukkruss')
// })


// Step 2 start server
app.listen(5001,() => console.log('Server is running at port 5001'))






