"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";


export type Project = {
 slug: string;
 title: string;
 year: string;
 type: string;
 location: string;
 summary: string;
 tags: string[];
 hero: string;
};


const ease = [0.22, 1, 0.36, 1] as const;


function Row({ label, value }: { label: string; value: string }) {
 return (
   <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem", padding: ".45rem 0", borderBottom: "1px dotted rgba(237,237,241,.18)" }}>
     <span className="mono" style={{ fontSize: ".64rem", letterSpacing: ".12em", color: "rgba(237,237,241,.5)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
     <span style={{ flex: 1 }} />
     <span className="mono" style={{ fontSize: ".7rem", color: "var(--accent-lite)", textAlign: "right" }}>{value}</span>
   </div>
 );
}


export default function WorkGallery({ projects, pageSize = 4 }: { projects: Project[]; pageSize?: number }) {
 const reduce = useReducedMotion();
 const [page, setPage] = useState(0);
 const pages = Math.ceil(projects.length / pageSize);
 const items = useMemo(() => projects.slice(page * pageSize, page * pageSize + pageSize), [projects, page]);
 const go = (p: number) => setPage(Math.max(0, Math.min(pages - 1, p)));


 return (
   <div>
     <AnimatePresence mode="wait">
       <motion.div
         key={page}
         initial={reduce ? false : { opacity: 0, y: 22 }}
         animate={{ opacity: 1, y: 0 }}
         exit={reduce ? undefined : { opacity: 0, y: -16 }}
         transition={{ duration: 0.5, ease }}
         style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 330px), 1fr))", gap: "1.3rem" }}
       >
         {items.map((p, i) => {
           const num = String(page * pageSize + i + 1).padStart(2, "0");
           return (
             <motion.a
               key={p.slug}
               href={`/projects/${p.slug}`}
               initial={reduce ? false : { opacity: 0, y: 34 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: i * 0.08, ease }}
               whileHover={reduce ? undefined : { y: -8, borderColor: "rgba(111,159,216,0.6)", boxShadow: "0 26px 60px rgba(0,0,0,0.45)" }}
               style={{
                 display: "block", position: "relative", overflow: "hidden", color: "var(--paper)",
                 background: "#1e2124", border: "1px solid rgba(237,237,241,.12)",
                 clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
               }}
               className="workcard"
             >
               <span className="mono" style={{ position: "absolute", top: ".8rem", right: "1.1rem", zIndex: 3, fontSize: "1.1rem", color: "var(--accent-lite)" }}>{num}</span>
               <div style={{ overflow: "hidden", aspectRatio: "16/10" }}>
                 <motion.img
                   src={p.hero} alt={p.title} loading="lazy"
                   whileHover={reduce ? undefined : { scale: 1.07 }}
                   transition={{ duration: 0.9, ease }}
                   style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(.35) brightness(.82)" }}
                 />
               </div>
               <div style={{ padding: "1.1rem 1.2rem 1.3rem" }}>
                 <span className="mono" style={{ fontSize: ".62rem", letterSpacing: ".18em", color: "rgba(237,237,241,.5)", textTransform: "uppercase" }}>Project {num}</span>
                 <h3 className="display" style={{ fontSize: "1.7rem", fontWeight: 500, margin: ".35rem 0 .9rem", lineHeight: 1.02 }}>{p.title}</h3>
                 <div style={{ margin: "0 0 1rem" }}>
                   <Row label="Year" value={p.year} />
                   <Row label="Type" value={p.type} />
                   <Row label="Studio" value={p.location.replace(/^Studio\s+\w+\s·\s*/, "")} />
                 </div>
                 <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
                   {p.tags.map((t) => (
                     <span key={t} className="mono" style={{ fontSize: ".6rem", letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(237,237,241,.7)", border: "1px solid rgba(237,237,241,.2)", borderRadius: 99, padding: ".22rem .6rem" }}>{t}</span>
                   ))}
                 </div>
                 <span className="mono workcard__cta" style={{ display: "inline-block", marginTop: "1.2rem", fontSize: ".72rem", letterSpacing: ".1em", color: "var(--accent-lite)" }}>View project →</span>
               </div>
             </motion.a>
           );
         })}
       </motion.div>
     </AnimatePresence>


     {pages > 1 && (
       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.4rem", marginTop: "3rem" }}>
         <button onClick={() => go(page - 1)} disabled={page === 0} aria-label="Previous" style={arrow(page === 0)}>←</button>
         <div style={{ display: "flex", gap: ".6rem" }}>
           {Array.from({ length: pages }).map((_, i) => (
             <button key={i} onClick={() => go(i)} aria-label={`Page ${i + 1}`}
               style={{ width: i === page ? 26 : 9, height: 9, borderRadius: 99, border: "none", cursor: "pointer", padding: 0, background: i === page ? "var(--accent-lite)" : "rgba(237,237,241,.25)", transition: "width .4s ease, background .4s ease" }} />
           ))}
         </div>
         <button onClick={() => go(page + 1)} disabled={page === pages - 1} aria-label="Next" style={arrow(page === pages - 1)}>→</button>
         <span className="mono" style={{ fontSize: ".72rem", color: "rgba(237,237,241,.5)", marginLeft: ".5rem" }}>{page + 1} / {pages}</span>
       </div>
     )}
   </div>
 );
}


function arrow(disabled: boolean): React.CSSProperties {
 return {
   width: 46, height: 46, borderRadius: 99, cursor: disabled ? "default" : "pointer",
   border: "1px solid rgba(237,237,241,.25)", background: "transparent", color: "var(--paper)",
   opacity: disabled ? 0.3 : 1, fontSize: "1rem", transition: "opacity .3s ease",
 };
}



