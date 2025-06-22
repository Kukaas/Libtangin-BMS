import Resident from '../models/residents.model.js';
import User from '../models/user.model.js';

// @desc    Get all residents
// @route   GET /api/residents
// @access  Private (Secretary or Admin)
export const getAllResidents = async (req, res) => {
    try {
        const residents = await Resident.find({}).populate('userId', 'email').lean();

        // The frontend expects specific field names and the status.
        // This mapping ensures consistency.
        const formattedResidents = residents.map(r => ({
            ...r,
            _id: r._id,
            firstName: r.firstName,
            lastName: r.lastName,
            email: r.userId?.email || 'N/A',
            phone: r.contactNumber,
            address: r.purok,
            status: r.status || 'pending', // Ensure status is always present
            createdAt: r.createdAt
        }));

        res.status(200).json(formattedResidents);
    } catch (error) {
        console.error("Error in getAllResidents controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Create a new resident
// @route   POST /api/residents
// @access  Private (Secretary or Admin)
export const createResident = async (req, res) => {
    try {
        // Note: This is a simplified create.
        // You might need more complex logic, like checking for an existing user
        // or creating a user account alongside the resident profile.
        const newResident = new Resident(req.body);
        await newResident.save();
        res.status(201).json(newResident);
    } catch (error) {
        console.error("Error in createResident controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Update a resident
// @route   PUT /api/residents/:id
// @access  Private (Secretary or Admin)
export const updateResident = async (req, res) => {
    try {
        const updatedResident = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedResident) {
            return res.status(404).json({ error: "Resident not found" });
        }
        res.status(200).json(updatedResident);
    } catch (error) {
        console.error("Error in updateResident controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Delete a resident
// @route   DELETE /api/residents/:id
// @access  Private (Secretary or Admin)
export const deleteResident = async (req, res) => {
    try {
        const deletedResident = await Resident.findByIdAndDelete(req.params.id);
        if (!deletedResident) {
            return res.status(404).json({ error: "Resident not found" });
        }
        // Also consider if you need to delete the associated user account
        // if (deletedResident.userId) {
        //     await User.findByIdAndDelete(deletedResident.userId);
        // }
        res.status(200).json({ message: "Resident deleted successfully" });
    } catch (error) {
        console.error("Error in deleteResident controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
