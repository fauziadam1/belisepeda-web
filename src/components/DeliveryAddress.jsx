import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useAddress } from "@/composables/useAddress";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Badge } from "./ui/badge";
import DialogFormAddress from "./DialogFormAddress";

export default function DeliveryAddress() {
  const { getAddress, chooseAddress, deleteAddress } = useAddress();

  const queryClient = useQueryClient();

  const [deletingId, setDeletingId] = useState(null);
  const [FormAddress, setFormAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isChoosing, setIsChoosing] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["delivery-addresses", debouncedSearch],
    queryFn: () => getAddress({ search: debouncedSearch }),
  });

  const handleChooseAddress = async (id) => {
    if (isChoosing) return;

    setIsChoosing(true);

    try {
      const result = await chooseAddress(id);

      if (!result.success) {
        console.error(result.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["delivery-addresses"],
      });
    } catch (error) {
      console.error("Gagal memilih alamat:", error);
    } finally {
      setIsChoosing(false);
    }
  };

  const addresses = data?.data ?? [];

  const handleDelete = async (id) => {
    if (deletingId) return;

    setDeletingId(id);
    try {
      const result = await deleteAddress(id);

      if (!result.success) {
        console.error(result.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["delivery-addresses"],
      });
    } catch (error) {
      console.error("Gagal hapus alamat:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <Card className="pb-5!">
        <CardHeader>
          <CardTitle>Alamat Pengiriman</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <InputGroup className="max-w-6xl">
              <InputGroupInput
                id="search-address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari label, alamat, penerima, dll."
              />

              <InputGroupAddon align="inline-end">
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>

            <Button onClick={() => setFormAddress(true)}>Tambah Alamat</Button>
          </div>

          {isLoading ? (
            <div className="shimmer flex w-full items-center justify-center gap-2 py-6">
              <Spinner />
              <p className="text-muted-foreground">Memuat alamat...</p>
            </div>
          ) : isError || data?.success === false ? (
            <p className="py-4 text-center text-red-500">
              Gagal memuat alamat: {error?.message || data?.message}
            </p>
          ) : addresses.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              Tidak ada alamat ditemukan.
            </p>
          ) : (
            <div className="space-y-3">
              {addresses.map((Item) => (
                <Card
                  key={Item.id}
                  onClick={() => handleChooseAddress(Item.id)}
                  className={`cursor-pointer transition-colors relative ${
                    Item.isChoose
                      ? "border-primary border"
                      : "hover:border-primary/50"
                  }`}
                >
                  <CardHeader>
                    {Item.isChoose == true && (
                      <span className="absolute w-9 h-9 bg-primary top-0 right-0 rounded-bl-full" />
                    )}
                    <CardTitle className={"font-semibold"}>
                      {Item.label}
                      {Item.isChoose ? (
                        <Badge variant="secondary" className={"ml-1"}>
                          Utama
                        </Badge>
                      ) : (
                        ""
                      )}
                    </CardTitle>
                    <CardDescription className={"flex items-center gap-1"}>
                      Penerima:{" "}
                      <p className="font-semibold text-foreground">
                        {Item.recipient_name}
                      </p>
                    </CardDescription>
                    <p>{Item.phone_number}</p>
                    <div className="text-muted-foreground flex items-center gap-1">
                      Alamat:
                      <p className="text-foreground font-semibold">
                        {Item.full_address}, {Item.district}, {Item.city},{" "}
                        {Item.province}. ({Item.address_note})
                      </p>
                    </div>
                  </CardHeader>

                  <CardFooter className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Tambahkan fungsi ubah alamat di sini.
                      }}
                    >
                      Ubah Alamat
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(Item.id);
                      }}
                    >
                      {deletingId === Item.id ? (
                        <div className="shimmer flex w-full items-center justify-center gap-2 py-6">
                          <Spinner />
                          <p className="text-muted-foreground">
                            Menghapus...
                          </p>
                        </div>
                      ) : (
                        "Hapus Alamat"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DialogFormAddress
        open={FormAddress}
        onOpenChange={setFormAddress}
        onSuccess={async () => {
          await queryClient.invalidateQueries({
            queryKey: ["delivery-addresses"],
          });

          setFormAddress(false);
        }}
      />
    </div>
  );
}
