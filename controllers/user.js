exports.listUsers = async (req,res) => {
    try {
        // code
        res.send('Hello Users')
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
        res.send('Hello changeStatus')
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
