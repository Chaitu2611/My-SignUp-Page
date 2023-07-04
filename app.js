const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const firstName=req.body.fname
    const lastName=req.body.lname
    const email=req.body.email

    if(firstName=="" || lastName=="" || email=="") return res.sendFile(__dirname+"/failure.html");
    
    const data={
        members: [
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/"+"Audience ID";//Not to be revealed 
    const options={
        method:"POST",
        auth:"chaitu:"+"API Key"//Not to be revealed
    }
    const request = https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }else res.sendFile(__dirname+"/failure.html");
        // console.log(response.statusCode);

    })
    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.post("/success", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    // console.log("running on 3000");
});

