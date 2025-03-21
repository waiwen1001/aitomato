import { Request, Response } from "express";

export const uploadFile = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  res.status(200).json({
    message: "File uploaded successfully",
    file: {
      filename: file.filename,
      path: file.path.replace(/\\/g, "/"),
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    },
  });
};
