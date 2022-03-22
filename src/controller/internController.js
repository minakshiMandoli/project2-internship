const InternModel = require("../models/internModel")
const CollegeModel = require('../models/collegeModel')

//const {phone} = require('phone');



const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true

}


const createIntern = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length >0) {

            const { name, mobile, email,collegeName} = data
            
            const collegeData = await CollegeModel.findOne({ name: collegeName, isDeleted:false})
             if (!collegeData) {
                 return res.status(400).send({ status: false, message: "college you are looking for, does not exist" })
             }

            if (!isValid(name)) {
                return res.status(400).send({ status: false, message: "intern name is required" })
            }
            if (!isValid(mobile)) {
                return res.status(400).send({ status: false, message: "mobile number is required" })
            }
           
            if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(mobile))) {
                return res.status(400).send({ status: false, message: "Mobile Number is not valid" })
                
            }
            const duplicateMobile= await InternModel.findOne({mobile: mobile})
            if(duplicateMobile){
                return res.status(400).send({status:false, message:"mobile number is already exist"})
               }
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "email is required" })
            }

            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
                return res.status(400).send({ status: false, message: 'email is not a valid address' })

            }
            const duplicateEmail= await InternModel.findOne({email:email})
            if(duplicateEmail){
                return res.status(400).send({status:false, message:"E-mail already exist"})
               }

            //  const collegeId=collegeData._id
            //  console.log(collegeId)
            const internDetails={
                     name : data.name,
                     email : data.email,
                    mobile : data.mobile,
                    collegeId:collegeData._id
                    }
            
            let newIntern= await InternModel.create(internDetails)
            return res.status(201).send({ status: true, data: newIntern })

        }
        else { return res.status(400).send({ ERROR: " Bad request " }) }

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }



}

// const createIntern = async function (req, res) {


//     try {

//         let data = req.body;

//         if (Object.keys(data).length > 0) {
     
            
//             if (!isValid(data.name)) { return res.status(400).send({ status: false, msg: "First name is required" }) }
//             if(!isValid(data.collegeId)){return res.status(400).send({status:false , msg:"College Id is required"})}

//             if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))) {
//                 return res.status(400).send({ status: false, msg: "Please provide a valid email" })
//             }
//             if (!(/^([+]\d{2})?\d{10}$/.test(data.mobile))) {
//                 return res.status(400).send({ status: false, msg: "please provide a valid moblie Number" })
//             }

//             let dupli = await InternModel.findOne({ email: data.email })

//             if (dupli) { return res.status(400).send({ status: false, msg: "Email already exists" }) }

//             let savedData = await InternModel.create(data);
//             return res.status(201).send({ internDetails: savedData });

//         } else {
//             return res.status(400).send({ ERROR: "BAD REQUEST" })
//         }

//     } catch (err) {

//         return res.status(500).send({ ERROR: err.message })

//     }
// }





module.exports.createIntern = createIntern