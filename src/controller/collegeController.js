
const CollegeModel=require('../models/collegeModel')
const InternModel=require('../models/internModel')


const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
  
  }
/// CREATE COLLEGE............................................................................................
const createCollege= async function(req, res){
 try{
  const data= req.body;

  if (Object.keys(data).length > 0) {
    const{name,fullName,logoLink}=data
    if (!isValid(name))
     { return res.status(400).send({ status: false, msg: "name is required" }) }

     const collegeSortName= await CollegeModel.findOne({name})
     if(collegeSortName){
     return res.status(400).send({status:false, message:"college already exist"})
    }

    if (!isValid(fullName)) 
    { return res.status(400).send({ status: false, msg: "full name is required" }) }
   
    const collegeFullName= await CollegeModel.findOne({fullName: {
      "$regex": fullName, "$options": "i"
     }})
     if(collegeFullName){
     return res.status(400).send({status:false, message:"college already exist"})
    }

    if (!isValid(logoLink))
     { return res.status(400).send({ status: false, msg: "logo is required " }) }
    
     if(!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(logoLink))){
      
      return res.status(400).send({ status: false, message: "please enter a valid logo link" })
    }

const newCollege= await CollegeModel.create(data)
return res.status(201).send({status:true,data:newCollege})

}
else { return res.status(400).send({ ERROR: " invalid request " }) }

 }
 catch(err){
 return res.status(500).send({status:false, message:err.message})
 }
}


////....... GET COLLEGE DETAILS...................................................
const getCollegeDetails= async function(req,res){
  try{
  const collegeNameToGetdetails= req.query.collegeName

  if(!isValid(collegeNameToGetdetails)){
    return res.status(400).send({ status: false, message: "please enter college name in query parameter" })
  }
  const collegeData= await CollegeModel.findOne({name:collegeNameToGetdetails, isDeleted:false})
  if(!isValid(collegeData)){
    return res.status(400).send({ status: false, message: "no such college found" })
  }

  const collegeId=collegeData._id
  let internDetails= await InternModel.find({collegeId:collegeId, isDeleted:false})
  .select({name:1,email:1,mobile:1})
  
  let collegeDetails={
    name:collegeData.name,
    fullName:collegeData.fName,
    logoLink:collegeData.logoLink,
    intersts:internDetails
  }

  return res.status(200).send({ status: true, data:collegeDetails})
}
catch(err)
{
  return res.status(500).send({status:false, message:err.message})
}
}



module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails

