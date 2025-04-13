import Feedback from "../models/feedbackModel.js";

export const createFeedback = async (req, res) => {
    try {
        const { userId, courseId, content, rating } = req.body;

        const feedback = new Feedback({
            userId, courseId, content, rating
        });
        await feedback.save();

        // Populate the userId field after saving
        const populatedFeedback = await Feedback.findById(feedback._id).populate("userId");


        return res.status(201).json({ payload: populatedFeedback })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


export const getCourseFeedbacks = async (req, res) => {
    try {
        const { courseId } = req.params;

        const feedbacks = await Feedback.find({
            courseId
        }).populate("userId");

        return res.status(200).json({ payload: feedbacks })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
