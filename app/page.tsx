import { ArrowDown, ArrowRight, Check, MessageCircle, Search, ShieldCheck, Smartphone } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { ProjectGallery } from "@/components/ProjectGallery";
import type { Project } from "@/types/project";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("published", true).order("featured", { ascending: false }).order("display_order", { ascending: true });
  const projects = (data || []) as Project[];
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5562999999999";
  const link = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá, Anny! Quero solicitar um orçamento para meu site.")}`;

  return <main>
    <header className="header container">
      <a className="brand" href="#topo">annygabrielly<span>_</span></a>
      <nav><a href="#beneficios">Por que ter um site</a><a href="#projetos">Projetos</a><a href="#processo">Como funciona</a></nav>
      <a className="button small" href={link} target="_blank">Quero meu orçamento</a>
    </header>

    <section id="topo" className="hero container">
      <div><p className="eyebrow">// desenvolvedora web & designer</p><h1>Seu negócio merece ser <em>encontrado</em> — e escolhido.</h1><p className="lead">Sites profissionais, sistemas personalizados e manutenção sob medida para empresas de todos os tamanhos e segmentos.</p><div className="hero-actions"><a className="button" href={link} target="_blank">Quero meu site profissional <ArrowRight size={18}/></a><a className="button ghost" href="#projetos">Ver projetos</a></div></div>
      <div className="hero-panel"><span>Seu negócio hoje</span><div className="before-after"><div><b>Antes</b><p>Depende apenas do Instagram</p><p>Repete informações no WhatsApp</p><p>Perde clientes fora do horário</p></div><ArrowDown/><div><b>Depois</b><p>É encontrado no Google</p><p>Transmite confiança em segundos</p><p>Capta contatos 24 horas</p></div></div></div>
    </section>

    <section id="beneficios" className="section container"><p className="eyebrow">// o que você ganha</p><h2>Um site que trabalha pelo seu negócio</h2><div className="benefit-grid">
      <article><Search/><h3>Encontrado no Google</h3><p>Uma base profissional para sua empresa aparecer quando o cliente procura pelo serviço.</p></article>
      <article><ShieldCheck/><h3>Mais credibilidade</h3><p>Apresente sua marca, serviços e diferenciais com clareza para facilitar a decisão.</p></article>
      <article><MessageCircle/><h3>Mais contatos</h3><p>WhatsApp e chamadas para ação nos pontos certos, conduzindo o visitante até você.</p></article>
      <article><Smartphone/><h3>Perfeito no celular</h3><p>Experiência rápida e organizada em qualquer tamanho de tela.</p></article>
    </div></section>

    <section id="projetos" className="section projects-section"><div className="container"><p className="eyebrow">// projetos cadastrados pelo painel</p><h2>Soluções pensadas para cada segmento</h2><p className="section-intro">Os projetos abaixo são carregados automaticamente do Supabase. Ao publicar pelo painel administrativo, o novo card aparece aqui.</p>{projects.length ? <ProjectGallery projects={projects}/> : <div className="empty-public">Nenhum projeto publicado ainda. Entre em <strong>/admin</strong> para cadastrar o primeiro.</div>}</div></section>

    <section id="processo" className="section container"><p className="eyebrow">// simples do início ao fim</p><h2>Como seu projeto será executado</h2><div className="steps"><article><span>01</span><h3>Briefing e estratégia</h3><p>Entendo o negócio, público, objetivos e informações que precisam aparecer.</p></article><article><span>02</span><h3>Design e desenvolvimento</h3><p>Crio a experiência visual, textos, estrutura e integrações necessárias.</p></article><article><span>03</span><h3>Aprovação e publicação</h3><p>Você revisa, solicita ajustes e o projeto é publicado com domínio profissional.</p></article></div></section>

    <section className="cta-section"><div className="container"><div><p className="eyebrow">// atendimento online para todo o Brasil</p><h2>Vamos transformar sua presença digital?</h2><p>Converse diretamente comigo e receba uma proposta adequada ao seu projeto.</p></div><a className="button light" href={link} target="_blank">Falar com a Anny <ArrowRight size={18}/></a></div></section>
    <footer className="footer container"><span className="brand">annygabrielly<span>_</span></span><p>Sites profissionais, sistemas personalizados e manutenção.</p><a href="/login">Área administrativa</a></footer>
  </main>;
}
