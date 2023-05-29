import { FC } from "react";
import Image from "next/image";
import Button from "@/pages/components/buttons/Button";

interface Nota {
  data: any;
  onClose: () => void;
}

const LihatNota: FC<Nota> = ({ data, onClose }) => {
  return (
    <div>
      <div className="flex flex-col bg-Neutral-100 rounded-lg px-4 gap-3">
        <div className="flex justify-between">
          <div className="flex items-center h-max w-auto gap-3">
            <div className="h-14 w-14">
              <Image
                src={`/api/tagihan/nota?nota=` + data?.nota ? `/api/tagihan/nota?nota=` + data?.nota : "/img/user/default.png"}
                alt="Megachan"
                width={100}
                height={100}
                className="rounded-full w-full h-full object-cover"
                loader={({ src }) => `${src}?cache-control=no-store`}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            center
            bgColor="bg-Neutral-70"
            brColor=""
            label="Batal"
            textColor="text-Neutral-30"
            type="button"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default LihatNota;
