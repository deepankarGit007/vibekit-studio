import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Eye, Palette, Layout, Settings, Monitor, Tablet, Smartphone, ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { RenderSections } from "../components/PageSections";

const THEMES = ['minimal', 'neobrutal', 'dark', 'pastel', 'luxury', 'retro'];

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewport, setViewport] = useState("desktop"); // desktop, tablet, mobile
  const [activeTab, setActiveTab] = useState("sections");

  useEffect(() => {
    fetch(`/api/pages/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not Found");
        return res.json();
      })
      .then(data => {
         // Parse sections from JSON string if needed
         let sec = data.page.sections;
         if (typeof sec === 'string') {
             try { sec = JSON.parse(sec); } catch (e) { sec = []; }
         }
         if (!Array.isArray(sec)) sec = [];
         
         const p = { ...data.page, sections: sec };
         
         // Setup some defaults if new page
         if (p.sections.length === 0) {
             p.sections = [
                 { id: Date.now()+1, type: 'hero', data: { title: 'Welcome to '+p.title, subtitle: 'Built with VibeKit', buttonText: 'Click Me' } },
                 { id: Date.now()+2, type: 'features', data: { features: [] } },
                 { id: Date.now()+3, type: 'gallery', data: { images: [] } },
                 { id: Date.now()+4, type: 'contact', data: { heading: 'Contact Us' } }
             ];
         }
         
         setPage(p);
      })
      .catch(() => navigate("/app"));
  }, [id, navigate]);

  const savePage = useCallback(async (updatedPage) => {
    setSaving(true);
    try {
      await fetch(`/api/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedPage.title,
          slug: updatedPage.slug,
          themePreset: updatedPage.themePreset,
          sections: JSON.stringify(updatedPage.sections)
        })
      });
      setPage(updatedPage);
    } catch(err) {
      console.error(err);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  }, [id]);

  const togglePublish = async () => {
    const isPub = page.status === 'published';
    const endpoint = isPub ? 'unpublish' : 'publish';
    setSaving(true);
    const res = await fetch(`/api/pages/${id}/${endpoint}`, { method: "POST" });
    if (res.ok) {
       setPage({...page, status: isPub ? 'draft' : 'published'});
    }
    setSaving(false);
  };

  const updateTheme = (theme) => {
    const p = { ...page, themePreset: theme };
    setPage(p);
    savePage(p);
  };

  const moveSection = (idx, dir) => {
    const newSections = [...page.sections];
    if (dir === 'up' && idx > 0) {
        [newSections[idx-1], newSections[idx]] = [newSections[idx], newSections[idx-1]];
    } else if (dir === 'down' && idx < newSections.length - 1) {
        [newSections[idx+1], newSections[idx]] = [newSections[idx], newSections[idx+1]];
    }
    const p = { ...page, sections: newSections };
    setPage(p);
    savePage(p);
  };

  if (!page) return <div className="loading skeleton-loader">Loading editor...</div>;

  return (
    <div className="editor-layout">
      <aside className="editor-sidebar">
        <div className="sidebar-header">
          <button onClick={() => navigate("/app")} className="btn-text">← Dashboard</button>
          <div style={{marginTop: '1rem'}}>
             <h2 style={{fontSize: '1.25rem', marginBottom: '0.25rem'}}>{page.title}</h2>
             <span className={`status-badge status-${page.status}`}>{page.status}</span>
          </div>
        </div>
        
        <div className="sidebar-tabs">
          <button className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')}><Layout size={16} /> Sections</button>
          <button className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`} onClick={() => setActiveTab('theme')}><Palette size={16} /> Theme</button>
        </div>

        <div className="sidebar-content">
          {activeTab === 'sections' && (
            <div className="sections-manager">
              <p style={{marginBottom: "1rem", color: "#9ca3af", fontSize: "0.875rem"}}>Reorder sections on your page.</p>
              {page.sections.map((sec, idx) => (
                <div key={sec.id} className="section-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '8px' }}>
                  <span style={{textTransform: 'capitalize'}}>{sec.type}</span>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button className="icon-btn" onClick={() => moveSection(idx, 'up')} disabled={idx === 0}><ChevronUp size={16}/></button>
                    <button className="icon-btn" onClick={() => moveSection(idx, 'down')} disabled={idx === page.sections.length - 1}><ChevronDown size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="theme-manager">
               <p style={{marginBottom: "1rem", color: "#9ca3af", fontSize: "0.875rem"}}>Select a Vibe to apply global styles.</p>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                 {THEMES.map(theme => (
                   <button 
                     key={theme} 
                     onClick={() => updateTheme(theme)}
                     style={{
                        padding: '1rem 0.5rem', 
                        borderRadius: '8px',
                        border: theme === page.themePreset ? '2px solid #3b82f6' : '1px solid #374151',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                     }}
                   >
                     {theme}
                   </button>
                 ))}
               </div>
            </div>
          )}
        </div>
      </aside>

      <main className="editor-main">
        <header className="editor-topbar">
          <div className="viewport-toggles">
            <button className={`icon-btn ${viewport === 'desktop' ? 'active' : ''}`} onClick={() => setViewport('desktop')}><Monitor size={18}/></button>
            <button className={`icon-btn ${viewport === 'tablet' ? 'active' : ''}`} onClick={() => setViewport('tablet')}><Tablet size={18}/></button>
            <button className={`icon-btn ${viewport === 'mobile' ? 'active' : ''}`} onClick={() => setViewport('mobile')}><Smartphone size={18}/></button>
          </div>
          <div className="editor-actions">
            <span className="save-status">{saving ? "Saving..." : "Saved"}</span>
            <button onClick={togglePublish} className="btn-primary">
               {page.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
            {page.status === 'published' && (
              <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap:'0.5rem'}}><Eye size={16}/> View</a>
            )}
          </div>
        </header>

        <div className="editor-preview-container">
          <div className={`preview-wrapper viewport-${viewport}`}>
            {/* The preview container applies the theme class to mirror exactly the PublishedPage structure */}
            <div className={`preview-content theme-${page.themePreset}`}>
               <RenderSections sections={page.sections} slug={null} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
