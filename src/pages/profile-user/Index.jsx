import BiodataUser from "@/components/Biodata";
import DeliveryAddress from "@/components/DeliveryAddress";
import { useUser } from "@/lib/user";

export default function ProfileUser() {
  const { user } = useUser();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <span className="flex items-center gap-3 text-sm font-semibold">
        <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> {user.name}
      </span>
      <BiodataUser />
      <DeliveryAddress />
    </div>
  );
}
