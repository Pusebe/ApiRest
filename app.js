const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

//Set up default mongoose connection
const mongoDB = 'mongodb+srv://Pusebe:algo@cluster0.l9ho6.mongodb.net/wikiDB';

//mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology : true} );
// Define schema
const articleSchema= {
    title: String,
    content: String
};

// Compile model from schema
const Article = mongoose.model('Article', articleSchema);

/*const newArticle = new Article({
    title: "chorizo",
    content: "tripas de cerdo way no esta claro o qué?"
});
newArticle.save();*/

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/articles", (req, res)=>{

    Article.find({},(err,result)=>{
        res.render("articles.ejs");
    });
});

app.post("/articles", (req,res)=>{
    console.log("hubo un POST ojo que vas bien")
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) =>{
        if (err){
            console.log("lago salio mal");
        }else{
            console.log("tuto vene ragatzo");
        }
    });
});

app.delete("/articles", (req, res) =>{
    console.log("el delete llegas");
    Article.deleteMany((err)=>{
        if(!err){
            console.log("se borró todo con éxito");
        }
        else{
            console.log(err);
        }
    });
});

app.route("/articles/:article")

.get((req, res)=>{
    console.log(req.params.article);
    res.send(req.params.article);
    Article.findOne({title: req.params.article}, (err, result)=>{
        console.log( result);
    })
})

.put((req,res)=>{
    Article.updateOne({title: req.params.article}, {title: req.body.title, content: req.body.content}, {overwrite: true}, (err)=>{
        if(!err){
            console.log("todo bien");
        }
    })
})

.patch((req,res)=>{
    Article.updateOne({title: req.params.article}, {$set: req.body}, (err)=>{
        if(!err){
            console.log("todo bien");
        }
    })
})
.delete((req,res)=>{
    Article.deleteOne({title: req.body.title},(err)=>{
        if(!err){
            console.log("ups algo salio mal");
        }
    })
})


const port = process.env.PORT || 4000;

app.listen(port, function() {
  console.log("Server started on port " + port);
});