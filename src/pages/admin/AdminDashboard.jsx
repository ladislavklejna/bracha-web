import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { adminApi } from '../../utils/adminApi';
import './AdminDashboard.css';

const PREDEFINED_ACTIONS = ['studie', 'dokumentace'];

/** Returns top-N most frequent values extracted from projects. */
function topValues(projects, extractor, n = 4) {
  const count = {};
  for (const p of projects) {
    for (const v of extractor(p)) {
      if (v?.trim()) count[v] = (count[v] || 0) + 1;
    }
  }
  return Object.entries(count)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([v]) => v);
}

/** Clickable suggestion chips that disappear once selected. */
function QuickChips({ options, selected, onAdd }) {
  const available = options.filter((o) => !selected.includes(o));
  if (!available.length) return null;
  return (
    <div className="qc-row">
      {available.map((o) => (
        <button key={o} type="button" className="qc-chip" onClick={() => onAdd(o)}>
          + {o}
        </button>
      ))}
    </div>
  );
}

const PUBLIC_BASE = process.env.REACT_APP_PUBLIC_BASE || 'https://www.arapro.cz';

/* ─── Sortable project card ─────────────────────────────────── */
function ProjectCard({ project, position, cacheBust, onEdit, onDelete, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.folderName });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const thumb = project.thumbnail
    ? `${PUBLIC_BASE}/${project.thumbnail}?t=${cacheBust}`
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="pc-card"
    >
      <div className="pc-position">{position}</div>
      <div className="pc-drag-handle" {...attributes} {...listeners} title="Přetáhnout">
        ⠿
      </div>
      <div className="pc-thumb">
        {thumb ? (
          <img src={thumb} alt={project.name} loading="lazy" />
        ) : (
          <div className="pc-thumb-placeholder">
            <span>Bez náhledu</span>
          </div>
        )}
      </div>
      <div className="pc-body">
        <h3 className="pc-name">{project.name || '(bez názvu)'}</h3>
        <p className="pc-location">{project.location}</p>
        <div className="pc-actions-row">
          {project.actions?.map((a) => (
            <span key={a} className="pc-tag">{a}</span>
          ))}
        </div>
        <p className="pc-photo-count">
          {project.photos?.length ?? 0} foto
        </p>
      </div>
      <div className="pc-footer">
        <button className="pc-btn pc-btn-edit" onClick={() => onEdit(project)}>
          Upravit
        </button>
        <button className="pc-btn pc-btn-delete" onClick={() => onDelete(project)}>
          Smazat
        </button>
      </div>
    </div>
  );
}

