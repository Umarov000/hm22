const express = require("express");
const morgan = require("morgan");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const PORT = process.env.PORT || 3333;

const createViewPage = (page) => path.join(__dirname, "views", `${page}.ejs`);


// CRUD = Create-POST, Read-GET, Update-PUT, Delete-DELETE
// CRUD - REST API ning Bir qismi
const app = express(); // server yaratish
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("styles"));
app.use(express.static("images"));

app.use(morgan("short"));

//route, endpoint
app.get("/", (req, res) => {
  res.render(createViewPage("index"), { title: "Home" });
});
// -----------------------------TEACHERS------------------------------------
app.get("/teachers", async (req, res) => {
  try {
    const userData = await axios("https://jsonplaceholder.typicode.com/users");
    console.log(userData);
    const teachers = userData.data;
    res.render(createViewPage("teachers"), { title: "Teachers", teachers });
  } catch (error) {
    console.log(error);
    res.send({ message: "Ustoz, malumotlarini yuklashda xatolik" });
  }
});

app.get("/teacher/:teacherID", async (req, res) => {
  try {
    const teacherID = req.params.teacherID;
    const { data } = await axios(
      `https://jsonplaceholder.typicode.com/users/${teacherID}`
    );
    res.render(createViewPage("teacher"), { title: "Teachers", teacher: data });
  } catch (error) {
    console.log(error);
    res.send({ message: "Ustoz, malumotlarini yuklashda xatolik" });
  }
});

app.get("/add-teacher", (req, res) => {
  try {
    res.render(createViewPage("add-teacher"), { title: "Teachers" });
  } catch (error) {
    console.log(error);
    res.send({ message: "Ustoz, malumotlarini yuklashda xatolik" });
  }
});

app.post("/add-teacher", async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    const userData = await axios.post(
      "https://jsonplaceholder.typicode.com/users",
      { username, email, phone }
    );
    const teacher = userData.data;
    res.render(createViewPage("teacher"), {
      title: "Teacher",
      teacher,
    });
  } catch (error) {
    console.log(error);
    res.send({ message: "Ustoz, malumotlarini yuklashda xatolik" });
  }
});

app.delete("/teacher/:id", async(req, res)=>{
  try {
    const {id} = req.params
    const userData = await axios.delete(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    console.log(userData);
    res.sendStatus(204)
  } catch (error) {
    console.log(error);
    res.send({ message: "serverda xatolik" });
    
  }
})

// -----------------------------TEACHERS------------------------------------

app.get("/students", (req, res) => {
  res.render(createViewPage("students"), { title: "Students" });
});
app.get("/groups", (req, res) => {
  res.render(createViewPage("groups"), { title: "Groups" });
});
app.get("/about", (req, res) => {
  res.render(createViewPage("about"), { title: "About" });
});

// app.get("/users", (req, res) => {
//   res.send("<h1>Userlar sahifasi</h1>");
// });

// app.get("/user/:id", (req, res) => {
//     const id = req.params.id
//   res.send(`User id: ${id}`);
// });

// app.get("/user/:userId/staff/:staffId", (req, res) => {

//   const userId = req.params.userId;
//   const staffId = req.params.staffId;

//   res.send(`User ID: ${userId}, Staff ID: ${staffId}`);
// });

app.use((req, res) => {
  res.render(createViewPage("404"), { title: "404 Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server started at: http://localhost:${PORT}`);
});
