const app = require("./src/app");
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGINT", (err) => {
  server.close(() => {
    console.log("Exit Server Process");
  });
});
