/**
 * Validate file type
 */
export const validateFileType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: "No file provided",
        },
      });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
        },
      });
    }

    next();
  };
};

/**
 * Validate request body
 */
export const validateRequestBody = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
      });
    }

    next();
  };
};

export default {
  validateFileType,
  validateRequestBody,
};
