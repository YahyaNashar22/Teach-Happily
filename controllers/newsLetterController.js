import NewsLetter from "../models/newsLetterModel.js";

export const addEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const newEmail = new NewsLetter({ email });
        await newEmail.save();
        res.status(200).json({ message: "تم إضافة البريد الإلكتروني بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "فشل إضافة البريد الإلكتروني" });
    }
}

export const getEmails = async (req, res) => {
    try {
        const emails = await NewsLetter.find();
        res.status(200).json({ emails });
    } catch (error) {
        res.status(500).json({ message: "فشل إسترجاع البريد الإلكتروني" });
    }
}

export const deleteEmail = async (req, res) => {
    try {
        const { id } = req.params;
        await NewsLetter.findByIdAndDelete(id);
        res.status(200).json({ message: "تم حذف البريد الإلكتروني بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "فشل حذف البريد الإلكتروني" });
    }
}