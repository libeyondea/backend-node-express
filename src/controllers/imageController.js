import APIError from '~/utils/apiError';
import ResizeImage from '~/utils/resizeImage';

export const uploadImage = async (req, res) => {
	if (!req.file) {
		throw new APIError('Please provide an image', 400, true);
	}
	const fileName = await ResizeImage(req.file.destination, req.file.filename);
	return res.json({ image: fileName });
};
