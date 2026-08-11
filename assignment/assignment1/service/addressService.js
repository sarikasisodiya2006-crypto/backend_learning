const mongoose = require("mongoose");
const addressModel = require('../model/addressModel');

//============createAddress=================


const createAddressService = async(data)=>{
    const addressExist = await addressModel.findOne({
        user : data.user,
        type : data.type
        // address: data.address,
        //     city: data.city,
        //     state: data.state,
        //     pincode: data.pincode
    });
    if (addressExist) {
        throw new Error(`You already have a ${data.type} address`);
    }

     const address = await addressModel.create(data);

    return address;

};

// GET ALL ADDRESSES
const getAllAddresses = async () => {
    const addresses = await addressModel
        .find()
        .populate("user", "firstname lastname email");

    return addresses;
};


// GET ADDRESS BY ID
const getAddressById = async (id) => {
    const address = await addressModel
        .findById(id)
    //     .populate("user", "firstname lastname email");

    if (!address) {
        throw new Error("Address not found");
    }
    // Admin can access any address
    if (loggedInUser.role !== "admin") {

        if (address.user.toString() !== loggedInUser.id) {
            throw new Error("You are not authorized to access this address");
        }
    }

    return address.populate("user", "firstname lastname email");

    return address;
};


// UPDATE ADDRESS
const updateAddress = async (id, data) => {

    const existingAddress = await addressModel.findById(id);

    if (!existingAddress) {
        throw new Error("Address not found");
    }

    // duplicate check
    const duplicateAddress = await addressModel.findOne({
        _id: { $ne: id },
        user: existingAddress.user,
        type: data.type,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode
    });

    if (duplicateAddress) {
        throw new Error("This address already exists");
    }

    const updatedAddress = await addressModel
        .findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        )
        .populate("user", "firstname lastname email");

    return updatedAddress;
};


// DELETE ADDRESS
const deleteAddress = async (id) => {

    const address = await addressModel.findById(id);

    if (!address) {
        throw new Error("Address not found");
    }

    await addressModel.findByIdAndDelete(id);

    return address;
};




const findNearbyAddressesService = async (
    userId,
    longitude,
    latitude,
    distance
) => {

    const addresses = await addressModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },

                distanceField: "distance",

                maxDistance: distance * 1000,

                spherical: true,

                query: {
                    user: {
                        $ne: new mongoose.Types.ObjectId(userId)
                    }
                }
            }

            
        },
         {
            $project: {
                _id: 0,
                type: 1,
                address: 1,
                city: 1,
                state: 1,
                pincode: 1,
                location: 1,
                distance: 1,
                user: 1
            }
        }
    ]);

    const result = await addressModel.populate(
    addresses,
    {
        path: "user",
        select: "firstname lastname email -_id"
    }
);

    return result;
};

module.exports = {createAddressService,
     getAllAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
 findNearbyAddressesService

};
