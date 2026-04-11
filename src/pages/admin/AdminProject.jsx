import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { adminApi } from '../../utils/adminApi';
import { generateResponsiveWebP, isResponsiveVariant } from '../../utils/imageUtils';
import './AdminProject.css';

const PREDEFINED_ACTIONS = ['studie', 'dokumentace'];

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

/* ─── Sortable photo tile ───────────────────────────────────── */
function PhotoTile({ photo, isFirst, onDelete, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: photo.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`pt-tile ${isFirst ? 'pt-tile--thumb' : ''}`}>
      <div className="pt-drag" {...attributes} {...listeners} title="Přetáhnout">⠿</div>
      {isFirst && <span className="pt-badge">Náhled</span>}
      <div className="pt-img-wrap">
        <img src={`${PUBLIC_BASE}/${photo.path}`} alt={photo.name} loading="lazy" />
      </div>
      <div className="pt-name">{photo.name}</div>
      <div className="pt-actions">
        <button className="pt-btn pt-btn-del" onClick={() => onDelete(photo)} title="Smazat">
          Smazat
        </button>
      </div>
    </div>
  );
}

/* ─── Upload zone ───────────────────────────────────────────── */
function UploadZone({ onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length) onFiles(files);
  };

  return (
    <div
      className={`uz-zone ${dragging ? 'uz-zone--active' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => onFiles(Array.from(e.target.files))}
      />
      <div className="uz-icon">↑</div>
      <p className="uz-label">Klikněte nebo přetáhněte fotky</p>
      <p className="uz-sub">JPG, PNG, WebP — automaticky převede na WebP ve více rozlišeních</p>
    </div>
  );
}

/* ─── Upload progress ───────────────────────────────────────── */
function UploadProgress({ current, total, filename }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="up-wrap">
      <div className="up-top">
        <span className="up-label">Nahrávám {current}/{total}: {filename}</span>
        <span className="up-pct">{pct}%</span>
      </div>
      <div className="up-bar">
        <div className="up-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function AdminProject() {
  const { folderName: encodedFolder } = useParams();
  const folderName = decodeURIComponent(encodedFolder);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', location: '', actions: [] });
  const [actionInput, setActionInput] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadErrors, setUploadErrors] = useState([]);

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const loadProject = useCallback(async () => {
    try {
      const all = await adminApi.getProjects();
      setAllProjects(all);
      const p = all.find((x) => x.folderName === folderName);
      if (!p) { navigate('/admin/dashboard'); return; }
      setProject(p);
      setFormData({ name: p.name, location: p.location, actions: p.actions ?? [] });
      setPhotos(p.photos ?? []);
      setIsDirty(false);
    } finally {
      setLoading(false);
    }
  }, [folderName, navigate]);

  useEffect(() => { loadProject(); }, [loadProject]);

  /* ── Form helpers ──────────────────────────────────────────── */
  const set = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setIsDirty(true);
  };

  const addAction = () => {
    const v = actionInput.trim();
    if (v && !formData.actions.includes(v)) {
      setFormData((prev) => ({ ...prev, actions: [...prev.actions, v] }));
      setIsDirty(true);
    }
    setActionInput('');
  };

  const removeAction = (a) => {
    setFormData((prev) => ({ ...prev, actions: prev.actions.filter((x) => x !== a) }));
    setIsDirty(true);
  };

  const handleActionKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addAction(); }
  };

  /* ── Save metadata ─────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const result = await adminApi.updateProject(folderName, formData);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2500);
      setIsDirty(false);
      if (result.folderName !== folderName) {
        navigate(`/admin/project/${encodeURIComponent(result.folderName)}`, { replace: true });
      }
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Photo upload ──────────────────────────────────────────── */
  const handleFiles = async (files) => {
    setUploading(true);
    setUploadTotal(files.length);
    setUploadErrors([]);
    const failed = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadCurrent(i + 1);
      setUploadFilename(file.name);
      try {
        // Generate full-size + responsive variants (400w, 800w, 1200w) client-side
        const variants = await generateResponsiveWebP(file);
        for (const variant of variants) {
          await adminApi.uploadPhoto(folderName, variant, false);
        }
      } catch (err) {
        console.error('Upload error:', err);
        failed.push(file.name);
      }
    }

    if (failed.length > 0) setUploadErrors(failed);
    setUploading(false);
    await loadProject();
  };

  /* ── Delete photo ──────────────────────────────────────────── */
  const handleDeletePhoto = async (photo) => {
    if (!window.confirm(`Smazat ${photo.name}?`)) return;
    await adminApi.deletePhoto(folderName, photo.name);
    // Also delete responsive variants (e.g. photo_400w.webp, photo_800w.webp, …)
    const stem = photo.name.replace(/\.webp$/, '');
    const variants = photos.filter(
      (p) => p.name.startsWith(`${stem}_`) && p.name.endsWith('w.webp')
    );
    await Promise.allSettled(
      variants.map((v) => adminApi.deletePhoto(folderName, v.name))
    );
    await loadProject();
  };

  /* ── Drag & drop photos ────────────────────────────────────── */
  const handleDragEnd = async (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Operate only on gallery photos (no variants, no thumb.*)
    const gallery = photos.filter(
      (p) => !isResponsiveVariant(p.name) && !p.name.startsWith('thumb.')
    );
    const oldIdx = gallery.findIndex((p) => p.name === active.id);
    const newIdx = gallery.findIndex((p) => p.name === over.id);
    const reordered = arrayMove(gallery, oldIdx, newIdx);

    // Optimistic update – keep variants and thumb.* out of the ordered list
    setPhotos((prev) => {
      const rest = prev.filter(
        (p) => isResponsiveVariant(p.name) || p.name.startsWith('thumb.')
      );
      return [...reordered, ...rest];
    });

    try {
      await adminApi.reorderPhotos(folderName, reordered.map((p) => p.name));
    } catch (err) {
      console.error('Reorder error:', err);
      await loadProject(); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="ap-loading">
        <span className="btn-spin btn-spin--lg" />
      </div>
    );
  }

  return (
    <div className="ap-root">
      <Link to="/admin/dashboard" className="ap-back">← Zpět na projekty</Link>

      <div className="ap-header">
        <h1 className="ap-title">{project?.name || '(bez názvu)'}</h1>
        <p className="ap-folder-name">{folderName}</p>
      </div>

      {/* ── Metadata form ───────────────────────────────────── */}
      <section className="ap-section">
        <h2 className="ap-section-title">Informace o projektu</h2>

        {/* Compute suggestions from all projects */}
        {(() => {
          const nameSuggestions = topValues(allProjects, (p) => (p.name ? [p.name] : []), 4);
          const actionSuggestions = [
            ...PREDEFINED_ACTIONS,
            ...topValues(allProjects, (p) => p.actions || [], 4).filter(
              (a) => !PREDEFINED_ACTIONS.includes(a)
            ),
          ];
          const locationSuggestions = topValues(
            allProjects,
            (p) => (p.location ? [p.location] : []),
            4
          );

          return (
            <>
              <div className="ap-form-grid">
                <div className="ad-field">
                  <label>Název</label>
                  <input value={formData.name} onChange={set('name')} placeholder="Vila Novák" />
                  <QuickChips
                    options={nameSuggestions}
                    selected={formData.name ? [formData.name] : []}
                    onAdd={(v) => { setFormData((prev) => ({ ...prev, name: v })); setIsDirty(true); }}
                  />
                </div>
                <div className="ad-field">
                  <label>Lokalita</label>
                  <input value={formData.location} onChange={set('location')} placeholder="Praha" />
                  <QuickChips
                    options={locationSuggestions}
                    selected={formData.location ? [formData.location] : []}
                    onAdd={(v) => { setFormData((prev) => ({ ...prev, location: v })); setIsDirty(true); }}
                  />
                </div>
              </div>
              <div className="ad-field">
                <label>Typy prací</label>
                <div className="tag-input-wrap">
                  {formData.actions.map((a) => (
                    <span key={a} className="tag-chip">
                      {a}
                      <button type="button" onClick={() => removeAction(a)}>✕</button>
                    </span>
                  ))}
                  <input
                    value={actionInput}
                    onChange={(e) => setActionInput(e.target.value)}
                    onKeyDown={handleActionKey}
                    onBlur={addAction}
                    placeholder="projektování, Enter…"
                  />
                </div>
                <QuickChips
                  options={actionSuggestions}
                  selected={formData.actions}
                  onAdd={(v) => { setFormData((prev) => ({ ...prev, actions: [...prev.actions, v] })); setIsDirty(true); }}
                />
              </div>
            </>
          );
        })()}

        {saveError && <p className="ap-error">{saveError}</p>}

        <div className="ap-save-row">
          {saveOk && <span className="ap-save-ok">✓ Uloženo</span>}
          <button
            className="ad-btn-primary"
            onClick={handleSave}
            disabled={!isDirty || saving}
          >
            {saving ? <span className="btn-spin" /> : 'Uložit změny'}
          </button>
        </div>
      </section>

      {/* ── Photos ──────────────────────────────────────────── */}
      <section className="ap-section">
        <h2 className="ap-section-title">
          Fotogalerie
          <span className="ap-photo-count">
            {photos.filter(p => !isResponsiveVariant(p.name) && !p.name.startsWith('thumb.')).length} fotek · přetáhněte první fotku pro změnu náhledu
          </span>
        </h2>

        <UploadZone onFiles={handleFiles} />

        {uploading && (
          <UploadProgress
            current={uploadCurrent}
            total={uploadTotal}
            filename={uploadFilename}
          />
        )}

        {uploadErrors.length > 0 && (
          <p className="ap-error">
            Nepodařilo se nahrát: {uploadErrors.join(', ')}
          </p>
        )}

        {photos.length === 0 && !uploading ? (
          <p className="ap-no-photos">Žádné fotky. Nahrajte první výše.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(e) => setActiveId(e.active.id)}
            onDragEnd={handleDragEnd}
          >
            {/* Only show gallery photos; variants and thumb.* are hidden */}
            {(() => {
              const basePhotos = photos.filter(
                (p) => !isResponsiveVariant(p.name) && !p.name.startsWith('thumb.')
              );
              return (
                <SortableContext
                  items={basePhotos.map((p) => p.name)}
                  strategy={rectSortingStrategy}
                >
                  <div className="ap-photo-grid">
                    {basePhotos.map((photo, i) => (
                      <PhotoTile
                        key={photo.name}
                        photo={photo}
                        isFirst={i === 0}
                        isDragging={photo.name === activeId}
                        onDelete={handleDeletePhoto}
                      />
                    ))}
                  </div>
                </SortableContext>
              );
            })()}
          </DndContext>
        )}
      </section>
    </div>
  );
}
