const addressModel = require('../model/addressModel');

//============createAddress=================


const createAddressService = async(data)=>{
    const addressExist = await addressModel.findOne({
        user : data.user,
        type : data.type,
        address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode
    });
    if (addressExist) {
        throw new Error(`You already have a ${data.type} address`);
    }

     const address = await addressModel.create(data);

    return address;

};

module.exports = {createAddressService};
