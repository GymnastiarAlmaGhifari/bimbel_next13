"use client";
import { MdOutlineSort, MdModeEdit, MdHistory } from "react-icons/md";
import Search from "./Search";
import Button from "./buttons/Button";
import { IoIosAdd } from "react-icons/io";
import { FC } from "react";
import riwayat from "../riwayat";
import Link from "next/link";
import FilterKelompok from "./dropdownHeadtable/filterKelompok";

interface HeadTableProps {
  role?: boolean;
  bulanPembayaran?: boolean;
  tahunPembayaran?: boolean;
  riwayat?: boolean;
  filterKelompok?: boolean;
  withfilter?: boolean;
  onClick?: () => void;
  noLabel?: boolean;
  noSearch?: boolean;
  noAdd?: boolean;
  label: string;
  onChange?: (value: string) => void;
  nama_kelompok?: string;
}

const HeadTable: React.FC<HeadTableProps> = ({
  role,
  withfilter,
  onClick,
  noAdd,
  label,
  filterKelompok,
  bulanPembayaran,
  tahunPembayaran,
  onChange,
  noSearch,
  riwayat,
  nama_kelompok,
  noLabel,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="bg-Neutral-100 flex flex-row items-center h-[72px] px-5">
      <div className="flex flex-row items-center gap-14 w-full">
        {noLabel ? (
          ""
        ) : (
          <h2 className="text-xl font-semibold text-Primary-10">{label}</h2>
        )}

        <div className="flex flex-row items-center gap-4">
          {noSearch ? "" : <Search onChange={handleInputChange} />}
          {withfilter ? (
            <button className="flex gap-1">
              <MdOutlineSort size={24} />
              <span className="text-sm font-bold text-Neutral-20">Filter</span>
            </button>
          ) : (
            ""
          )}
          {filterKelompok ? <FilterKelompok /> : ""}
          {bulanPembayaran ? (
            <span className="inline-block flex items-center text-center py-2 px-4 bg-Primary-40 rounded-full text-Neutral-100 font-semibold">
              Bulan
            </span>
          ) : (
            ""
          )}
          {tahunPembayaran ? (
            <span className="inline-block flex items-center text-center py-2 px-4 bg-Primary-40 rounded-full text-Neutral-100 font-semibold">
              Tahun
            </span>
          ) : (
            ""
          )}

          {/* <h1>
            Kelompok {nama_kelompok}
          </h1> */}
        </div>
      </div>
      <div className="flex gap-4">
        {riwayat ? (
          <Link href={"/pembayaran/riwayatPembayaran"}>
            <Button
              type="button"
              brColor="border-Tertiary-50"
              textColor="text-Tertiary-50"
              bgColor="bg-Tertiary-50"
              label="Riwayat Pembayaran"
              icon={MdHistory}
              onClick={onClick}
              outlined
            />
          </Link>
        ) : (
          ""
        )}
        {noAdd ? (
          ""
        ) : (
          <Button
            type="button"
            brColor="border-Tertiary-50"
            textColor="text-Tertiary-50"
            bgColor="bg-Tertiary-50"
            label="Tambah"
            icon={IoIosAdd}
            onClick={onClick}
            outlined
          />
        )}
        {role ? (
          <Button
            type="button"
            brColor="border-Primary-40"
            textColor="text-Primary-40"
            bgColor="bg-Primary-40"
            label="Role"
            outlined
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default HeadTable;
