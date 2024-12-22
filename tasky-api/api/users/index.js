import express from 'express';
import bcrypt from 'bcrypt';
import User from './userModel';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from the response
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ code: 500, msg: 'Internal Server Error', error: error.message });
    }
});

// Register(Create) or Authenticate User
router.post('/', async (req, res) => {
    try {
        const { action } = req.query;
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                code: 400,
                msg: 'Username and password are required.',
            });
        }

        if (action === 'register') {
            // Register user
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({
                    code: 409,
                    msg: 'Username already exists.',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt
            const user = new User({ username, password: hashedPassword });
            await user.save();
            res.status(201).json({
                code: 201,
                msg: 'Successfully created new user.',
            });
        } else {
            // Authenticate user
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({
                    code: 401,
                    msg: 'Authentication failed: Invalid username or password.',
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    code: 401,
                    msg: 'Authentication failed: Invalid username or password.',
                });
            }

            res.status(200).json({
                code: 200,
                msg: 'Authentication successful.',
                token: 'TEMPORARY_TOKEN', // Replace this with JWT token in the future
            });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                code: 400,
                msg: 'Validation Error',
                errors: error.errors,
            });
        } else {
            res.status(500).json({
                code: 500,
                msg: 'Internal Server Error',
                error: error.message,
            });
        }
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body._id) delete req.body._id;
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10); // Hash updated password
        }

        const result = await User.updateOne({ _id: id }, req.body);

        if (result.matchedCount) {
            res.status(200).json({
                code: 200,
                msg: 'User updated successfully.',
            });
        } else {
            res.status(404).json({
                code: 404,
                msg: 'Unable to update user: User not found.',
            });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                code: 400,
                msg: 'Validation Error',
                errors: error.errors,
            });
        } else {
            res.status(500).json({
                code: 500,
                msg: 'Internal Server Error',
                error: error.message,
            });
        }
    }
});

export default router;
