exports.create = async (req,res) => {
    try {
        //code
        res.send('Hello Category')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.list = async (req,res) => {
    try {
        //code
        res.send('Hello Category List')
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
        console.log(id)
        res.send('Hello Category Remove')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

