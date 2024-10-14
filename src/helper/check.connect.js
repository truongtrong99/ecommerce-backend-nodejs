"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

// Function to count the number of connections
const countConnect = () => {
  const numConnect = mongoose.connections.length;
  console.log(`Number of connections: ${numConnect}`);
  return numConnect;
};

// check over load connection
const checkOverLoad = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCors = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on the number of cores
    const maxConnections = numCors * 5;

    console.log(`Number of connections: ${numConnections}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    console.log(`Number of cores: ${numCors}`);
    if (numConnections > maxConnections) {
      console.log(`Overload connections: ${numConnections}`);
    }
  }, _SECONDS); // Monitor every 5 seconds
};
/// Export the function
module.exports = {
  countConnect,
  checkOverLoad,
}; // Export the function
