
import { GetServerSideProps } from "next";
import prisma from "@/libs/prismadb";
import Link from "next/link";
import { useRouter } from "next/router";
import HeadTable from "../components/HeadTable";
import CardExample from "@/pages/components/cardExample";

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { signOut } from 'next-auth/react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ModalDetail } from '@/pages/components/Modal';
import BookEdit from './edit/index';
import fetcher from '@/libs/fetcher';


interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  books: Book[];
}


const Dashboard: React.FC<Props> = ({ books }) => {
  const router = useRouter();
  const backDashboard = () => {
    router.push("/dashboard");
  };
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />

      <div className="w-full flex flex-col ">
        <Navbar />
        <div className="h-full p-10 bg-Neutral-95 ">
          <div className="flex flex-col h-full bg-Neutral-100 py-4 gap-4 rounded-lg">
            <HeadTable />
            <div className="flex flex-col rounded-bl-lg rounded-br-lg p-4 gap-4 overflow-y-auto scrollbar-thin scrollbar-track-Neutral-100 scrollbar-thumb-Primary-40 scrollbar-rounded-lg">
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
              <CardExample/>
            </div>
            {/* <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.description}</td>
                    <td>{book.price}</td>
                    <td>{book.createdAt.toString()}</td>
                    <td>{book.updatedAt.toString()}</td>
                    <td>
                      <Link
                        href={`/dashboard/?edit=${book.id}`}
                        as={`/dashboard/edit`}
                      >
                        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20">
                          edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {router.query.edit && (
              <ModalDetail onOpen={true} onClose={backDashboard}>
                <BookEdit
                  bookId={router.query.edit as string}
                  onClose={backDashboard}
                />
              </ModalDetail>
            )} */}
          </div> </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const books = await prisma.books.findMany();
  // Convert Date objects to string
  const serializedBooks = books.map((book) => ({
    ...book,
    createdAt: book.createdAt.toString(),
    updatedAt: book.updatedAt.toString(),
  }));
  return {
    props: {
      books: serializedBooks,
    },
  };
};

export default Dashboard;
