import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let programId = req.query.programId;

  if (Array.isArray(programId)) {
    programId = programId[0];
  }

  if (req.method === "GET") {
    try {
      const program = await prisma.program.findUnique({
        where: { id: programId },
      });

      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }

      res.status(200).json(program);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading program" });
    }
  } else if (req.method === "PUT") {
    try {
      const program = await prisma.program.update({
        where: { id: programId },
        data: { ...req.body },
      });

      res.status(200).json(program);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating program" });
    }
  }
}
