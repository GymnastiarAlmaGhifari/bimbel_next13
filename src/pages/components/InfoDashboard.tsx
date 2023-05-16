import ItemInfoDashboard from "./ItemInfoDashboard";

export default function InfoDashboard() {
  return (
    <div className="flex w-full h-48 p-4 bg-Neutral-100 rounded-lg gap-6">
      <ItemInfoDashboard label="Jumlah Pertemuan" value="7" bgEnd="Primary-90" bgStart="Primary-50"/>
      <ItemInfoDashboard label="Jumlah Kelas AKtif" value="4" bgEnd="Primary-90" bgStart="Primary-50"/>
      <ItemInfoDashboard label="Total Pembayaan SPP" value="12000000" bgEnd="Primary-90" bgStart="Primary-50"/>
      <ItemInfoDashboard label="Total Pembayaran" value="10000000" bgEnd="Primary-90" bgStart="Primary-50"/>
    </div>
  );
}
