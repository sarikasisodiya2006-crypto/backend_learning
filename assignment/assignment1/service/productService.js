const { productModel } = require("../model");

// =============== Create Product =================

const createProductService = async (data) => {
    const productExist = await productModel.findOne({ SKU: data.SKU });

    if (productExist) {
        throw new Error("Product with this SKU already exists");
    }

    const product = {
        name: data.name,
        price: data.price,
        category: data.category,
        SKU: data.SKU,
    };

    await productModel.create(product);

    return "Product created successfully!";
};

// =============== Get Products =================

const getProductService = async (page, limit, sort) => {

    const products = await productModel.find({})
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ price: sort === "asc" ? 1 : -1 })
        .select("-_id -__v -SKU");

    return products;
};

// =============== Delete Product =================

const deleteProductService = async (sku) => {

    const product = await productModel.findOne({ SKU: sku });

    if (!product) {
        throw new Error("Product not found");
    }

    await productModel.deleteOne({ SKU: sku });

    return "Product deleted!";
};

// =============== Update Product =================

const updateProductService = async (sku, data) => {

    const updatedProduct = await productModel.findOneAndUpdate(
        { SKU: sku },
        { $set: data },
        { returnDocument: "after" }
    );

    if (!updatedProduct) {
        throw new Error("Product not found");
    }

    return updatedProduct;
};

module.exports = {
    createProductService,
    getProductService,
    deleteProductService,
    updateProductService,
};