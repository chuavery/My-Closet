import { useState, useRef, type ChangeEvent } from 'react';
import type { Article, ArticleType, Color } from '../models';
import { ARTICLE_TYPES, ARTICLE_TYPE_LABELS, COLORS, COLOR_HEX } from '../models';
import type { StorageSpace } from '../models';
import Header from './components/Header';

interface Props {
  article?: Article;
  spaces: StorageSpace[];
  onSave: (data: Omit<Article, 'id' | 'createdAt' | 'wearCount' | 'lastWornAt'>) => void;
  onDelete?: () => void;
  onBack: () => void;
}

export default function AddEditArticleScreen({ article, spaces, onSave, onDelete, onBack }: Props) {
  const [name, setName] = useState(article?.name ?? '');
  const [brand, setBrand] = useState(article?.brand ?? '');
  const [type, setType] = useState<ArticleType>(article?.type ?? 'shirt');
  const [color, setColor] = useState<Color>(article?.color ?? 'white');
  const [fabric, setFabric] = useState(article?.fabric ?? '');
  const [fit, setFit] = useState(article?.fit ?? '');
  const [size, setSize] = useState(article?.size ?? '');
  const [photoUrl, setPhotoUrl] = useState(article?.photoUrl ?? '');
  const [spaceId, setSpaceId] = useState(article?.storageSpaceId ?? '');
  const [showDelete, setShowDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoUrl(ev.target?.result as string ?? '');
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), brand, type, color, fabric, fit, size, photoUrl, storageSpaceId: spaceId });
  }

  const isEditing = !!article;

  return (
    <div className="flex flex-col h-full">
      <Header
        title={isEditing ? 'Edit Article' : 'Add Article'}
        onBack={onBack}
        serif
        right={
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 bg-primary text-primary-foreground rounded-sm disabled:opacity-40 active:opacity-80 transition-opacity"
          >
            Save
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Photo */}
        <div className="relative bg-muted flex items-center justify-center" style={{ height: 220 }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Article" className="w-full h-full object-cover" />
          ) : (
            <div className="pattern-grid absolute inset-0 opacity-40" />
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="relative z-10 flex flex-col items-center gap-1.5 text-muted-foreground"
          >
            {!photoUrl && (
              <>
                <div className="w-12 h-12 border border-dashed border-border bg-card/80 rounded-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider bg-card/80 px-2 py-0.5 rounded-sm">
                  Tap to add photo
                </span>
              </>
            )}
            {photoUrl && (
              <span className="font-mono text-[9px] uppercase tracking-wider bg-black/50 text-white px-2 py-0.5 rounded-sm">
                Change photo
              </span>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Name */}
          <Field label="Name *">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. White Oxford Shirt"
              className="input-base"
            />
          </Field>

          {/* Brand */}
          <Field label="Brand">
            <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. COS" className="input-base" />
          </Field>

          {/* Article type */}
          <Field label="Type *">
            <div className="flex flex-wrap gap-1.5">
              {ARTICLE_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm border transition-colors ${
                    type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'
                  }`}
                >
                  {ARTICLE_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </Field>

          {/* Color */}
          <Field label="Color *">
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={c}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    color === c ? 'border-primary scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: COLOR_HEX[c], boxShadow: c === 'white' ? 'inset 0 0 0 1px #D0C9B8' : 'none' }}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-muted-foreground capitalize mt-1 inline-block">{color}</span>
          </Field>

          {/* Fabric, Fit, Size row */}
          <div className="grid grid-cols-3 gap-3">
            <Field label="Fabric">
              <input type="text" value={fabric} onChange={e => setFabric(e.target.value)} placeholder="Cotton" className="input-base" />
            </Field>
            <Field label="Fit">
              <input type="text" value={fit} onChange={e => setFit(e.target.value)} placeholder="Slim" className="input-base" />
            </Field>
            <Field label="Size">
              <input type="text" value={size} onChange={e => setSize(e.target.value)} placeholder="M" className="input-base" />
            </Field>
          </div>

          {/* Storage space */}
          <Field label="Storage Space">
            <select
              value={spaceId}
              onChange={e => setSpaceId(e.target.value)}
              className="input-base appearance-none"
            >
              <option value="">— Unassigned —</option>
              {spaces.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.subLocation ? ` · ${s.subLocation}` : ''}
                </option>
              ))}
            </select>
          </Field>

          {/* Delete */}
          {isEditing && (
            <div className="pt-2">
              {showDelete ? (
                <div className="border border-dashed border-primary/40 rounded-sm p-3 flex items-center gap-3">
                  <p className="flex-1 font-sans text-xs text-muted-foreground">Delete this article?</p>
                  <button onClick={onDelete} className="font-mono text-[10px] uppercase tracking-wider text-primary">Yes, delete</button>
                  <button onClick={() => setShowDelete(false)} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setShowDelete(true)} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 underline underline-offset-2">
                  Delete article
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .input-base {
          width: 100%;
          background: #FBF7EE;
          border: 1px solid #D0C9B8;
          border-radius: 2px;
          padding: 7px 10px;
          font-family: 'Work Sans', sans-serif;
          font-size: 13px;
          color: #252320;
          transition: border-color 0.15s;
        }
        .input-base:focus {
          outline: none;
          border-color: #B85C38;
        }
        .input-base::placeholder {
          color: #7A7060;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">{label}</label>
      {children}
    </div>
  );
}
