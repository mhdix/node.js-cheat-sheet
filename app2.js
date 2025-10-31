const express = require("express");
const api = express();
const user = require('./users')

api.use(express.json());


api.get("/api/user", (req, res) => {

  console.log(user)
  
  // const course = {
  //   id: courses.length + 1,
  //   name: req.body.name,
  //   age: req.body.age,
  // };
  // courses.push(course);

  res.send({
    data: user,
    status: 200,
    text: "ok"
  });
});


api.put("/api/user", (req, res) => {
  res.send(courses);
});

api.listen(3000, () => console.log("connect 3000"));
