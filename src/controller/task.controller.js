import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../model/task.model.js";
import { User } from "../model/user.model.js";
import { isValidObjectId } from "mongoose";


//all done expact register Task-> logged Out

// Fetch list of available members
const listOfAvablie = asyncHandler(async (req, res) => {
    const memberNames = [];
    const allUsers = await User.find();
    allUsers.forEach(user => {
        if (user.type === "member" && user.isCurrentlyAss <= 2) {
            memberNames.push(user.fullName);
        }
    });

    res.status(200).json(new ApiResponse(200, memberNames, "This contains all list of available members right now"));
});
//here is problem with us
// Register a new task
const registerTask = asyncHandler(async (req, res) => {
    console.log(req.users);
    const { _id: createdBy, type: itsType } = req.body;
    // console.log(req.users);

    if (itsType !== 'admin') {
        throw new ApiError(401, "You are not allowed to create a task");
    }

    const { title, deadline, description, memberID } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            deadline,
            assignedTo: memberID,
            createdBy,
        });

        if (!task) {
            throw new ApiError(500, "Task not created successfully");
        }

        res.status(200).json(new ApiResponse(200, task, "Task created successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while creating task");
    }
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
    const { taskId, status, progress } = req.body;

    if (!progress) {
        throw new ApiError(400, "Progress is required to update the task");
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, {
        $set: {
            status: status || "In Progress",
            progress
        }
    }, { new: true });

    if (!updatedTask) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const registerCard = asyncHandler(async (req, res) => {
    const {createdBy} = req.body;
    const user = await User.findById(createdBy);

    if(user.type !== "admin"){
        throw new ApiError(401, "You are not allowed to create a card");
    }
/**
 *
  {
  "title": "Build User Authentication Module",
  "description": "Develop and integrate user authentication with JWT for the project.",
  "status": "In Progress",
  "assignedTo": ["64ab5f8c7f5b340d5b0d3c8b", "64ab5f8c7f5b340d5b0d3c8c"],
  "createdBy": "66e8e55e9216915e7f19e022",
  "deadline": "2024-10-01T00:00:00.000Z",
  "progress": 40
    
  }
 */
    const { title, description, deadline, assignedTo,progress,status } = req.body;

    const task = await Task.create({
        title,
        description,
        deadline,
        assignedTo,
        createdBy,
        progress,
        status
    });

    if (!task) {
        throw new ApiError(500, "Task not created successfully");
    }

    res.status(200).json(new ApiResponse(200, task, "Task created successfully"));

})


// Read a task
const readTask = asyncHandler(async (req, res) => {
    const { taskId } = req.body;

    if (!taskId || !isValidObjectId(taskId)) {
        throw new ApiError(400, "Task ID is either empty or not valid");
    }

    const task = await Task.findById(taskId).populate('assignedTo createdBy').select("-password");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json(new ApiResponse(200, task, "Task details fetched successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.body;   

    if (!taskId || !isValidObjectId(taskId)) {
        throw new ApiError(400, "Task ID is either empty or not valid");
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json(new ApiResponse(200, deletedTask, "Task deleted successfully"));

});

export {
    registerCard,
    listOfAvablie,
    updateTask,
    readTask,
    deleteTask
};
