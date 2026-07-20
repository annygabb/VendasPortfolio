import { ExternalLink, ArrowRight } from "lucide-react";
import type { Project } from "@/types/project";

const labels = { online: "Online", desenvolvimento: "Em desenvolvimento", demonstracao: "Demonstração" };

export function ProjectCard({ project }: { project: Project }) {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5562999999999";
  const message = encodeURIComponent(`Olá, Anny! Vi o projeto ${project.title} e quero um site parecido para o meu negócio.`);
  return (
    <article className={`project-card ${project.featured ? "featured" : ""}`}>
      <div className="project-image">
        {project.image_url ? <img src={project.image_url} alt={`Projeto ${project.title}`} /> : <div className="image-placeholder">{project.title}</div>}
        <span className={`status status-${project.status}`}>{labels[project.status]}</span>
        {project.featured && <span className="featured-label">Destaque</span>}
      </div>
      <div className="project-content">
        <span className="category">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.short_description}</p>
        <p className="result"><strong>O que esse site entrega:</strong> {project.result_description}</p>
        <div className="project-actions">
          <a className="link-primary" href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer">Quero um site assim <ArrowRight size={16}/></a>
          {project.live_url && <a className="link-secondary" href={project.live_url} target="_blank" rel="noreferrer">Visitar ao vivo <ExternalLink size={15}/></a>}
        </div>
      </div>
    </article>
  );
}
