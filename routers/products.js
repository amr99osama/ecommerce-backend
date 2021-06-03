const {
    Product
} = require('../models/product')
const {
    Category
} = require('../models/category');
const express = require('express');
const routers = express.Router();
const mongoose = require('mongoose');
// Multer Library for uplaoding Files 
const multer = require('multer');

const FILE_TYPES = {
    // using MIME TYPES type/subtype
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPES[file.mimetype];
        let uploadError = new Error("Invalid Upload type")
        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        const extension = FILE_TYPES[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})




const upload = multer({
    storage: storage
})



// express http request for GET method
// use async/await for asynchronous Method
routers.get(`/`, async (req, res) => {
    // http://localhost:3000/api/v1/products?categories=1234556,5556565
    let filter = {};
    if (req.query.categories) {
        filter = {
            category: req.query.categories.split(',')
        }
    }
    const productList = await Product.find(filter).catch(error => {
        throw error;
    });
    if (!productList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
});

// get product by id
routers.get(`/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send("Invalid Product ID")
    }
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
        res.status(500).json({
            success: false,
            message: "Product is not found"
        })
    }
    console.log("The Selected ID is " + product);
    res.send(product)
});

routers.post(`/`, upload.single('image'), async (req, res) => {
    // here to push attributes data to database using POST HTTP REQUEST
    //// WE HAVE TO CHECK category ID is already valid
    const category = await Category.findById(req.body.category).catch(error => {
        throw error;
    })
    const file = req.file;
    if (!file) {
        return res.status(400).send("No File Inserted !!")

    }
    if (!category) {
        return res.status(400).send("Invalid category")
    }
    const fileName = req.file.filename;
    // http://localhost:3000/public/uploads/image.jpg
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        RichDescription: req.body.RichDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        NumberInStock: req.body.NumberInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
    })
    //save database
    // use it as Promise()
    product = await product.save();
    if (!product)
        return res.status(400).send("The Product failed to be added")
    res.send(product);
});



//update product by ID 

routers.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send("Invalid Product ID")
    }
    const category = await Category.findById(req.body.category).catch(error => {
        throw error;
    })
    if (!category) {
        return res.status(400).send("Invalid category")
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            description: req.body.description,
            RichDescription: req.body.RichDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            NumberInStock: req.body.NumberInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
        }, {
            new: true
        }
    )
    if (!product) {
        return res.status(404).send("The Product is not updated");
    }
    res.send(product);
    console.log("The Product updated Successfully");

})
routers.delete(`/:id`, async (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "category not found !"
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "category is deleted successfully !!"
            })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            message: "Invalid Category",
            error: err
        })
    })
})


/// Get Products count
routers.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)
    if (!productCount) {
        res.status(500).json({
            success: false,
            message: "Prodcut is not found"
        })
    }
    res.send({
        count: productCount
    })
});


// find the featured products only and only accept the first count (1,2,3)
routers.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const product = await Product.find({
        isFeatured: true,
    }).limit(Number(count))
    if (!product) {
        res.status(500).json({
            success: false,
            message: "Prodcut is not found"
        })
    }
    res.send(product)
});

// find the featured products only and only accept the first count (1,2,3)
routers.get(`/get/featured`, async (req, res) => {
    const product = await Product.find({
        isFeatured: false,
    })
    if (!product) {
        res.status(500).json({
            success: false,
            message: "Prodcut is not found"
        })
    }
    res.send(product)
});



// add multiple images for product . using update api
// max images to uplaod is 10
routers.put(
    '/gallery/:id',
    upload.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id, {
                images: imagesPaths
            }, {
                new: true
            }
        );

        if (!product)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(product);
    }
);
module.exports = routers;