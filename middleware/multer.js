const multer = require('multer');
const FILE_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const isValid = FILE_TYPE_MAP[file.mimetype];
		let uploadError = new Error('invalid image Type');
		if (isValid) {
			uploadError = null;
		}
		cb(uploadError, './uploads/');
	},
	filename: function (req, file, cb) {
		file.mimetype;
		const fileName = file.originalname.split(' ').join('-');
		const extension = FILE_TYPE_MAP[file.mimetype];
		cb(null, `${fileName}-${Date.now()}.${extension}`);
	},
});
const filter = (req, file, cb) => {
	//reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'imge/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
const upload = multer({
	storage: storage,

	limits: {
		fileSize: 1024 * 1024 * 10,
	},
	fileFilter: filter,
});

module.exports = upload;
