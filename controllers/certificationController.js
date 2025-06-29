import Certification from '../models/certificationModel.js';

export const generateCertification = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        const existing = await Certification.findOne({ studentId, courseId });
        if (existing) return res.status(400).json({ message: 'Certificate already exists' });

        const certification = new Certification({ studentId, courseId });
        await certification.save();

        return res.status(200).json({ payload: certification })

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


export const getCertificationById = async (req, res) => {
    try {
        const { id } = req.params;

        const certification = await Certification.findById(id);

        if (!certification) return res.status(404).json({ message: 'Certificate not found' });

        return res.status(200).json({ payload: certification })

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCertificationsByUserId = async (req, res) => {
    try {
        const { studentId } = req.body;

        const certifications = await Certification.find({ studentId });

        return res.status(200).json({ payload: certifications })

    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

