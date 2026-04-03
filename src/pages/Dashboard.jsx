import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Copy, LogOut } from "lucide-react";

export default function Dashboard() {
  const [pages, setPages] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(() => navigate("/login"));

    fetch("/api/pages")
      .then(res => res.json())
      .then(data => setPages(data.pages || []));
  }, [navigate]);

  const handleCreate = async () => {
    const title = prompt("Enter page title:");
    if (!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug })
    });
    const data = await res.json();
    if (res.ok) {
      navigate(`/app/editor/${data.page.id}`);
    } else {
      alert(data.error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate("/");
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="logo">VibeKit Studio</div>
        <div className="user-controls">
          <span className="user-email">{user.email}</span>
          <button onClick={handleLogout} className="btn-icon"><LogOut size={18} /></button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-title-row">
          <h1>Your Pages</h1>
          <button onClick={handleCreate} className="btn-primary"><Plus size={18} /> New Page</button>
        </div>

        <div className="pages-grid">
          {pages.length === 0 ? (
            <div className="empty-state">No pages right now. Create your first page!</div>
          ) : pages.map(p => (
            <div key={p.id} className="page-card">
              <div className="page-card-header">
                <h3>{p.title}</h3>
                <span className={`status-badge status-${p.status}`}>{p.status}</span>
              </div>
              <p className="page-meta">/{p.slug} • {p.views} views</p>
              <div className="page-card-actions">
                <Link to={`/app/editor/${p.id}`} className="btn-secondary">Edit</Link>
                {p.status === 'published' && (
                  <a href={`/p/${p.slug}`} target="_blank" rel="noreferrer" className="btn-outline">View</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
