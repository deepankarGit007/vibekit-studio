import { useState } from "react";

export function HeroSection({ data }) {
  const { title, subtitle, buttonText, buttonUrl } = data;
  return (
    <section className="section-hero">
      <h1>{title || "Default Hero Title"}</h1>
      <p>{subtitle || "This is a default subtitle for the hero section."}</p>
      {buttonText && (
        <a href={buttonUrl || "#"} className="btn-primary">{buttonText}</a>
      )}
    </section>
  );
}

export function FeaturesSection({ data }) {
  const { features = [] } = data;
  const items = features.length > 0 ? features : [
    { title: "Feature 1", description: "First feature description" },
    { title: "Feature 2", description: "Second feature description" },
    { title: "Feature 3", description: "Third feature description" },
  ];

  return (
    <section className="section-features">
      <div className="features-container">
        {items.map((feat, idx) => (
          <div key={idx} className="feature-item">
            <h3>{feat.title}</h3>
            <p>{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function GallerySection({ data }) {
  const { images = [] } = data;
  const items = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005191244-64b584091a13?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005183351-4171d7d0edba?q=80&w=400&auto=format&fit=crop"
  ];

  return (
    <section className="section-gallery">
      <div className="gallery-grid">
        {items.map((img, idx) => (
          <img key={idx} src={img} alt={`Gallery item ${idx+1}`} className="gallery-item" loading="lazy" />
        ))}
      </div>
    </section>
  );
}

export function ContactSection({ data, slug }) {
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const { heading = "Get in Touch" } = data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug) {
      alert("Form works in live preview mode, but data won't be saved until published.");
      return;
    }
    
    setStatus("submitting");
    try {
      const res = await fetch(`/api/public/pages/${slug}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="section-contact">
      <h2>{heading}</h2>
      {status === 'success' ? (
        <p style={{ marginTop: "1rem", color: "green" }}>Thank you! Message sent.</p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <textarea 
            placeholder="Message" 
            rows="5"
            value={formData.message} 
            onChange={e => setFormData({...formData, message: e.target.value})} 
            required 
          ></textarea>
          <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'error' && <p style={{ color: "red", marginTop: "1rem" }}>An error occurred.</p>}
        </form>
      )}
    </section>
  );
}

export function RenderSections({ sections, slug }) {
  if (!sections || sections.length === 0) {
    return <div style={{ padding: "4rem", textAlign: "center", opacity: 0.5 }}>No sections added yet.</div>;
  }

  return (
    <>
      {sections.map((section, idx) => {
        switch (section.type) {
          case 'hero': return <HeroSection key={section.id || idx} data={section.data} />;
          case 'features': return <FeaturesSection key={section.id || idx} data={section.data} />;
          case 'gallery': return <GallerySection key={section.id || idx} data={section.data} />;
          case 'contact': return <ContactSection key={section.id || idx} data={section.data} slug={slug} />;
          default: return null;
        }
      })}
    </>
  );
}
