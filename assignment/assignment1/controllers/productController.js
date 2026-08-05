const {
    createProductService,
    getProductService,
    deleteProductService,
    updateProductService,
} = require("../service/productService");

// =============== Create Product =================

const createProduct = async (req, res) => {

    try {

        const message = await createProductService(req.body);

        return res.status(201).send(message);

    } catch (err) {

        console.log(err);

        return res.status(400).send(err.message);
    }
};

// =============== Get Products =================

const getProduct = async (req, res) => {

    try {

        const { page = 1, limit = 2, sort = "asc" } = req.query;

        const products = await getProductService(page, limit, sort);

        return res.json(products);

    } catch (err) {

        console.log(err);

        return res.status(400).send(err.message);
    }
};

// =============== Delete Product =================

const deleteStudentbySKU = async (req, res) => {

    try {

        const message = await deleteProductService(req.params.sku);

        return res.status(200).send(message);

    } catch (err) {

        console.log(err);

        return res.status(400).send(err.message);
    }
};

// =============== Update Product =================

const updateProduct = async (req, res) => {

    try {

        const updatedProduct = await updateProductService(
            req.params.sku,
            req.body
        );

        return res.json(updatedProduct);

    } catch (err) {

        console.log(err);

        return res.status(400).send(err.message);
    }
};

module.exports = {
    createProduct,
    getProduct,
    deleteStudentbySKU,
    updateProduct,
};