const{
createAddressService
}= require('../service/addressService')

//===============addressSchema==============

const createAddress = async(req,res)=>{
    try {

         
        const{type,address,city,state,pincode}=req.body;

        
        const newUser = {
            user: req.user.userID,
            type: type,
            address: address,
            city: city,
            state: state,
            pincode: pincode
        };


        
        const result =  await createAddressService(newUser);
        res.status(201).send({
            message: "Address created successfully",
            address: result
        });
    } catch (error) {
         res.status(500).send({
            message: "Error creating address",
            error: error.message
        });

    }
};

module.exports={createAddress};

