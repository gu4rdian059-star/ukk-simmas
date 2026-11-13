"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { UserRole } from "@/types/database";

export async function loginWithSupabase(
  email: string,
  password: string
): Promise<{ success: boolean; role?: UserRole; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Attempt Supabase Auth sign-in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data?.user) {
      // Find role from profiles or metadata
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, nama")
        .eq("id", data.user.id)
        .single();

      let role: UserRole = "siswa";
      if (profile?.role) {
        role = profile.role as UserRole;
      } else if (data.user.app_metadata?.role) {
        role = data.user.app_metadata.role as UserRole;
      } else if (email.includes("admin")) {
        role = "admin";
      } else if (email.includes("guru")) {
        role = "guru";
      }

      // Log successful login
      try {
        await supabase.from("activity_logs").insert({
          user_id: data.user.id,
          actor_email: email,
          actor_role: role,
          action_type: "LOGIN_SUCCESS",
          entity_type: "AUTH",
          level: "INFO",
          metadata: { provider: "password" },
        });
      } catch {
        // Non-blocking log
      }

      return { success: true, role };
    }

    // 2. Demo fallback for local offline testing if Supabase Auth credentials haven't been seeded yet
    const cleanEmail = email.trim().toLowerCase();
    if (password === "password123") {
      let demoRole: UserRole | null = null;
      let demoName = "";

      if (cleanEmail === "admin@simmas.sch.id") {
        demoRole = "admin";
        demoName = "Administrator";
      } else if (cleanEmail === "guru@simmas.sch.id") {
        demoRole = "guru";
        demoName = "Guru Pembimbing";
      } else if (cleanEmail === "siswa@simmas.sch.id") {
        demoRole = "siswa";
        demoName = "Siswa Magang";
      }

      if (demoRole) {
        // Store demo session in cookie
        const cookieStore = await cookies();
        cookieStore.set(
          "simmas_demo_session",
          JSON.stringify({
            email: cleanEmail,
            role: demoRole,
            nama: demoName,
          }),
          {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            httpOnly: false,
            sameSite: "lax",
          }
        );

        return { success: true, role: demoRole };
      }
    }

    return {
      success: false,
      error: error?.message || "Email atau password salah.",
    };
  } catch (err: unknown) {
    // If Supabase client fails (e.g. invalid URL or missing env), check demo credentials
    const cleanEmail = email.trim().toLowerCase();
    if (
      password === "password123" &&
      (cleanEmail === "admin@simmas.sch.id" ||
        cleanEmail === "guru@simmas.sch.id" ||
        cleanEmail === "siswa@simmas.sch.id")
    ) {
      const demoRole: UserRole = cleanEmail.includes("admin")
        ? "admin"
        : cleanEmail.includes("guru")
        ? "guru"
        : "siswa";

      const cookieStore = await cookies();
      cookieStore.set(
        "simmas_demo_session",
        JSON.stringify({
          email: cleanEmail,
          role: demoRole,
          nama: cleanEmail.includes("admin")
            ? "Administrator"
            : cleanEmail.includes("guru")
            ? "Guru Pembimbing"
            : "Siswa Magang",
        }),
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
          sameSite: "lax",
        }
      );
      return { success: true, role: demoRole };
    }

    const message = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
    return { success: false, error: message };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  const cookieStore = await cookies();
  cookieStore.delete("simmas_demo_session");
}

export async function getCurrentUser(): Promise<{
  email: string;
  role: UserRole;
  nama: string;
  id?: string;
} | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, nama")
        .eq("id", user.id)
        .single();

      const role = (profile?.role ||
        user.app_metadata?.role ||
        (user.email?.includes("admin")
          ? "admin"
          : user.email?.includes("guru")
          ? "guru"
          : "siswa")) as UserRole;

      return {
        id: user.id,
        email: user.email || "",
        role,
        nama: profile?.nama || user.user_metadata?.nama || "Pengguna",
      };
    }
  } catch {
    // Check demo cookie
  }

  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("simmas_demo_session");
  if (demoCookie?.value) {
    try {
      const parsed = JSON.parse(demoCookie.value);
      return {
        email: parsed.email,
        role: parsed.role,
        nama: parsed.nama,
        id: "demo-user-id",
      };
    } catch {
      return null;
    }
  }

  return null;
}

