import Feedback from "../models/feedbackModel.js";

export const createFeedback = async (req, res) => {
    try {
        const { userId, courseId, content, rating } = req.body;

        const feedback = new Feedback({
            userId, courseId, content, rating
        });
        await feedback.save();

        return res.status(201).json({ payload: feedback })
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
        });

        return res.status(200).json({ payload: feedbacks })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
