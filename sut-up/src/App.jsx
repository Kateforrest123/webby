import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis';
import ContactForm from "./Contactform.jsx";

gsap.registerPlugin(ScrollTrigger);
import BlenderViewer from "./Blenderviewer.jsx";
function App() {
  const [binaryText, setBinaryText] = useState("");
  const [projectMode, setProjectMode] = useState("technical");

  useEffect(() => {
    // ── LENIS SMOOTH SCROLL ──
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ── CURSOR TRAIL ──
const canvas = document.createElement("canvas");
canvas.style.cssText = "position:fixed;top:0;left:0;pointer-events:none;z-index:9999;";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
let mouseX = 0, mouseY = 0;

const onMouseMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
window.addEventListener("mousemove", onMouseMove);

const spawnParticle = () => {
  particles.push({
    x: mouseX, y: mouseY,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2 - 0.5,
    life: 1,
    size: Math.random() * 4 + 2,
    hue: Math.random() > 0.5 ? 210 : 280, // blue or purple
  });
};

let trailId;
const trailLoop = () => {
  trailId = requestAnimationFrame(trailLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spawnParticle();
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.life -= 0.035;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.life * 0.6})`;
    ctx.fill();
  }
};
trailLoop();

// Add to cleanup:
// cancelAnimationFrame(trailId);
// canvas.remove();
// window.removeEventListener("mousemove", onMouseMove);
// ── MAGNETIC BUTTONS ──
document.querySelectorAll(".nav-links a, .download-btn, .send-btn").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  });
});



    // ── BINARY GEN ──
    const bin = Array.from({ length: 4000 }, () => Math.round(Math.random())).join("");
    setBinaryText(bin);

    // ── HERO ANIMATION ──
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(".hero-left h1", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1.2 })
      .fromTo(".position-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.8")
      .fromTo(".bio-text", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.4");

    // ── SECTION REVEALS ──
    gsap.utils.toArray(".section-content").forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          }
        }
      );
    });

    // ── TIMELINE STAGGER ──
    gsap.fromTo(
      ".timeline-item",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 75%",
        }
      }
    );

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="app-container">
      <div className="binary-bg" aria-hidden="true">{binaryText}</div>

      <nav>
        <div className="nav-container">
          <div className="logo">KF</div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="https://drive.google.com/file/d/1NxKE6YHlGgvOdHigJB9qCwPndrStbFMu/view?usp=share_link" target="_blank" rel="noopener noreferrer">Resume</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="home" id="home">
  <div className="section-inner">
    
    <div className="hero-layout">

      {/* LEFT SIDE */}
      <div className="hero-left">
        <div className="social-links">
      <a href="https://github.com/kateforrest123" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  </a>
  <a href="https://www.linkedin.com/in/kate-forrest-0b8b53280/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  </a>
</div>

        <h2>Hi! my name is</h2>

        <h1>KATE FORREST</h1>

        <p className="bio-text">
          I'm a full-stack developer specializing in data analysis,
          3D modeling, as well as sports media!!
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="hero-right">
        <div className="name-model">
          <BlenderViewer urls = {["/rlogo.glb", "/python.glb","/react.glb","/csharp.glb","/cplusplus.glb","/blender.glb","/unity.glb", "/ae.glb", "/cc.glb", "/pr.glb", "/ps.glb"]} />
        </div>
      </div>

    </div>

  </div>
</section>

        {/* ABOUT */}
        <section className="section-padding" id="about">
          <div className="section-inner section-content">
            <h2 className="section-title">About Me</h2>
            <div className="about-grid">
              <div className="about-bio">
                <p> I love learning hard things, and I hate weekends. I am currently a third year student at Wilfrid Laurier University, who wants to try everything. I am currently working as a VR Software Engineer for my university, previously wrapping up a Digital Media Internship with the Brampton Steelheads Hockey Club.</p>
                <p>Outside of work, I love watching sports, hiking, and playing the guitar. </p>
              </div>
              <div className="skills-panel">
                <h3 className="label">Key Proficiencies</h3>
                <div className="skills-flex">
                  {["React", "Node.js", "Python", "Java", "SQL", "Unity", "C++", "C#", "XR Design", "Blender", "R ", "After Effects", "Premiere Pro", "Photoshop", "steam"].map(s => (
                    <span className="skill-chip" key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="section-padding" id="experience">
          <div className="section-inner section-content">
            <h2 className="section-title">Experience</h2>
            <div className="timeline">
              <div className="timeline-line"></div>
              
              <div className="timeline-item">
               
                <div className="project-card">
                  < div className = "timeline-model"> <BlenderViewer height="120px" models = {[ { url: "/hawks.glb", scale: 4, position: [0, 0, 0], floatOffset: Math.PI / 4, rotSpeed: 0.8, animation: "bop" } ]} /> </div>
                  <span className="timeline-date">Sept. 2025 - Present</span>
                  <h3>VR Software Engineer</h3>
                  <p className="muted">WLU Kinesiology Department — Unity Research Environment Design</p>
                </div>
              </div>

               <div className="timeline-item">
                  < div className = "timeline-model"> <BlenderViewer height="120px" models = {[ { url: "/lcs.glb", scale: 4, position: [0, 0, 0], floatOffset: Math.PI / 4, rotSpeed: 0.8, animation: "bop" } ]} /> </div>
                <div className="project-card">
                  <span className="timeline-date">Sept. 2025 - Present</span>
                  <h3>Software Engineer</h3>
                  <p className="muted">Laurier Computing Society - working with mostly react & vite</p>
                </div>
                </div>

              <div className="timeline-item">
               < div className = "timeline-model"> <BlenderViewer height="120px" models = {[ { url: "/steelheads.glb", scale: 4, position: [0, 0, 0], floatOffset: Math.PI / 4, rotSpeed: 0.8, animation: "bop" } ]} /> </div>
  
                <div className="project-card">
                  <span className="timeline-date">Jan. 2026 - Apr. 2026</span>
                  <h3>Digital Media Intern</h3>
                  <p className="muted">Brampton Steelheads — Content Production & Strategy</p>
                </div>
              </div>

              <div className="timeline-item">
                 < div className = "timeline-model"> <BlenderViewer height="120px" models = {[ { url: "/enactus.glb", scale: 4, position: [0, 0, 0], floatOffset: Math.PI / 4, rotSpeed: 0.8, animation: "bop" } ]} /> </div>
                <div className="project-card">
                  <span className="timeline-date">January. 2025 - Present</span>
                  <h3>Software Developer</h3>
                  <p className="muted">UNITYED - Startup for students by students</p>
                </div>
                </div>

                <div className="timeline-item">
               < div className = "timeline-model"> <BlenderViewer height="120px" models = {[ { url: "/hawks.glb", scale: 4, position: [0, 0, 0], floatOffset: Math.PI / 4, rotSpeed: 0.8, animation: "bop" } ]} /> </div>
                <div className="project-card">
                  <span className="timeline-date">September. 2025 - Present</span>
                  <h3>Football Video Assistant</h3>
                  <p className="muted">Laurier Golden Hawks Mens Varsity Football</p>
                </div>


              </div>
            </div>
          </div>
        </section>

       

        
{/* PROJECTS */}
<section className="section-padding" id="projects">
  <div className="section-inner section-content">
    <h2 className="section-title">Projects</h2>

    {/* MODE TOGGLE */}
    

    {/* TECHNICAL VIEW */}
    {projectMode === "technical" && (
      <div className="project-grid">
        
        <div className="project-card">
          <img src = "blue-background.png" className="project-thumb" />
          <h3>AuraTune</h3>
          <p className="muted">Interactive Unity-based environment for kinesiology experiments.</p>
        </div>
        <div className="project-card">
          <img src = "triage.webp" className="project-thumb" />
          <h3>TriageOS</h3>
          <p className="muted">Full-stack analytics dashboard built with React + Node.</p>
        </div>
        <div className="project-card">
           <img src = "blue-background.png" className="project-thumb" />
          <h3>StudyBuds</h3>
          <p className="muted">Collaborative study platform for students.</p>
        </div>
        <div className="project-card">
           <video
            className="project-thumb"
            autoPlay
            muted
            loop
            playsInline
              >
            <source src="/inprogresslogo.mp4" type="video/mp4" />
          </video>
          <h3>Brandyline</h3>
          <p className="muted">Indicated to provide insight into the line wait time at one of toronto's most popular retail store in Queen St West: Brandy Melville</p>
        </div>
        <div className="project-card">
           <video
            className="project-thumb"
            autoPlay
            muted
            loop
            playsInline
              >
            <source src="/inprogresslogo.mp4" type="video/mp4" />
          </video>
          <h3>Sportest</h3>
          <p className="muted">Sports analytics and testing dashboard.</p>
          </div>

        <div className="project-card">
           <video
            className="project-thumb"
            autoPlay
            muted
            loop
            playsInline
              >
            <source src="/inprogresslogo.mp4" type="video/mp4" />
          </video>
          <h3>Marketing analytics software</h3>
          <p className="muted">Takes data from tiktoks and predicts upcoming trends immediatley and like comes up with ideas for what to create next.</p>
          
        </div>
      </div>
    )}

    {/* CREATIVE VIEW */}
    {projectMode === "creative" && (
      <div className="creative-section">

        {/* TIKTOK SCROLLER */}
        <div className="creative-block">
          <p className="creative-label">✦ Short Form</p>
          <h3 className="creative-subtitle">TikToks</h3>
          <div className="tiktok-feed">
            {[
              { id: "1", caption: "behind the scenes at the Steelheads 🏒", views: "14.2K", likes: "892" },
              { id: "2", caption: "data viz breakdown — how I track stats", views: "8.7K", likes: "643" },
              { id: "3", caption: "3D modeling timelapse in Blender ✨", views: "22.1K", likes: "1.4K" },
              { id: "4", caption: "a day in the life: dev + sports media", views: "6.3K", likes: "412" },
            ].map((tok) => (
              <div className="tiktok-card" key={tok.id}>
                <div className="tiktok-thumb">
                  <div className="tiktok-play">▶</div>
                </div>
                <div className="tiktok-meta">
                  <p className="tiktok-caption">{tok.caption}</p>
                  <div className="tiktok-stats">
                    <span>👁 {tok.views}</span>
                    <span>♥ {tok.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ARTICLES */}
        <div className="creative-block">
          <p className="creative-label">✦ Writing</p>
          <h3 className="creative-subtitle">Articles</h3>
          <div className="article-list">
            {[
              { title: "How XR is Changing Sports Training", tag: "XR + Sports", date: "Mar 2026" },
              { title: "What Blender Taught Me About Data", tag: "Creative Tech", date: "Feb 2026" },
              { title: "Building a Media Strategy as a Dev", tag: "Media", date: "Jan 2026" },
            ].map((a, i) => (
              <div className="article-row" key={i}>
                <div className="article-tag">{a.tag}</div>
                <div className="article-title">{a.title}</div>
                <div className="article-date">{a.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* VIDEOS */}
        <div className="creative-block">
          <p className="creative-label">✦ Long Form</p>
          <h3 className="creative-subtitle">Videos</h3>
          <div className="video-grid">
            {[
              { title: "Steelheads Recap Reel", duration: "3:42", thumb: "🏒" },
              { title: "Blender 3D Process Video", duration: "7:15", thumb: "🎨" },
              { title: "Campus Tech Talk Vlog", duration: "5:08", thumb: "🎤" },
            ].map((v, i) => (
              <div className="video-card" key={i}>
                <div className="video-thumb">
                  <span className="video-emoji">{v.thumb}</span>
                  <div className="video-duration">{v.duration}</div>
                  <div className="video-play-btn">▶</div>
                </div>
                <p className="video-title">{v.title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    )}

  </div>
</section>

        

        
        {/* CONTACT */}
    <section className="section-padding centered" id="contact">
      <div className="section-inner section-content">
       <h2 className="section-title">Get in Touch!</h2>
       <p className="section-description">I would love to connect to discuss what I can bring to your team :)</p>
          <ContactForm />
          </div>
    </section>
      </main>
    </div>
  );
}

export default App;