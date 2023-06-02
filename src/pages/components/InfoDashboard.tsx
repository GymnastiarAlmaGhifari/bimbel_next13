import { FC } from "react";
import ItemInfoDashboard from "./ItemInfoDashboard";

interface InfoDashboard {
  tentor?: string;
  siswa?: string;
  dana?: string;
}


const InfoDashboard: FC<InfoDashboard> = ({
  tentor,
  siswa,
  dana
}) => {
  return (
    <div className="flex w-full h-48 p-4 bg-Neutral-100 rounded-lg gap-6">
      {
        tentor ? (
          <ItemInfoDashboard
            label="Jumlah Tentor"
            value={
              tentor ? tentor : "0"
            }
            bgEnd="to-Primary-90"
            bgStart="from-Primary-50"
            textColor="text-Primary-20"
          />
        ) : (
          ""
        )
      }



      <ItemInfoDashboard
        label="Jumlah Siswa"
        value={
          siswa ? siswa : "0"
        }
        bgEnd="to-Secondary-90"
        bgStart="from-Secondary-50"
        textColor="text-Secondary-20"
      />
      <ItemInfoDashboard
        label="Dana Masuk Bulan Ini"
        value={
          dana ? dana : "0"
        }
        bgEnd="to-Tertiary-90"
        bgStart="from-Tertiary-50"
        textColor="text-Tertiary-20"
      />
    </div>
  );
}

export default InfoDashboard