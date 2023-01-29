const { Exercise } = require("../models/exercise.model");

module.exports.createExercise = (req, res) => {
  //console.log(req.body);
  const { userId, category, transcript } = req.body;
  const arr = transcript.split(" ").filter((w) => w); //filter prevents empty strings from counting as a word
  let words = [...new Set(arr)]; //removes duplicate words
  if (words.length == 0) {
    return res.json({ wordCount: 0 });
  }

  Exercise.create({ userId, category, words })
    .then((exercise) => {
      //console.log(exercise);
      res.json({ _id: exercise._id, wordCount: words.length });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.getExercise = (req, res) => {
  Exercise.findById({ _id: req.params.id })
    .then((exercise) => res.json(exercise))
    .catch((err) => res.status(400).json(err));
};

module.exports.updateWord = (req, res) => {
  //console.log(req.body);
  Exercise.findById({ _id: req.params.id })
    .then((e) => {
      e.words.splice(req.body.index, 1, req.body.word);
      e.save();
      res.json({ updatedWord: req.body.word });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.deleteWord = (req, res) => {
  //console.log(req.body);
  Exercise.findById({ _id: req.params.id })
    .then((e) => {
      e.words.splice(req.body.index, 1);
      e.save();
      res.json({ removedAtIndex: req.body.index, words: e.words });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports.deleteExercise = (req, res) => {
  Exercise.deleteOne({ _id: req.params.id })
    .then((confirmation) => res.json(confirmation))
    .catch((err) => res.status(400).json(err));
};

module.exports.dates = (req, res) => {
  //console.log("dates endpoint", req.params);
  Exercise.aggregate([
    { $match: { userId: req.params.userId } },
    {
      $project: {
        _id: 0,
        localDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: req.params.timezone,
          },
        },
      },
    },
    { $group: { _id: "$localDate", sum: { $sum: 1 } } },
  ])
    .then((dates) => res.json(dates))
    .catch((err) => res.status(400).json(err));
};

module.exports.date = (req, res) => {
  //console.log("date endpoint", req.params);
  Exercise.aggregate([
    { $match: { userId: req.params.userId } },
    {
      $project: {
        category: 1,
        words: 1,
        localDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: req.params.timezone,
          },
        },
      },
    },
    { $match: { localDate: req.params.date } },
  ])
    .then((exercises) => res.json(exercises))
    .catch((err) => res.status(400).json(err));
};

module.exports.allExercises = (req, res) => {
  Exercise.aggregate([
    { $match: { userId: req.params.userId } },
    {
      $project: {
        category: 1,
        words: 1,
        localDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: req.params.timezone,
          },
        },
      },
    },
  ])
    .then((exercises) => res.json(exercises))
    .catch((err) => res.status(400).json(err));
};
