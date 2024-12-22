import express from 'express';
import bcrypt from 'bcrypt';
import User from './userModel';
import jwt from 'jsonwebtoken';

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

//.... code as before

// register(Create)/Authenticate User
router.post('/', asyncHandler(async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ success: false, msg: 'Username and password are required.' });
        }
        if (req.query.action === 'register') {
            await registerUser(req, res);
        } else {
            await authenticateUser(req, res);
        }
    } catch (error) {
        // Log the error and return a generic error message
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal server error.' });
    }
}));


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
async function registerUser(req, res) {
    // Add input validation logic here
    await User.create(req.body);
    res.status(201).json({ success: true, msg: 'User successfully created.' });
}

async function authenticateUser(req, res) {
    const user = await User.findByUserName(req.body.username);
    if (!user) {
        return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        const token = jwt.sign({ username: user.username }, process.env.SECRET);
        res.status(200).json({ success: true, token: 'BEARER ' + token });
    } else {
        res.status(401).json({ success: false, msg: 'Wrong password.' });
    }
}

export default router;
