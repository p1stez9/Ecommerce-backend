const prisma = require('../config/prisma')

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

        console.log(email,password)
        res.send('Hello Register In Controller')
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
        res.send('Hello Login In Controller')
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