/* ─── New project modal ─────────────────────────────────────── */
function NewProjectModal({ onClose, onCreate, projects }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [actionInput, setActionInput] = useState('');
  const [actions, setActions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Suggestions: predefined first, then top unique others from existing projects
  const nameSuggestions = topValues(projects, (p) => (p.name ? [p.name] : []), 4);
  const actionSuggestions = [
    ...PREDEFINED_ACTIONS,
    ...topValues(projects, (p) => p.actions || [], 4).filter(
      (a) => !PREDEFINED_ACTIONS.includes(a)
    ),
  ];
  const locationSuggestions = topValues(projects, (p) => (p.location ? [p.location] : []), 4);

  const addAction = (val) => {
    const v = (val ?? actionInput).trim();
    if (v && !actions.includes(v)) setActions((prev) => [...prev, v]);
    if (!val) setActionInput('');
  };

  const handleActionKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addAction(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Název je povinný'); return; }
    setSaving(true);
    try {
      const result = await adminApi.createProject({ name: name.trim(), location: location.trim(), actions });
      onCreate(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>Nový projekt</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="ad-field">
            <label>Název *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vila Novák" autoFocus />
            <QuickChips
              options={nameSuggestions}
              selected={name ? [name] : []}
              onAdd={(v) => setName(v)}
            />
          </div>
          <div className="ad-field">
            <label>Lokalita</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Praha" />
            <QuickChips
              options={locationSuggestions}
              selected={location ? [location] : []}
              onAdd={(v) => setLocation(v)}
            />
          </div>
          <div className="ad-field">
            <label>Typy prací</label>
            <div className="tag-input-wrap">
              {actions.map((a) => (
                <span key={a} className="tag-chip">
                  {a}
                  <button type="button" onClick={() => setActions(actions.filter((x) => x !== a))}>✕</button>
                </span>
              ))}
              <input
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                onKeyDown={handleActionKey}
                onBlur={() => addAction(null)}
                placeholder="projektování, Enter..."
              />
            </div>
            <QuickChips
              options={actionSuggestions}
              selected={actions}
              onAdd={(v) => addAction(v)}
            />
          </div>
          {error && <p className="ad-error">{error}</p>}
          <div className="modal-footer">
            <button type="button" className="ad-btn-secondary" onClick={onClose}>Zrušit</button>
            <button type="submit" className="ad-btn-primary" disabled={saving}>
              {saving ? <span className="btn-spin" /> : 'Vytvořit projekt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete confirm modal ──────────────────────────────────── */
function DeleteModal({ project, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-box--sm">
        <div className="modal-header">
          <h2>Smazat projekt</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-text">
          Opravdu chcete smazat <strong>{project.name}</strong>?<br />
          Tato akce je nevratná — smažou se i všechny fotky.
        </p>
        <div className="modal-footer">
          <button className="ad-btn-secondary" onClick={onClose}>Zrušit</button>
          <button className="ad-btn-danger" onClick={handle} disabled={loading}>
            {loading ? <span className="btn-spin" /> : 'Smazat'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [cacheBust, setCacheBust] = useState(Date.now());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await adminApi.getProjects();
      setProjects(data);
      setCacheBust(Date.now());
    } catch (err) {
      setError('Nepodařilo se načíst projekty: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  async function handleDragEnd(event) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = projects.findIndex((p) => p.folderName === active.id);
    const newIdx = projects.findIndex((p) => p.folderName === over.id);
    const reordered = arrayMove(projects, oldIdx, newIdx);
    setProjects(reordered);
    try {
      await adminApi.reorderProjects(reordered.map((p) => p.folderName));
    } catch (err) {
      console.error('Reorder projects failed:', err);
    }
  }

  async function handleDelete() {
    await adminApi.deleteProject(deleteTarget.folderName);
    setDeleteTarget(null);
    await loadProjects();
  }

  function handleCreated(result) {
    setShowNew(false);
    navigate(`/admin/project/${encodeURIComponent(result.folderName)}`);
  }

  const activeProject = projects.find((p) => p.folderName === activeId);

  return (
    <div className="ad-root">
      <div className="ad-header">
        <div>
          <h1 className="ad-title">Projekty</h1>
          <p className="ad-subtitle">{projects.length} projektů · přetáhněte pro změnu pořadí</p>
        </div>
        <button className="ad-btn-primary" onClick={() => setShowNew(true)}>
          + Nový projekt
        </button>
      </div>

      {error && <p className="ad-error">{error}</p>}

      {loading ? (
        <div className="ad-loading">
          <span className="btn-spin btn-spin--lg" />
          <span>Načítám projekty…</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="ad-empty">
          <p>Žádné projekty. Vytvořte první.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.folderName)}
            strategy={rectSortingStrategy}
          >
            <div className="ad-grid">
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.folderName}
                  project={p}
                  position={i + 1}
                  cacheBust={cacheBust}
                  isDragging={p.folderName === activeId}
                  onEdit={(proj) => navigate(`/admin/project/${encodeURIComponent(proj.folderName)}`)}
                  onDelete={(proj) => setDeleteTarget(proj)}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeProject && (
              <div className="pc-card pc-card--overlay">
                <div className="pc-thumb">
                  {activeProject.thumbnail ? (
                    <img src={`${PUBLIC_BASE}/${activeProject.thumbnail}`} alt="" />
                  ) : (
                    <div className="pc-thumb-placeholder"><span>Bez náhledu</span></div>
                  )}
                </div>
                <div className="pc-body">
                  <h3 className="pc-name">{activeProject.name}</h3>
                  <p className="pc-location">{activeProject.location}</p>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {showNew && (
        <NewProjectModal
          onClose={() => setShowNew(false)}
          onCreate={handleCreated}
          projects={projects}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          project={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
