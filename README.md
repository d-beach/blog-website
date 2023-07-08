# Personal Blog Website

This is a personal blog website built using Node.js, Express.js, EJS templates, and DynamoDB. The website allows you to create and publish blog posts, view existing posts, and read individual blog posts.

## Features

- Home page: Displays an introduction and summary of the blog.
- About page: Provides information about the blog author.
- Contact page: Allows users to send messages or connect with the author.
- Compose page: Enables the creation and submission of new blog posts.
- Posts page: Lists all published blog posts.
- Unique blog post page: Displays the full content of a selected blog post.

## Prerequisites

- Node.js (version X.X.X or higher)
- NPM (Node Package Manager)

## Installation

1. Clone the repository:


2. Navigate to the project directory:


3. Install the dependencies:


4. Set up DynamoDB:

   - Create an AWS account and set up your DynamoDB table named "blog-post".
   - Configure AWS SDK credentials on your machine.

5. Start the server:


6. Open your web browser and visit `http://localhost:3000` to access the blog website.

## Configuration

- DynamoDB: Ensure that you have properly configured your AWS credentials in your development environment. You can refer to the AWS SDK documentation for more information.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

