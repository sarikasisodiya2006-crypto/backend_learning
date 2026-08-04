const { productModel } = require("../model");

const createProduct = async(req,res)=>{

            try {
             const productExist = await productModel.findOne({ SKU: req.body.SKU });
                if (productExist) {
                  return res.status(409).send("Product with this SKU already exists");
                }


            const{name,price,category,SKU}= req.body;
            let product = {
                name:name,
                price:price,
                category:category,
                SKU:SKU
            };
            console.log(product)
                await productModel.create(product);
                return res.status(209).send("product created successfully!");
            } catch (error) {
                console.log("err : ",error)
                return res.status(400).send("internal server error");
                
            }
           
        }


const getProduct = async(req,res)=>{
            try {
                const{page=1,limit=2,sort="asc"}=req.query;

                let product = await productModel.findOne({})
                .skip((page-1)*limit)
                .limit(limit)
                .sort({price: sort==="asc"?1:-1})
                .select("-_id -__v -SKU");

               res.json(product);
            } catch (error) {
             console.log("err : ",error)
                return res.status(400).send("internal server error");
                   
            }
        }


const deleteStudentbySKU =  async(req,res)=>{
            try {
                const {sku}=req.params;
                const product = await productModel.findOne({SKU:sku});
                if(!product){
                    return res.status(404).send("product not found");
                }
                await productModel.deleteOne({SKU:sku});
                return res.status(200).send("product deleted !");
                
            } catch (error) {
             console.log("err : ",error)
                return res.status(400).send("internal server error");
                      
            }

        }


const updateProduct = async(req,res)=>{

            const product = await productModel.findOne({ sku: req.params.sku });

console.log(product);
            try {
                 const updateProduct= await productModel.findOneAndUpdate({SKU:req.params.sku},{$set:req.body},{ returnDocument: "after" });

            if(!updateProduct){
                return res.status(404).send("product not found");
            }

            return res.json(updateProduct);
            } catch (error) {
                console.log("err : ",error)
                return res.status(400).send("internal server error");
            }

           
        }

        module.exports ={
         createProduct ,
         getProduct,
         deleteStudentbySKU ,
            updateProduct
            
        }