// src/components/DialogRegister.jsx
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CircleCheck, Eye, EyeOff } from "lucide-react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { useAuth } from "@/composables/useAuth";
import { cn } from "@/lib/utils";

const passwordRules = [
  { id: "length", label: "Minimal 6 karakter", test: (v) => v.length >= 6 },
  { id: "number", label: "Minimal 1 angka", test: (v) => /\d/.test(v) },
  {
    id: "lowercase",
    label: "Minimal 1 huruf kecil",
    test: (v) => /[a-z]/.test(v),
  },
  {
    id: "uppercase",
    label: "Minimal 1 huruf besar",
    test: (v) => /[A-Z]/.test(v),
  },
];

const formSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  email: z.string().email("Email tidak valid."),
  password: z
    .string()
    .refine((v) => passwordRules.every((rule) => rule.test(v)), {
      message: "Password belum memenuhi semua syarat.",
    }),
});

export default function DialogRegister({
  open,
  onOpenChange,
  onSwitchToLogin,
}) {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors, isSubmitting, isValid },
  } = form;

  const password = form.watch("password");

  async function onSubmit(data) {
    const result = await register(data);

    if (!result.success) {
      const message =
        typeof result.message === "string"
          ? result.message
          : result.message?.message || "Gagal mendaftar.";

      form.setError("root", { message });
      return;
    }

    form.reset();
    setShowPassword(false);
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
          setShowPassword(false);
        }
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <form
          id="form-register"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>Daftar</DialogTitle>
            <DialogDescription>
              Buat akun baru untuk mulai berbelanja.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-name">Nama</FieldLabel>
                  <Input
                    {...field}
                    id="form-register-name"
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-register-email"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-password">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        size="icon-xs"
                        aria-label={
                          showPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>

                  <ul className="mt-2 space-y-1.5">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(password);

                      return (
                        <li
                          key={rule.id}
                          className={cn(
                            "flex items-center gap-2 text-xs transition-colors",
                            passed
                              ? "text-green-600 dark:text-green-500"
                              : "text-muted-foreground",
                          )}
                        >
                          <CircleCheck
                            className={cn(
                              "size-4",
                              passed
                                ? "fill-green-600 text-white dark:fill-green-500"
                                : "fill-muted-foreground/40 text-white",
                            )}
                          />
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </Field>
              )}
            />

            {errors.root && <FieldError errors={[errors.root]} />}
          </FieldGroup>

          <DialogFooter className="flex flex-col! items-center">
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <p className="shimmer">Memproses...</p>
              ) : (
                "Daftar"
              )}
            </Button>
            <span>
              Sudah punya akun?{" "}
              <button
                type="button"
                className="hover:underline font-semibold"
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToLogin?.();
                }}
              >
                Masuk
              </button>
            </span>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
