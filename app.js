// Import modules
import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import * as dynamo from "./dynamo.js";

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

// String for starting content on each page 
const homeStartingContent = "Welcome to my blog! I'm a self-taught developer based in Dearborn, Michigan, with a background in Biomedical Engineering and Electrical Engineering. After starting my professional career, I discovered a passion for technology and began teaching myself programming. With online resources and coding challenges, I have expanded my skill set to include object-oriented programming, algorithms, data structures, the cloud and more. In my current role at Eli Lilly, I continually seek opportunities to develop my skills while benefiting the company. I am excited to share my journey and insights with you through this blog.";
const aboutContent = "As a Biomedical Engineering graduate from the University of Michigan, I never would have guessed that I would end up as a self-taught developer. However, after realizing my passion for technology, I started teaching myself programming and haven't looked back since. Through online tutorials and coding challenges, I have expanded my skills to include a wide range of programming concepts. At Eli Lilly, I have been able to apply my skills to real-world problems and expand my knowledge even further. In addition to technical skills, my role has allowed me to develop my soft skills such as communication and presentation skills. I'm eager to share my experiences and insights with you through this blog and hope to inspire others to pursue their passions in the tech industry."
const contactContent = "Please use the form below to send me a message or connect with me on LinkedIn or GitHub.";

// Define app
const app = express();

app.set("view engine", "ejs");

// Define id of first blog post
let currId = 1;

// For use of body-parser and access to static files (styles.css)
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Render home page
app.get("/", function(req, res) {
    res.render("home", {
        homeStart: homeStartingContent
    });
});

// Render about page
app.get("/about", function(req, res) {
    res.render("about", {
        aboutStart: aboutContent
    });
});

// Render contact page 
app.get("/contact", function(req, res) {
    res.render("contact", {
        contactStart: contactContent
    });
});

// Render compose page 
app.get("/compose", function(req, res){
    res.render("compose");
});

// Render blog posts page
app.get("/posts", async function(req, res){
    // Array to store posts
    let posts = await dynamo.getAllPosts();
    console.log(posts);
    res.render("posts", {
        posts: posts
    });
});

// Render unique blog post page
app.get("/post/:title", async function(req, res) {
    // Array to store posts
    let posts = await dynamo.getAllPosts();
    console.log(posts);

    const chosenPost = _.lowerCase(req.params.title);
    posts.forEach(function(post){
        const lowerTitle = _.lowerCase(post.postTitle)
        if (chosenPost === lowerTitle) {
            res.render("post", {
                title: post.postTitle,
                body: post.postBody,
                timeStamp: post.postDateTimeStamp
            });
        }
    });
});

// Post route that creates each blog post
app.post("/compose", async function(req, res) {
    //Set blog post date and time
    let rawPostDate = new Date();
    let postDate = rawPostDate.toLocaleString("en-US");
    const post = {
        postTitle: req.body.newTitle,
        postBody: req.body.newPost,
        postDateTimeStamp: postDate
    };

    // Add post to database
    // Define parameters for attributes of the post
    let postParameters = {
        "id": {"N": currId.toString()},
        "title": {"S": post.postTitle},
        "date": {"S": post.postDateTimeStamp},
        "body": {"S": post.postBody}
    };

    // Add the post to the database
    let blogPostParams = {TableName: "blog-post", Item: postParameters}
    dynamo.addPost(blogPostParams);
    
    // Increment id of for the next post to the database
    currId += 1;

    res.redirect("/")
});

app.listen("3000", function() {
    console.log("Server has started on port 3000");
});