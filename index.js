
const express = require('express')
const dotenv = require('dotenv')
const { Pool } = require('pg')
const {v4} = require('uuid')
const fs = require('fs')

dotenv.config()
const app = express()
app.use(express.json())

const db = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

db.connect()

app.get('/',(req,res)=>{
    res.send("Hello from Zeno")
    res.end()
})
app.get('/allUsers',(req,res)=>{
 db.query(`SELECT * FROM Users`,(err,result)=>{
        if(!err){
            console.log(result.rows)
            fs.writeFile('1.txt',JSON.stringify(result.rows),'utf-8',(err)=>{
                if(err){
                    console.log(err);
                }
            })

        }else{
            console.log(err.message)
        }
    })
    res.end()

})
app.get('/allUser/:id',async(req,res)=>{
  await db.query(`SELECT * FROM Users WHERE id = ${req.params.id}`,(err,result)=>{
    return !err ? console.log(result.rows) : console.log(err) 
    })

    res.end()
})
app.post('/addUser',(req,res)=>{
    const data = {
        userName: req.body.userName,
        userEmail: req.body.userEmail
    }
    db.query(`insert into Users(username,useremail,_id) values('${data.userName}','${data.userEmail}','${v4()}')`,(err,result)=>{  
    res.status(200).send(JSON.stringify(data))
    return !err ? console.log(result.rows) : console.log(err) 
})
res.end()
})
app.delete('/allUsers/delete/:id',(req,res)=>{
    db.query(`delete from Users where id = ${req.params.id}`,(err,result)=>{
        return !err ? console.log(result.rows) : console.log(err) 
    })
    res.end()
})

app.listen(process.env.PORT,()=>{
    console.log("server start");
})