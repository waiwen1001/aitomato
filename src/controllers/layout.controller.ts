import { Request, Response } from "express";
import { LayoutService } from "../services/layout.service";

const layoutService = new LayoutService();

export const getOutletLayouts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const layouts = await layoutService.getOutletLayouts({
      outletId: id,
      pax: 1,
    });
    res.status(200).json(layouts);
  } catch (error) {
    console.error("Error fetching layouts:", error);
    res.status(500).json({ message: "Failed to fetch layouts" });
  }
};
