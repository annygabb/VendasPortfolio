"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit3,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase-browser";
import type {
  Project,
  ProjectInput,
  ProjectStatus,
} from "@/types/project";

const PORTFOLIO_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://portfoliosolucoesanny.vercel.app";

const emptyProject: ProjectInput = {
  title: "",
  slug: "",
  category: "",
  short_description: "",
  result_description: "",
  image_url: null,
  live_url: null,
  status: "online",
  featured: false,
  published: true,
  display_order: 0,
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminDashboard({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState<ProjectInput>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!editingId) {
      setForm((currentForm) => ({
        ...currentForm,
        slug: slugify(currentForm.title),
      }));
    }
  }, [form.title, editingId]);

  function updateForm<K extends keyof ProjectInput>(
    field: K,
    value: ProjectInput[K]
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function newProject() {
    setEditingId(null);
    setForm({
      ...emptyProject,
      display_order: projects.length,
    });
    setMessage("");
    setOpen(true);
  }

  function editProject(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title,
      slug: project.slug,
      category: project.category,
      short_description: project.short_description,
      result_description: project.result_description,
      image_url: project.image_url,
      live_url: project.live_url,
      status: project.status,
      featured: project.featured,
      published: project.published,
      display_order: project.display_order,
    });

    setMessage("");
    setOpen(true);
  }

  function closeModal() {
    if (saving || uploading) {
      return;
    }

    setOpen(false);
    setEditingId(null);
    setMessage("");
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setMessage("");

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const safeName = slugify(originalName) || "projeto";

      const path = `${Date.now()}-${safeName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setMessage(`Erro ao enviar a imagem: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage
        .from("project-images")
        .getPublicUrl(path);

      updateForm("image_url", data.publicUrl);
    } catch (error) {
      console.error("Erro inesperado no upload:", error);
      setMessage("Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || uploading) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload: ProjectInput = {
        ...form,
        title: form.title.trim(),
        slug: slugify(form.slug || form.title),
        category: form.category.trim(),
        short_description: form.short_description.trim(),
        result_description: form.result_description.trim(),
        image_url: form.image_url || null,
        live_url: form.live_url?.trim() || null,
        display_order: Number(form.display_order) || 0,
      };

      if (!payload.slug) {
        setMessage("Informe um nome válido para o projeto.");
        return;
      }

      const query = editingId
        ? supabase
            .from("projects")
            .update(payload)
            .eq("id", editingId)
            .select()
            .single()
        : supabase
            .from("projects")
            .insert(payload)
            .select()
            .single();

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao salvar projeto:", error);
        setMessage(`Erro ao salvar: ${error.message}`);
        return;
      }

      const savedProject = data as Project;

      if (editingId) {
        setProjects((currentProjects) =>
          currentProjects.map((project) =>
            project.id === editingId ? savedProject : project
          )
        );
      } else {
        setProjects((currentProjects) =>
          [...currentProjects, savedProject].sort(
            (a, b) => a.display_order - b.display_order
          )
        );
      }

      setOpen(false);
      setEditingId(null);
      setForm(emptyProject);
      router.refresh();
    } catch (error) {
      console.error("Erro inesperado ao salvar:", error);
      setMessage("Não foi possível salvar o projeto.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleProject(
    project: Project,
    field: "published" | "featured"
  ) {
    const newValue = !project[field];
    setMessage("");

    const { error } = await supabase
      .from("projects")
      .update({
        [field]: newValue,
      })
      .eq("id", project.id);

    if (error) {
      console.error("Erro ao atualizar projeto:", error);
      setMessage(`Erro ao atualizar: ${error.message}`);
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((currentProject) =>
        currentProject.id === project.id
          ? {
              ...currentProject,
              [field]: newValue,
            }
          : currentProject
      )
    );

    router.refresh();
  }

  async function removeProject(project: Project) {
    const confirmed = window.confirm(
      `Deseja realmente excluir “${project.title}”?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      console.error("Erro ao excluir projeto:", error);
      setMessage(`Erro ao excluir: ${error.message}`);
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.filter(
        (currentProject) => currentProject.id !== project.id
      )
    );

    router.refresh();
  }

  async function logout() {
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a
          className="brand"
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          annygabrielly<span>_</span>
        </a>

        <nav>
          <a className="active" href="/admin">
            Projetos
          </a>

          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visualizar site
          </a>
        </nav>

        <button type="button" onClick={logout}>
          <LogOut size={17} />
          Sair
        </button>
      </aside>

      <main className="admin-main">
        <header>
          <div>
            <p className="eyebrow">// painel administrativo</p>
            <h1>Projetos</h1>
            <p>
              Cadastre e publique novos trabalhos sem editar o código.
            </p>
          </div>

          <button
            type="button"
            className="button"
            onClick={newProject}
          >
            <Plus size={18} />
            Novo projeto
          </button>
        </header>

        <div className="admin-stats">
          <article>
            <strong>{projects.length}</strong>
            <span>Total</span>
          </article>

          <article>
            <strong>
              {projects.filter((project) => project.published).length}
            </strong>
            <span>Publicados</span>
          </article>

          <article>
            <strong>
              {projects.filter((project) => project.featured).length}
            </strong>
            <span>Destaques</span>
          </article>
        </div>

        {message && !open && (
          <p className="form-error" role="alert">
            {message}
          </p>
        )}

        <div className="admin-list">
          {projects
            .slice()
            .sort((a, b) => a.display_order - b.display_order)
            .map((project) => (
              <article key={project.id}>
                <div className="admin-thumb">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={`Imagem do projeto ${project.title}`}
                    />
                  ) : (
                    <span>{project.title.slice(0, 1)}</span>
                  )}
                </div>

                <div className="admin-info">
                  <div>
                    <span className="category">
                      {project.category}
                    </span>

                    <span
                      className={`status status-${project.status}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.short_description}</p>
                </div>

                <div className="admin-actions">
                  <button
                    type="button"
                    title={
                      project.published
                        ? "Ocultar projeto"
                        : "Publicar projeto"
                    }
                    onClick={() =>
                      toggleProject(project, "published")
                    }
                  >
                    {project.published ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>

                  <button
                    type="button"
                    title={
                      project.featured
                        ? "Remover dos destaques"
                        : "Destacar projeto"
                    }
                    className={
                      project.featured ? "selected" : ""
                    }
                    onClick={() =>
                      toggleProject(project, "featured")
                    }
                  >
                    <Star size={18} />
                  </button>

                  <button
                    type="button"
                    title="Editar projeto"
                    onClick={() => editProject(project)}
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    type="button"
                    title="Excluir projeto"
                    className="danger"
                    onClick={() => removeProject(project)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}

          {!projects.length && (
            <div className="empty-admin">
              Nenhum projeto cadastrado.
            </div>
          )}
        </div>
      </main>

      {open && (
        <div className="modal-backdrop">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <header>
              <div>
                <h2 id="project-modal-title">
                  {editingId
                    ? "Editar projeto"
                    : "Novo projeto"}
                </h2>

                <p>
                  Preencha as informações exibidas no portfólio.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar"
              >
                <X />
              </button>
            </header>

            <form onSubmit={saveProject}>
              <div className="form-grid">
                <label>
                  Nome do projeto

                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      updateForm("title", event.target.value)
                    }
                  />
                </label>

                <label>
                  Categoria

                  <input
                    required
                    value={form.category}
                    onChange={(event) =>
                      updateForm("category", event.target.value)
                    }
                    placeholder="Saúde, alimentação..."
                  />
                </label>

                <label className="full">
                  Slug

                  <input
                    required
                    value={form.slug}
                    onChange={(event) =>
                      updateForm(
                        "slug",
                        slugify(event.target.value)
                      )
                    }
                  />
                </label>

                <label className="full">
                  Descrição curta

                  <textarea
                    required
                    rows={3}
                    value={form.short_description}
                    onChange={(event) =>
                      updateForm(
                        "short_description",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="full">
                  Resultado entregue

                  <textarea
                    required
                    rows={3}
                    value={form.result_description}
                    onChange={(event) =>
                      updateForm(
                        "result_description",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Link do site

                  <input
                    type="url"
                    value={form.live_url || ""}
                    onChange={(event) =>
                      updateForm("live_url", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>

                <label>
                  Status

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value as ProjectStatus
                      )
                    }
                  >
                    <option value="online">Online</option>
                    <option value="desenvolvimento">
                      Em desenvolvimento
                    </option>
                    <option value="demonstracao">
                      Demonstração
                    </option>
                  </select>
                </label>

                <label>
                  Ordem

                  <input
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(event) =>
                      updateForm(
                        "display_order",
                        Number(event.target.value)
                      )
                    }
                  />
                </label>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) =>
                      updateForm(
                        "published",
                        event.target.checked
                      )
                    }
                  />

                  Publicado
                </label>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateForm(
                        "featured",
                        event.target.checked
                      )
                    }
                  />

                  Projeto em destaque
                </label>

                <label className="full upload-label">
                  <span>Imagem do projeto</span>

                  <div className="upload-box">
                    {form.image_url ? (
                      <img
                        src={form.image_url}
                        alt="Prévia da imagem do projeto"
                      />
                    ) : (
                      <>
                        <Upload />
                        <span>
                          {uploading
                            ? "Enviando imagem..."
                            : "Clique para enviar uma imagem"}
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          uploadImage(file);
                        }
                      }}
                    />
                  </div>
                </label>
              </div>

              {message && (
                <p className="form-error" role="alert">
                  {message}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="button ghost"
                  onClick={closeModal}
                  disabled={saving || uploading}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="button"
                  disabled={saving || uploading}
                >
                  {saving
                    ? "Salvando..."
                    : uploading
                      ? "Enviando imagem..."
                      : "Salvar projeto"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}