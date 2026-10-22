import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { User } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useAuth } from "@/composables/useAuth";
import { useUser } from "@/lib/user";

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png"];

const today = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD (waktu lokal)

// "+6281234567890" / "6281234567890" / "081234567890" -> "81234567890"
const toLocalPhone = (value) =>
  String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^(62|0)/, "");

// dipakai saat user mengetik / paste: hanya angka, tanpa awalan 0 atau 62
const normalizePhoneInput = (value) =>
  value.replace(/\D/g, "").replace(/^(0|62)+/, "");

const photoSchema = z
  .instanceof(File, { message: "File tidak valid." })
  .refine((file) => PHOTO_TYPES.includes(file.type), {
    message: "Ekstensi file harus .JPG, .JPEG, atau .PNG.",
  })
  .refine((file) => file.size <= MAX_PHOTO_SIZE, {
    message: "Ukuran file maksimum 2 MB.",
  });

const FIELDS = {
  name: {
    title: "Ubah Nama",
    label: "Nama",
    type: "text",
    placeholder: "John Doe",
    autoComplete: "name",
    schema: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(255, "Nama maksimal 255 karakter."),
  },
  birth_date: {
    title: "Ubah Tanggal Lahir",
    label: "Tanggal Lahir",
    type: "date",
    autoComplete: "bday",
    schema: z
      .string()
      .min(1, "Tanggal lahir wajib diisi.")
      .refine((value) => value < today(), {
        message: "Tanggal lahir harus sebelum hari ini.",
      }),
  },
  email: {
    title: "Ubah Email",
    label: "Email",
    type: "email",
    placeholder: "john@example.com",
    autoComplete: "email",
    schema: z
      .string()
      .trim()
      .min(1, "Email wajib diisi.")
      .email("Email tidak valid."),
  },
  phone_number: {
    title: "Ubah Nomor HP",
    label: "Nomor HP",
    type: "tel",
    prefix: "+62",
    placeholder: "81234567890",
    autoComplete: "tel-national",
    schema: z
      .string()
      .regex(/^8\d{8,11}$/, "Nomor HP tidak valid. Contoh: 81234567890."),
  },
};

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function InfoRow({ label, value, addLabel, onEdit, children }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="w-36 shrink-0 text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        {value && <span>{value}</span>}
        {children}
        <button
          type="button"
          onClick={onEdit}
          className="text-green-600 hover:underline"
        >
          {value ? "Ubah" : addLabel}
        </button>
      </div>
    </div>
  );
}

function EditDialog({ field, initialValue, onClose }) {
  const config = FIELDS[field];
  const { update } = useAuth();

  const form = useForm({
    resolver: zodResolver(z.object({ [field]: config.schema })),
    mode: "onChange",
    defaultValues: { [field]: initialValue ?? "" },
  });

  const {
    formState: { errors, isSubmitting, isValid, isDirty },
  } = form;

  async function onSubmit(data) {
    const value = config.prefix
      ? `${config.prefix}${data[field]}`
      : data[field];

    const result = await update({ [field]: value });

    if (!result.success) {
      const fieldMessage = result.errors?.[field]?.[0];

      if (fieldMessage) {
        form.setError(field, { message: fieldMessage });
      } else {
        form.setError("root", { message: result.message });
      }
      return;
    }

    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <form
          id={`form-edit-${field}`}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Controller
              name={field}
              control={form.control}
              render={({ field: formField, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`form-edit-${field}-input`}>
                    {config.label}
                  </FieldLabel>

                  {config.prefix ? (
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>{config.prefix}</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...formField}
                        onChange={(e) =>
                          formField.onChange(
                            normalizePhoneInput(e.target.value),
                          )
                        }
                        id={`form-edit-${field}-input`}
                        type={config.type}
                        inputMode="numeric"
                        placeholder={config.placeholder}
                        autoComplete={config.autoComplete}
                        aria-invalid={fieldState.invalid}
                        autoFocus
                      />
                    </InputGroup>
                  ) : (
                    <Input
                      {...formField}
                      id={`form-edit-${field}-input`}
                      type={config.type}
                      placeholder={config.placeholder}
                      autoComplete={config.autoComplete}
                      max={config.type === "date" ? today() : undefined}
                      aria-invalid={fieldState.invalid}
                      autoFocus
                    />
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {errors.root && <FieldError errors={[errors.root]} />}
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!isValid || !isDirty || isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function BiodataUser() {
  const { user } = useUser();
  const { update } = useAuth();
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoError("");

    const parsed = photoSchema.safeParse(file);
    if (!parsed.success) {
      setPhotoError(parsed.error.issues[0].message);
      return;
    }

    setUploading(true);
    const result = await update({ profile_photo: file });
    setUploading(false);

    if (!result.success) {
      setPhotoError(result.errors?.profile_photo?.[0] || result.message);
    }
  }

  const initialValue = (field) => {
    if (field === "birth_date") return String(user[field] ?? "").slice(0, 10);
    if (field === "phone_number") return toLocalPhone(user[field]);
    return user[field] ?? "";
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Biodata Diri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-[300px_1fr]">
            <Card className="h-fit">
              <CardContent className="space-y-4">
                <div className="aspect-square w-full overflow-hidden border bg-muted">
                  {user.profile_photo_url ? (
                    <img
                      src={user.profile_photo_url}
                      alt={user.name || "Profile"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <User className="size-20" />
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <p className="shimer">Memproses...</p>
                  ) : (
                    "Pilih Foto"
                  )}
                </Button>

                {photoError && (
                  <p className="text-sm text-destructive">{photoError}</p>
                )}

                <p className="text-sm text-muted-foreground">
                  Besar file: maksimum 2MB. Ekstensi file yang diperbolehkan:
                  .JPG .JPEG .PNG
                </p>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div className="space-y-5">
                <CardTitle className="text-base">Ubah Biodata Diri</CardTitle>

                <InfoRow
                  label="Nama"
                  value={user.name}
                  addLabel="Tambah Nama"
                  onEdit={() => setEditing("name")}
                />
                <InfoRow
                  label="Tanggal Lahir"
                  value={formatDate(user.birth_date)}
                  addLabel="Tambah Tanggal Lahir"
                  onEdit={() => setEditing("birth_date")}
                />
              </div>

              <div className="space-y-5">
                <CardTitle className="text-base">Ubah Kontak</CardTitle>

                <InfoRow
                  label="Email"
                  value={user.email}
                  addLabel="Tambah Email"
                  onEdit={() => setEditing("email")}
                >
                  {user.email_verified_at && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      Terverifikasi
                    </span>
                  )}
                </InfoRow>
                <InfoRow
                  label="Nomor HP"
                  value={user.phone_number}
                  addLabel="Tambah Nomor HP"
                  onEdit={() => setEditing("phone_number")}
                />
              </div>

              <div className="space-y-5">
                <CardTitle className="text-base">Ubah Media Sosial</CardTitle>

                <div>
                  
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editing && (
        <EditDialog
          key={editing}
          field={editing}
          initialValue={initialValue(editing)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
