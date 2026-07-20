"use client";
import { useMemo, useState } from "react";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("Todos");
  const categories = useMemo(() => ["Todos", ...Array.from(new Set(projects.map(p => p.category)))], [projects]);
  const visible = category === "Todos" ? projects : projects.filter(p => p.category === category);
  return <>
    <div className="filters" aria-label="Filtrar projetos por categoria">
      {categories.map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
    </div>
    <div className="project-grid">
      {visible.map(project => <ProjectCard key={project.id} project={project}/>) }
    </div>
  </>;
}
