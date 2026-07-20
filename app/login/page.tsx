"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

function translateAuthError(message: string): string {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Seu e-mail ainda não foi confirmado no Supabase.";
  }

  if (normalizedMessage.includes("user not found")) {
    return "Usuário não encontrado.";
  }

  if (normalizedMessage.includes("too many requests")) {
    return "Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.";
  }

  if (normalizedMessage.includes("failed to fetch")) {
    return "Não foi possível conectar ao Supabase. Verifique a URL, a chave pública e sua internet.";
  }

  return `Erro ao entrar: ${message}`;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Digite seu e-mail.");
      return;
    }

    if (!password) {
      setError("Digite sua senha.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const {
        data,
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        console.error("Erro retornado pelo Supabase:", signInError);

        setError(translateAuthError(signInError.message));
        return;
      }

      if (!data.user || !data.session) {
        setError("O login não criou uma sessão válida. Tente novamente.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (caughtError) {
      console.error("Erro inesperado no login:", caughtError);

      if (caughtError instanceof Error) {
        setError(translateAuthError(caughtError.message));
      } else {
        setError("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="brand" href="/">
          annygabrielly<span>_</span>
        </Link>

        <h1>Entrar no painel</h1>

        <p>
          Use o e-mail e a senha do usuário administrador criado no Supabase.
        </p>

        <label htmlFor="email">
          E-mail

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            disabled={loading}
          />
        </label>

        <label htmlFor="password">
          Senha

          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </label>

        {error && (
          <p className="form-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}