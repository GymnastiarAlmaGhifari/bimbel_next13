import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const books = await prisma.books.findMany();
      res.status(200).json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error loading books." });
    }
  } else if (req.method === "POST") {
    const { title, author, description, price } = req.body;

    try {
      const book = await prisma.books.create({
        data: {
          title,
          author,
          description,
          price,
        },
      });
      res.status(201).json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating book." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
