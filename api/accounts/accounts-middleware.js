const Accounts = require("./accounts-model")
const db = require("../../data/db-config")

exports.checkAccountPayload = (req, res, next) => {
  // KODLAR BURAYA
  // Not: Validasyon için Yup(şu an yüklü değil!) kullanabilirsiniz veya kendiniz manuel yazabilirsiniz.
  const error = { status: 400}
  const {name , budget} = req.body
  if(name === undefined || budget === undefined){
    error.message = "ad ve bütçe gereklidir"
  }else if(name.trim().length < 3 || name.trim().length > 100){
    error.message = "Hesabın adı 3 ile 100 arasında olmalı"
  }else if(typeof budget !== "number" || isNaN(budget)){
    error.message = "hesabın bütçesi bir sayı olmalıdır"
  }else if(budget < 0 || budget > 1000000){
    error.message = "hesap bütcesi çok büyük veya çok küçük"
  }

  if(error.message){
    next(error)
  }else{
    next()
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try{
    const existing = await db("accounts").where("name",req.body.name.trim()).first()
    if(existing){
      next({status: 400, message: "bu ad alınmış"})
    }else{
      next()
    }
  }catch (err){
    next(err)
  }
}

exports.checkAccountId =async (req, res, next) => {
  try{
    const account = await Accounts.getById(req.params.id)
    if(!account){
      next({status:404, message: "hesap bulunamadı"})
    }else{
      req.account = account
      next()
    }
  }catch(err){
    next(err)
  }
}
