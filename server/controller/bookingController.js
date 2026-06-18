import PropertyModel from "../models/PropertySchema.js";
import UserModel from "../models/UserSchema.js";
import BookingModel from "../models/BookingSchema.js";

export const bookProperty = async (req, res) => {

    try {
        const { propertyId, userid } = req.params;
        const propertyData = await PropertyModel.findById(propertyId).populate("ownerId");
        const ownerId = propertyData.ownerId._id;
        const user = await UserModel.findById({ _id: userid }, { name: 1, phoneNumber: 1, email: 1, type: 1 });

        if (!propertyData) {
            return res.status(404).json({ message: "Property not found" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const booking = new BookingModel({
            propertyId,
            ownerId,
            userId: userid,
            tenantName: user.name,
            phoneNumber: user.phoneNumber,
            bookingStatus: "pending"
        });
        propertyData.availability = false;
        await propertyData.save();
        await booking.save();

        return res.status(200).json({ message: "Property booked successfully", booking: booking, property: propertyData, user: user });

        // return res.status(200).json({message:"Property booked successfully", user:user});

    } catch (error) {

        console.error("Error booking property:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const getUserBookings = async (req, res) => {
    try {

        const { userId } = req.params;
        const bookings = await BookingModel.find({ userId }).populate('propertyId').populate('ownerId');
        return res.status(200).json({ message: "User bookings fetched successfully", bookings });

    } catch (error) {

        console.error("Error fetching user bookings:", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}

export const cancelBooking = async (req, res) => {

    try {
        const { bookingId } = req.params;

        const bookingData = await BookingModel.findByIdAndDelete(bookingId);

        if (!bookingData) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const propertyId = bookingData.propertyId;
        await PropertyModel.findByIdAndUpdate(propertyId, { availability: true });

        return res.status(200).json({ message: "Booking canceled successfully" });



    } catch (error) {
        console.error("Error canceling booking:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}