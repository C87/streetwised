# Streetwised

Hyperlocal Q&A Prototype.

## Description

Location-based community where users ask question and locals provide answers, questions are stored in MongoDB as a geoJSON feature. When users explore a map of the city the event initialises a Fetch API request to the controller to validate the location and query the database for questions within the map boundary, the JSON response then populates the DOM and map canvas. For profile pictures, the canvas element from HTML 5 optimises images locally for uploading to the controller, the buffer is cropped, rotated, then stored in Digital Ocean object storage using Multer streaming storage engine for AWS S3.

## License

This project is licensed under the [MIT License]
