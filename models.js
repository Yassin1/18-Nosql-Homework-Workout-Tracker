const mongoose = require("mongoose");

const WorkoutSchema = mongoose.Schema({
    day: {
        type: Date,
        required: true,
    },
    exercises: [{
        type: {
            type: String,
        },
        name: {
            type: String,
        },
        duration: {
            type: Number,
        },
        weight: {
            type: Number,
        },
        reps: {
            type: Number,
        },
        sets: {
            type: Number,
        },
    }]
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = {
    Workout,
}