// src/components/DialogLogin.jsx
import { useState } from "react";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
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

const formSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export default function DialogLogin({
  open,
  onOpenChange,
  onSwitchToRegister,
}) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors, isSubmitting, isValid },
  } = form;

  const onSubmit = async (data) => {
    const result = await login(data);

    if (!result.success) {
      const message =
        typeof result.message === "string"
          ? result.message
          : result.message?.message || "Gagal masuk.";

      form.setError("root", { message });
      return;
    }

    form.reset();
    setShowPassword(false);
    onOpenChange(false);
  };

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
          id="form-login"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>Masuk</DialogTitle>
            <DialogDescription>
              Masukkan email dan password akun Anda.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-login-email"
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
                  <FieldLabel htmlFor="form-login-password">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="current-password"
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <Link
                    to="/forgot-password"
                    className="text-right text-foreground font-medium hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
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
              {isSubmitting ? <p className="shimmer">Memproses...</p> : "Masuk"}
            </Button>
            <span>
              Belum punya akun?{" "}
              <button
                type="button"
                className="hover:underline font-semibold"
                onClick={() => {
                  onOpenChange(false);
                  onSwitchToRegister?.();
                }}
              >
                Daftar
              </button>
            </span>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
