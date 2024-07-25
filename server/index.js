const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const User = require('./models/User');
const Resume = require('./models/Resume');
const Education = require('./models/Education');
const Experience = require('./models/Experience');
const Skills = require('./models/Skills');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Mathavaroopan:Mathavaroopan@cluster0.cmtda25.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/update-resume', async (req, res) => {
    const { resumeId, firstName, lastName, jobTitle, address, phone, email, summery, themeColor, education, experience, skills } = req.body;
    console.log(education);
    console.log(experience);
    if (!resumeId) {
        return res.status(400).send('Resume ID is required');
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        // Update user
        await User.updateOne({ email }, { firstName, lastName, email, phone, address, summery }, { session });

        // Find userId
        const user = await User.findOne({ email }).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send('User not found');
        }
        
        // Find existing resume
        const resume = await Resume.findOne({ id: resumeId }).session(session);
        if (!resume) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send('Resume not found');
        }

        // Delete existing education, experience, and skills documents
        await Education.deleteMany({ _id: { $in: resume.educationIds } }).session(session);
        await Experience.deleteMany({ _id: { $in: resume.experienceIds } }).session(session);
        await Skills.deleteMany({ _id: { $in: resume.skillsIds } }).session(session);

        // Update resume
        await Resume.updateOne({ id: resumeId }, { title: jobTitle, themeColor, userId: user._id }, { session });

        // Insert new education records
        let educationIds = [];
        if (education) {
            educationIds = await Promise.all(education.map(async edu => {
                const newEdu = new Education(edu);
                await newEdu.save({ session });
                return newEdu._id;
            }));
        }

        // Insert new experience records
        let experienceIds = [];
        if (experience) {
            experienceIds = await Promise.all(experience.map(async exp => {
                const newExp = new Experience(exp);
                await newExp.save({ session });
                return newExp._id;
            }));
        }

        // Insert new skills records
        let skillsIds = [];
        if (skills) {
            skillsIds = await Promise.all(skills.map(async skill => {
                const newSkill = new Skills(skill);
                await newSkill.save({ session });
                return newSkill._id;
            }));
        }

        // Update resume with new education, experience, and skills IDs
        await Resume.updateOne({ id: resumeId }, { educationIds, experienceIds, skillsIds }, { session });

        await session.commitTransaction();
        session.endSession();

        res.send({ message: 'Resume and related details updated successfully' });
    } catch (err) {
        console.error('Error updating resume:', err);
        res.status(500).send('Server error');
    }
});

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.post('/api/get-resume-ids', async (req, res) => {
    const { userEmail } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const resumes = await Resume.find({ userId: user._id });
        res.send(resumes);
    } catch (err) {
        console.error('Error fetching resume IDs:', err);
        res.status(500).send('Server error');
    }
});

app.get('/api/get-resume-details', async (req, res) => {
    const { resumeId } = req.query;

    if (!resumeId) {
        return res.status(400).send('Resume ID is required');
    }

    try {
        const resume = await Resume.findOne({ id: resumeId })
            .populate('userId')
            .populate('educationIds')
            .populate('experienceIds')
            .populate('skillsIds');
        if (!resume) {
            return res.status(404).send('Resume not found');
        }

        const formattedExperience = resume.experienceIds.map(exp => ({
            id: exp._id,
            title: exp.title,
            companyName: exp.companyName,
            city: exp.city,
            state: exp.state,
            startDate: exp.startDate,
            endDate: exp.endDate || '',
            currentlyWorking: !exp.endDate,
            workSummery: exp.workSummery || 'No work summary provided'
        }));

        res.send({
            resumeId: resumeId,
            firstName: resume.userId.firstName || null,
            lastName: resume.userId.lastName || null,
            jobTitle: resume.title || null,
            address: resume.userId.address || null,
            phone: resume.userId.phone || null,
            email: resume.userId.email,
            themeColor: resume.themeColor || '#ff6666',
            summery: resume.userId.summery || 'No summary provided',
            experience: formattedExperience,
            education: resume.educationIds,
            skills: resume.skillsIds
        });
    } catch (err) {
        console.error('Error fetching resume details:', err);
        res.status(500).send('Server error');
    }
});

app.post('/api/check-or-create-user', async (req, res) => {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
        return res.status(400).send('Email and fullName are required');
    }

    try {
        const user = await User.findOne({ email, firstName: fullName });
        if (user) {
            res.send({ message: 'User exists', user });
        } else {
            const newUser = new User({ firstName: fullName, email });
            await newUser.save();
            res.send({ message: 'User created', user: newUser });
        }
    } catch (err) {
        console.error('Error checking or creating user:', err);
        res.status(500).send('Server error');
    }
});

app.post('/api/create-resume', async (req, res) => {
    const { title, resumeId, userEmail, userName } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newResume = new Resume({ id: resumeId, title, userId: user._id });
        await newResume.save();
        res.status(201).send({ message: 'Resume created', resumeId });
    } catch (err) {
        console.error('Error creating resume:', err);
        res.status(500).send('Server error');
    }
});

app.listen(3001, () => {
    console.log("Server is running on 3001 port");
});
