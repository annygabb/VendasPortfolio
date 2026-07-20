import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { AdminDashboard } from "@/components/AdminDashboard";
import type { Project } from "@/types/project";

export const revalidate = 0;
export default async function AdminPage(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");const {data:admin}=await supabase.from("admins").select("user_id").eq("user_id",user.id).maybeSingle();if(!admin)return <main className="auth-page"><div className="auth-card"><h1>Acesso não autorizado</h1><p>O usuário entrou, mas ainda não foi adicionado à tabela <strong>admins</strong> no Supabase.</p><a className="button" href="/">Voltar ao site</a></div></main>;const {data}=await supabase.from("projects").select("*").order("display_order");return <AdminDashboard initialProjects={(data||[]) as Project[]}/>;}
