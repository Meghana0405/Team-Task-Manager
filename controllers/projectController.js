const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {

  try {

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Project Created",
      project,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error creating project",
    });
  }
};

exports.getProjects = async (
  req,
  res
) => {

  try {

    const projects =
      await Project.find({
        createdBy: req.user.id,
      });

    res.status(200).json(projects);

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to fetch projects",
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project Updated",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project Deleted",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.addMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { memberId } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: memberId } },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Member Added",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: memberId } },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Member Removed",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

