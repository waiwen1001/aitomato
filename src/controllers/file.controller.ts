import { Request, Response } from "express";
import fs from "fs";
import path from "path";

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
      url: `${process.env.BASE_URL}/storage/temp/${file.filename}`,
    },
  });
};

export const copyFileToNewPath = async (oldPath: string, newPath: string) => {
  let actualOldPath = oldPath;
  
  if (oldPath.includes('http://') || oldPath.includes('https://') || oldPath.includes('localhost')) {
    const urlPath = oldPath.replace(/^https?:\/\/[^\/]+/, '').replace(/^localhost:\d+/, '');
    actualOldPath = path.join(process.cwd(), 'storage', urlPath.replace('/storage/', ''));
  } else if (oldPath.startsWith('/storage/')) {
    actualOldPath = path.join(process.cwd(), 'storage', oldPath.replace('/storage/', ''));
  }

  const newFullPath = path.join(process.cwd(), 'storage', newPath.replace('/storage/', ''));
  
  const newDir = path.dirname(newFullPath);
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true });
  }

  const oldFile = fs.readFileSync(actualOldPath);
  fs.writeFileSync(newFullPath, oldFile);

  const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
  return {
    filePath: newFullPath,
    url: `${baseUrl}/storage/${newPath}`
  };
};
