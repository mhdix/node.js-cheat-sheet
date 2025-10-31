const express = require("express");
const { body, validationResult } = require("express-validator");
let users = require("./users");
const { default: helmet } = require("helmet");
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//? middleware
// app.use((req, res, next) => {
//   req.body.name = "mhdix";
//   req.user = { id: 1, name: "mahdi" };
//   res.send("this is middleware 1");

//   next();
// });

// app.use((req, res, next) => {
//   console.log(req.body);
//   console.log("middle 2");
// });

//!  envirment variable
// way 1
app.use(express.static("public"));
// way 2
app.use(helmet());

//! whene development mode
if (app.get("env") === "development") {
  console.log("morgan id active");
  //! morgan http log
  const morgan = require("morgan");
  app.use(morgan("tiny"));
}

//! Program environment 
console.log("NODE_ENV", process.env.NODE_ENV);
console.log("NODE_ENV2", app.get("env"));

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

  users.splice(userIndex, 1);

  res.json({
    data: users,
    message: "ok",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`connected to port ${port}`));
