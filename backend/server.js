const http = require("http");

const server = http.createServer((req, res) => {
  res.end("This is my server2 response on 3001!");
});
server.listen(process.env.PORT || 3001);
