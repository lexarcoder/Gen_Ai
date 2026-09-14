import ProfileModel from "../model/profileModel/userProfile.model.js"
import  uploadOnCloudinary  from "../utils/fileUpload.js"



async function getUserProfileController(req, res) {
try {
    const userId = req.user.id;
    const email = req.user.email;
     const {
      firstName,
      lastName,
      contact,
      role,
      gender,
      dob,
      bio,
      country,
      state,
      district,
      pincode,
    } = req.body;
    

    let profileImg = "";
    if(req.file){
        const uploadImage = await uploadOnCloudinary(req.file.path);
        if(!uploadImage){
            return res.status(400).json({
                success: false,
                message: "Image upload failed",
            });
        }
        profileImg = uploadImage.url;
    }

    let profile = await ProfileModel.findOne({
        user: userId,
    });


    if (!profile) {
        profile = await ProfileModel.create({
            user: userId,
            email,
            profileImg,
            firstName,
            lastName,
            contact,
            role,
            gender,
            dob,
            bio,
            country,
            state,
            district,
            pincode,
        });

        return res.status(201).json({
            success: true,
            message: "Profile Created Successfully",
            profile,
        });
    }


    profile.firstName = firstName || profile.firstName;
    profile.lastName = lastName || profile.lastName;
    profile.contact = contact || profile.contact;
    profile.role = role || profile.role;
    profile.gender = gender || profile.gender;
    profile.dob = dob || profile.dob;
    profile.bio = bio || profile.bio;
    profile.country = country || profile.country;
    profile.state = state || profile.state;
    profile.district = district || profile.district;
    profile.pincode = pincode || profile.pincode;

    if (profileImg) {
        profile.profileImg = profileImg;
    }

    await profile.save();

    return res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        profile,
    });

} catch (error) {
    console.log(error);

    return res.status(500).json({
        success: false,
        message: error.message,
    });
}


}


export default {
    getUserProfileController,
};