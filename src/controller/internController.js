const InternModel = require("../models/internModel")
const CollegeModel = require('../models/collegeModel')

//const {phone} = require('phone');



const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true

}

///
const createIntern = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length >0) {

            const { name, mobile, email, collegeId} = data
            
            const collegeData = await CollegeModel.findOne({_id: collegeId, isDeleted:false})
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
            // const internDetails={
            //          name : data.name,
            //          email : data.email,
            //         mobile : data.mobile,
            //         collegeId:collegeData._id
            //         }
            
            let newIntern= await InternModel.create(data)
            return res.status(201).send({ status: true, data: newIntern })

        }
        else { return res.status(400).send({ ERROR: " Bad request " }) }

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }



}


module.exports.createIntern = createIntern