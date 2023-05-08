import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let bookId = req.query.bookId;

  if (Array.isArray(bookId)) {
    bookId = bookId[0];
  }

  if (req.method === "GET") {
    try {
      const book = await prisma.books.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading book" });
    }
  }
  
  else if (req.method === "PUT") {
    try
    {
      const book = await prisma.books.update({
        where: { id: bookId },
        data: { ...req.body },
      });

      res.status(200).json(book);
    }
    catch (error)
    {
      console.error(error);
      res.status(500).json({ message: "Error updating book" });
    }
  }
}
