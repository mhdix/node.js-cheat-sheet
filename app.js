const express = require("express");
const { body, validationResult } = require("express-validator");
let users = require("./users");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req);

  req.body.name = "mhdix";
  req.user = { id: 1, name: "mahdi" };
  res.send("this is middleware 1");
  console.log("mid 1");

  next();
});

app.use((req, res, next) => {
  console.log("mid 2");
  console.log(req.body);
  console.log(req.user);
});

app.get("/api/users", (req, res) => {
  res.json({
    data: users,
    status: 200,
    message: "ok",
  });
});

app.get("/api/users/:id", (req, res) => {
  const idSearched = req.params.id;
  const user = users.find((user) => user.id == idSearched);
  if (!user)
    return res.status(404).json({
      data: null,
      message: "the user not found",
    });

  res.json({
    data: user,
    message: "ok",
  });

  console.log(user);
});

app.post(
  "/api/users",
  [
    body("email", "email must be valid").isEmail(),
    body("name", "name cant be empty").notEmpty(),
    // body("name", "namme must be upper than 3 char"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        data: null,
        errors: errors.array(),
        message: "validation error",
      });
    }

    if ((req.params.name <= 3) & (req.params.name == "")) {
      return res.status(404).send({
        message: "name upper than 3 char",
      });
    }

    users.push({
      id: users.length + 1,
      ...req.body,
    });

    res.status(200).json({
      data: users,
      message: "0k",
    });
  }
);

app.put(
  "/api/users/:id",
  [
    body("email", "email must be valid").isEmail(),
    body("name", "name cant be empty").notEmpty(),
  ],
  (req, res) => {
    const user = users.find((user) => user.id == req.params.id);

    if (!user) {
      return res.status(404).send({
        data: null,
        message: "user is not definde",
      });
    }
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        data: null,
        errors: error.array(),
        message: "validation error",
      });
    }

    users = users.map((user) => {
      if (user.id == req.params.id) {
        return { ...user, ...req.body };
      }
      return user;
    });
    res.status(200).json({
      data: users,
      message: "ok",
    });
  }
);

app.delete("/api/users/:id", (req, res) => {
  const user = users.find((user) => user.id == req.params.id);

  if (!user) {
    return res.status(404).json({
      data: null,
      message: "the user with the given id was not fond",
    });
  }

  const userIndex = users.indexOf(user);
  console.log("userIndex", userIndex);

  users.splice(userIndex, 1);
  console.log("users", users);
  res.json({
    data: users,
    message: "ok",
  });
});

app.listen(3000, () => console.log("connected to port 3000"));
