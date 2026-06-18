import cloudinary from '../config/cloudinary.js';

export const uploadPropertyImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files provided',
            });
        }

        const uploadedUrls = [];

        // Upload each file to Cloudinary
        for (const file of req.files) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'houserent/properties',
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                uploadStream.end(file.buffer);
            });

            uploadedUrls.push(result.secure_url);
        }

        res.status(200).json({
            success: true,
            message: 'Files uploaded successfully',
            imageUrls: uploadedUrls,
        });
    } catch (error) {
         res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: error.message,
        });
    }
};
