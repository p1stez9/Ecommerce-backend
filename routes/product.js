const express = require('express')
const { create, list , read ,remove , update , listby, searchFilters } = require('../controllers/product')
const router = express.Router()

// @ENDPOINT http//localhost:5001/api/product
router.post('/product', create)
router.get('/products/:count', list) // สิ้นค้าหลายชิ้น เตรียมเป็น count เอาเลย
router.put('/product/:id', update)
router.get('/product/:id', read) // อ่านแค่สิ้นค้าชนิดเดียว
router.delete('/product/:id', remove)
router.post('/productby', listby)
router.post('/search/filters', searchFilters)


module.exports = router