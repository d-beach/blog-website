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
const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const contactContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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