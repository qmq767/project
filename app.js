var express = require("express");
var app = express();
var multer = require("multer");
var bodyParser = require("body-parser");
var fs = require("fs");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

app.use(bodyParser.urlencoded({extended:false}))
app.use(multer({dest:"/temp/"}).array("myFile"));
app.use(express.static("./"));

MongoClient.connect("mongodb://127.0.0.1:27017",{useNewUrlParser:true},function(err,db){
	global.db = db.db('1808demo').collection('dream');
})

app.post("/add",(req,res)=>{
	var data = req.body;
	data.id = new Date().getTime()+'';
	data.check = false;
	db.insertOne(data,function(err){
		if(err){
			console.log("添加错误");
		}else{
			res.send("成功！")
		}
	});
})

app.post("/del",(req,res)=>{
	var data = req.body;
	db.deleteOne(data,function(err){
		if(err){
			console.log("添加错误");
		}else{
			res.send("成功！")
		}
	});
})
app.post("/check",(req,res)=>{
	var obj = req.body;
	console.log(obj);
	db.find(obj).toArray(function(err,data){
		if(err){
			console.log("获取数据失败！")
		}else{
			var flag = data[0].check?false:true
			db.updateOne(obj,{$set:{check:flag}},function(err,resu){
				if(err){
					console.log("修改错误！")
				}else{
					res.send("修改成功！")
				}
			});
		}
	});
	
})

app.get("/get",function(req,res){
	db.find({check:false}).toArray(function(err,data){
		if(err){
			console.log("获取数据失败！")
		}else{
			res.send(data)
		}
	})
})

app.listen(80,function(){
	console.log("服务开启成功！",80)
})
