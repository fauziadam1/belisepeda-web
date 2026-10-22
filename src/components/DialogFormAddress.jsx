// src/components/DialogFormAddress.jsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useAddress } from "@/composables/useAddress";

const formSchema = z.object({
  label: z
    .string()
    .min(1, "Label alamat wajib diisi.")
    .max(255, "Maksimal 255 karakter."),
  recipient_name: z.string().min(1, "Nama penerima wajib diisi."),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi."),
  full_address: z.string().min(1, "Alamat lengkap wajib diisi."),
  province: z.string().min(1, "Provinsi wajib diisi."),
  city: z.string().min(1, "Kota/Kabupaten wajib diisi."),
  district: z.string().min(1, "Kecamatan wajib diisi."),
  postal_code: z.string().min(1, "Kode pos wajib diisi."),
  address_note: z.string().optional(),
});

export default function DialogFormAddress({ open, onOpenChange, onSuccess }) {
  const { createAddress } = useAddress();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      label: "",
      recipient_name: "",
      phone_number: "",
      full_address: "",
      province: "",
      city: "",
      district: "",
      postal_code: "",
      address_note: "",
    },
  });

  const {
    formState: { errors, isSubmitting, isValid },
  } = form;

  const onSubmit = async (data) => {
    const result = await createAddress(data);

    if (!result.success) {
      const message =
        typeof result.message === "string"
          ? result.message
          : result.message?.message || "Gagal membuat alamat.";

      form.setError("root", { message });
      return;
    }

    onSuccess();

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
        }
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form
          id="form-address"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>Tambah Alamat Pengiriman</DialogTitle>
            <DialogDescription>
              Masukkan detail informasi alamat pengiriman baru Anda.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-3">
            {/* Label Alamat */}
            <Controller
              name="label"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-address-label">
                    Label Alamat (Contoh: Rumah, Kantor)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-address-label"
                    placeholder="Rumah / Kantor"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Nama Penerima & No Telepon (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Controller
                name="recipient_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-address-recipient">
                      Nama Penerima
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-address-recipient"
                      placeholder="Nama lengkap penerima"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone_number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-address-phone">
                      Nomor Telepon
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-address-phone"
                      type="tel"
                      placeholder="08123456789"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Alamat Lengkap */}
            <Controller
              name="full_address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-address-full">
                    Alamat Lengkap & No. Jalan
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-address-full"
                    placeholder="Jalan Contoh No. 123"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Provinsi & Kota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Controller
                name="province"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-address-province">
                      Provinsi
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-address-province"
                      placeholder="DKI Jakarta"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-address-city">
                      Kota / Kabupaten
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-address-city"
                      placeholder="Jakarta Selatan"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Kecamatan & Kode Pos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Controller
                name="district"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-address-district">
                      Kecamatan
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-address-district"
                      placeholder="Kebayoran Baru"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="postal_code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-address-postal">
                      Kode Pos
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-address-postal"
                      placeholder="12120"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Catatan Alamat (Opsional) */}
            <Controller
              name="address_note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-address-note">
                    Catatan untuk Kurir (Opsional)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-address-note"
                    placeholder="Contoh: Rumah warna hijau pagar hitam"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {errors.root && <FieldError errors={[errors.root]} />}
          </FieldGroup>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <span className="shimmer">Menyimpan...</span>
              ) : (
                "Simpan Alamat"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
