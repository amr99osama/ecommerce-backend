const {
    Category
} = require('../models/category')
const express = require('express');
const routers = express.Router();
// express http request for GET method
// use async/await for asynchronous Method


/// Read All Categories
routers.get(`/`, async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        res.status(500).json({
            success: false,
        })
    }
    res.send(categoryList)
});

/// Read single Category by id
routers.get(`/:id`, async (req, res) => {
    const categoryList = await Category.findById(req.params.id);
    if (!categoryList) {
        res.status(500).json({
            success: false,
            message: "Category is not found"
        })
    }
    console.log("The Selected ID is " + categoryList);
    res.send(categoryList)
});




//Add New Category 
routers.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon
    });
    category = await category.save();
    if (!category) {
        return res.status(404).send("The Category is not created");
    }
    res.send(category);
    console.log("The Category Created Successfully");
});


// Delete Category By ID
routers.delete(`/:id`, async (req, res) => {
    await Category.findByIdAndRemove(req.params.id)
    if (!Category) {
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

});


// update the category attributes 
routers.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }, {
            new: true
        }
    )
    if (!category) {
        return res.status(404).send("The Category is not updated");
    }
    res.send(category);
    console.log("The Category updated Successfully");

})

module.exports = routers;