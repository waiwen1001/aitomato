import { Request, Response } from "express";
import { TableService } from "../services/table.service";

const tableService = new TableService();

export const getOutletTables = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tables = await tableService.getOutletTables({
      outletId: id,
      pax: 1,
    });
    res.status(200).json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ message: "Failed to fetch tables" });
  }
};
