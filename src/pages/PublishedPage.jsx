import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RenderSections } from "../components/PageSections";

export default function PublishedPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/public/pages/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Page not found");
        return res.json();
      })
      .then(data => {
        let sec = data.page.sections;
        if (typeof sec === 'string') {
            try { sec = JSON.parse(sec); } catch (e) { sec = []; }
        }
        setPage({...data.page, sections: sec});
        // Track view
        fetch(`/api/public/pages/${slug}/view`, { method: "POST" });
        
        // Update document title
        document.title = data.page.title + " | VibeKit Studio";
      })
      .catch(err => setError(err.message));
  }, [slug]);

  if (error) return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
       <div style={{textAlign: 'center'}}>
          <h2>404</h2>
          <p>{error}</p>
       </div>
    </div>
  );
  
  if (!page) return <div className="loading skeleton-loader" style={{padding: '4rem', textAlign: 'center'}}>Loading vibe...</div>;

  return (
    <div className={`published-layout theme-${page.themePreset}`}>
      {/* The themes are applied via CSS variables dynamically to the root of the page which handles coloring and fonts */}
      <RenderSections sections={page.sections} slug={slug} />
    </div>
  );
}
