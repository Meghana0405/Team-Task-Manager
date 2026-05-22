const Task = require("../models/Task");

exports.createTask = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      status,
      project,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      project,
      assignedTo: req.user.id,
    });

    res.status(201).json({
      message: "Task Created",
      task,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Task creation failed",
      error: error.message,
    });
  }
};

exports.getTasks = async (
  req,
  res
) => {

  try {

    const tasks = await Task.find({
      assignedTo: req.user.id,
    })
      .populate("project")
      .populate("assignedTo");

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to fetch tasks",
    });
  }
};

exports.updateTask = async (
  req,
  res
) => {

  try {

    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.status(200).json({
      message: "Task Updated",
      updatedTask,
    });

  } catch (error) {

    res.status(500).json({
      message: "Update failed",
    });
  }
};

exports.deleteTask = async (
  req,
  res
) => {

  try {

    await Task.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Task Deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete failed",
    });
  }
};