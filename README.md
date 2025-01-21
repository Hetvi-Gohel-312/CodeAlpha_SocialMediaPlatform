# Social Media Platform

A social media platform that allows users to sign up, log in, create posts, share images, and interact with other users. The platform features a responsive design and simple CRUD operations to manage user profiles and posts.

## Table of Contents
- [Features](#features)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Features
- User sign-up and login system.
- Create and share posts with text and images.
- View posts made by all users.
- User profile page showing posts made by the user.
- Responsive and user-friendly design.

## Installation and Setup
1. Clone the repository:
   - git clone https://github.com/Hetvi-Gohel-312/social-media-platform.git
   - cd social-media-platform

2. Install dependencies:
   npm install
   npm start

3. Start the server:
   node server.js

4. Open the website in your browser:
   http://localhost:3000

## Project Structure
-index.html: Main HTML file with login and signup pages.
- profile.html: Displays user profiles and their posts.
- posts.html: Displays all posts made by users.
- style.css: Contains all the CSS styles for the platform’s layout and design.
- script.js: Handles user interactions, such as form submissions and displaying posts dynamically.
- server.js: Server-side logic for managing user authentication, handling posts, and database interactions.
- uploads/: Directory for storing uploaded post images.

## Technologies Used
- HTML for the structure and content of the pages.
- CSS for styling the platform.
- JavaScript for handling interactivity and client-side logic.
- Node.js for the server-side framework.
- Express.js for routing and managing API requests.
- SQLite for storing user and post data in a database.
