const express = require("express");
const db = require("./models");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost/workout', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
    res.send("OKOK")
})

app.get("/api/workouts", async (req, res) => {
    console.log("CALLED", "/api/workouts");
    const data = await db.Workout.findOne({}, {}, { sort: { 'created_at' : -1 } });
    res.send([data]);
});

app.post("/api/workouts", async (req, res) => {
    console.log("CALLED[POST]", "/api/workouts");
    const workout = new db.Workout({ day: new Date() });
    const data = await workout.save();
    res.send(data);
});

app.get("/api/workouts/range", async (req, res) => {
    console.log("CALLED", "/api/workouts/range")
    const data = await db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $reduce: {
                        input: "$exercises",
                        initialValue: 0,
                        in: { $add: ["$$value", "$$this.duration"] }
                    }
                }
            }
        }
    ])
    res.send(data);
});

app.put("/api/workouts/:id", async (req, res) => {
    console.log("CALLED[PUT]", "/api/workouts/:id");
    const workoutId = req.params.id;
    
    const data = await db.Workout.updateOne(
        { _id: workoutId },
        { $push: { exercises: req.body } },
        { new: true }
    );

    res.send(data);
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});