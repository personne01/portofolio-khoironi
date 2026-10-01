"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import { ErrorBanner, SubmitButton, TextInput } from "@/components/admin/fields";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await adminApi.login(username, password);
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Unable to sign in");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
      <ErrorBanner message={error} />
      <TextInput id="username" value={username} onChange={setUsername} placeholder="Username" />
      <TextInput id="password" value={password} onChange={setPassword} type="password" placeholder="Password" />
      <SubmitButton pending={pending} pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
