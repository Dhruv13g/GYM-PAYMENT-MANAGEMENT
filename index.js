const express= require('express');
const path = require('path');
const port = process.env.PORT || 3000;
var bodyParser = require('body-parser')
const mongoose =require("mongoose");
const app=express();
var mongodb = require('mongodb');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const alert = require('alert');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.document = new JSDOM("html").window.document;



app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));



mongoose.connect('mongodb://127.0.0.1:27017/Fitness');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})




//new user
app.post('/sign_up', async(req,res)=>{
    var name = req.body.name;
    var email =req.body.email;
    var pass = req.body.pass;
    var phone =req.body.phone;
  
    try {
        const userExist = await db.collection('details').findOne({ email: email }, {phone: phone });
        if (userExist)
        {
          return  res.send("<script>alert('user exist'); window.location.href = '/signup.html';</script> ");
        }
    }
        catch (err) {
            console.log(err);
            
      }
    var data = {
        "name": name,
        "email":email,
        "password":pass,
        "phone":phone
    }
    
db.collection('details').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
          
    return res.redirect('login.html');
});
    
//contactus
app.post('/contactus', async(req,res)=>{
    var name = req.body.name;
    var email =req.body.email;
    var sub = req.body.sub;
    var messg =req.body.messg;
  
    
    var data = {
        "name": name,
        "email":email,
        "sub":sub,
        "messg":messg
    }
    
db.collection('contact').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("we will contact you soon");
              
    });
          
    return res.send("<script>alert('We will consoon . Thank You !');window.location.href = '/contact.html';</script>");
});


//login

app.post('/login',async(req,res)=>
{
 try{
    const email =req.body.email;
    const password = req.body.password;

    const useremail = await db.collection("details").findOne({email:email});
   
    if(useremail.password==password)
    {
        
    
     res.redirect('pricing.html');
    }
    else{
        return res.send("<script>alert('Sorry , Wrong Password !');window.location.href = '/login.html';</script>");
    }



}catch(err)
{
     res.send("<script>alert('User Didn't exist !');window.location.href = '/login.html';</script>");
}
});




app.post("/bmi", function(req, res){

    var height= Number(req.body.Height);
    var weight = Number(req.body.Weight);
    height=height/100;
    var result = (weight / (height*height));
    return res.send("<script>alert("+result+");window.location.href = '/bmi.html';</script>");
});



app.get("/explore.html", (req, res) => {
    res.sendFile(__dirname + '/explore.html');
 });
app.get("/", (req, res) => {
   res.sendFile(__dirname + '/index.html');
});
app.get("/index.html",(req,res)=>
{
    res.sendFile(path.join(__dirname,'index.html'));
})
app.get("/contact.html",(req,res)=>
{
    res.sendFile(path.join(__dirname,'contact.html'));
})


app.get("/bmi",(req,res)=>
{
    res.sendFile(path.join(__dirname,'bmi.html'));
    
})
app.get("/login.html",(req,res)=>
{
    res.sendFile(path.join(__dirname,'bmi.html'));
    
})
app.get("/pricing.html",(req,res)=>
{
    res.sendFile(path.join(__dirname,'pricing.html'));
    
})


app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});