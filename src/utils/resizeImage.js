import sharp from 'sharp';

const ResizeImage = async (folder, fileName, options = { width: 300, height: 300 }) => {
	const newFileName = `${options.width}x${options.height}-` + fileName;
	await sharp(folder + '/' + fileName)
		.resize(options.width, options.height)
		.toFile(folder + '/' + newFileName);
	return newFileName;
};

export default ResizeImage;
