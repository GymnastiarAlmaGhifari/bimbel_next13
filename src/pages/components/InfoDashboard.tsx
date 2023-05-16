import ItemInfoDashboard from "./ItemInfoDashboard";

export default function InfoDashboard() {
  return (
    <div className="flex w-full h-48 p-4 bg-Neutral-100 rounded-lg gap-6">
      <ItemInfoDashboard
        label="Jumlah Pertemuan"
        value="7"
        bgEnd="to-Primary-90"
        bgStart="from-Primary-50"
        textColor="text-Primary-20"
      />
      <ItemInfoDashboard
        label="Jumlah Pertemuan"
        value="7"
        bgEnd="to-Secondary-90"
        bgStart="from-Secondary-50"
        textColor="text-Secondary-20"
      />
      <ItemInfoDashboard
        label="Jumlah Pertemuan"
        value="7"
        bgEnd="to-Tertiary-90"
        bgStart="from-Tertiary-50"
        textColor="text-Tertiary-20"
      />
      <ItemInfoDashboard
        label="Jumlah Pertemuan"
        value="7"
        bgEnd="to-Primary-90"
        bgStart="from-Primary-50"
        textColor="text-Primary-20"
      />
    </div>
  );
}
