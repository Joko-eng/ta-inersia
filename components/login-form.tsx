"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah");
      return;
    }

    // Ambil session untuk cek role
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    const role = session?.user?.role;

    // Semua role mengarah ke /dashboard karena folder kamu (dash)
    if (role === "admin") router.push("/dashboard");
    else if (role === "projectmanager") router.push("/dashboard");
    else router.push("/dashboard");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Masukan email dan password untuk mengakses sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                {/* Tambahkan name="email" */}
                <Input id="email" name="email" type="email" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-500"
                  >
                    Lupa Password?
                  </a>
                </div>
                {/* Tambahkan name="password" */}
                <Input id="password" name="password" type="password" required />
              </Field>

              {/* Tampilkan error jika ada */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Memproses..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
