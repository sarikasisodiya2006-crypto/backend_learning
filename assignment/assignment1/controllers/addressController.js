const{
    createAddressService,
     getAllAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
    findNearbyAddressesService
}= require('../service/addressService')

//===============addressSchema==============

const createAddress = async(req,res)=>{
    try {

         
        const{type,address,city,state,pincode,longitude,latitude}=req.body;
        const location = {
                type:"Point",
                coordinates:[longitude,latitude]

            };
        
        const newUser = {
            user: req.user.userID,
            type: type,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            location:location,
            
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

// GET ALL ADDRESSES
const getAllAddressesController = async (req, res) => {
    try {

        const addresses = await getAllAddresses();

        res.status(200).json({
            message: "Addresses fetched successfully",
            addresses
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};


// GET ADDRESS BY ID
const getAddressByIdController = async (req, res) => {
    try {

        const address = await getAddressById(req.params.id);

        res.status(200).json({
            message: "Address fetched successfully",
            address
        });

    } catch (err) {

        if (err.message === "Address not found") {
            return res.status(404).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: err.message
        });
    }
};


// UPDATE ADDRESS
const updateAddressController = async (req, res) => {
    try {

        const address = await updateAddress(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "Address updated successfully",
            address
        });

    } catch (err) {

        if (err.message === "Address not found") {
            return res.status(404).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: err.message
        });
    }
};


// DELETE ADDRESS
const deleteAddressController = async (req, res) => {
    try {

        await deleteAddress(req.params.id);

        res.status(200).json({
            message: "Address deleted successfully"
        });

    } catch (err) {

        if (err.message === "Address not found") {
            return res.status(404).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: err.message
        });
    }
};


const findNearbyAddresses = async (req, res) => {

    try {

        const {
            longitude,
            latitude,
            distance
        } = req.query;

        if (!longitude || !latitude || !distance) {
            return res.status(400).json({
                message: "longitude, latitude and distance are required"
            });
        }

        const addresses = await findNearbyAddressesService(
            req.user.userID,
            Number(longitude),
            Number(latitude),
            Number(distance)
        );

        res.status(200).json({
            message: "Nearby addresses fetched successfully",
            addresses
        });

    } catch (error) {

        res.status(500).json({
            message: "Error fetching nearby addresses",
            error: error.message
        });
    }
};

module.exports={createAddress,
    getAllAddressesController,
     getAddressByIdController,
    updateAddressController,
    deleteAddressController,
    findNearbyAddresses
};

