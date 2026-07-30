"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


// Adapted from 21st.dev "Preloader" (info-mdshakeeb) — curved slide-up reveal,
// re-skinned to the Blueprint palette + architectural words. framer-motion.
const DEFAULT_WORDS = ["Sketch", "Model", "Draft", "Nisshkaa Bhansaly"];


const slideUp = {
 initial: { top: 0 },
 exit: { top: "-100vh", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 } },
};
const fade = {
 initial: { opacity: 0, y: 8 },
 enter: { opacity: 0.9, y: 0, transition: { duration: 0.6, delay: 0.1 } },
};


export default function Preloader({ words = DEFAULT_WORDS }: { words?: string[] }) {
 const [show, setShow] = useState(true);
 const [index, setIndex] = useState(0);
 const [dim, setDim] = useState({ w: 0, h: 0 });
 const [exiting, setExiting] = useState(false);


 useEffect(() => {
   if (typeof window === "undefined") return;
   const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   if (sessionStorage.getItem("av_preloaded") || reduce) {
     setShow(false);
     window.dispatchEvent(new Event("preloader:done"));
     return;
   }
   setDim({ w: window.innerWidth, h: window.innerHeight });
   document.body.style.overflow = "hidden";
 }, []);


 useEffect(() => {
   if (!show || dim.w === 0) return;
   if (index === words.length - 1) {
     const t = setTimeout(() => {
       setExiting(true);
       const t2 = setTimeout(() => {
         setShow(false);
         sessionStorage.setItem("av_preloaded", "1");
         document.body.style.overflow = "";
         window.dispatchEvent(new Event("preloader:done"));
       }, 1150);
       return () => clearTimeout(t2);
     }, 650);
     return () => clearTimeout(t);
   }
   const t = setTimeout(() => setIndex((i) => i + 1), index === 0 ? 650 : 260);
   return () => clearTimeout(t);
 }, [index, show, dim.w]);


 if (!show) return null;
 const { w, h } = dim;
 const initialPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 280} 0 ${h} L0 0`;
 const targetPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`;
 const curve = {
   initial: { d: initialPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
   exit: { d: targetPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 } },
 };


 return (
   <motion.div
     variants={slideUp}
     initial="initial"
     animate={exiting ? "exit" : "initial"}
     style={{
       position: "fixed", inset: 0, width: "100vw", height: "100vh",
       display: "flex", alignItems: "center", justifyContent: "center",
       background: "#16181a", zIndex: 100000,
     }}
   >
     {w > 0 && (
       <>
         <motion.p
           key={index}
           variants={fade}
           initial="initial"
           animate="enter"
           style={{
             position: "absolute", zIndex: 10, display: "flex", alignItems: "center",
             color: "#f5f5f1", fontFamily: "'General Sans', sans-serif",
             fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 500, letterSpacing: "-0.02em",
           }}
         >
           <span style={{ display: "block", width: 11, height: 11, background: "#6f9fd8", borderRadius: "50%", marginRight: 14 }} />
           {words[index]}
         </motion.p>
         <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "calc(100% + 280px)" }}>
           <motion.path variants={curve} initial="initial" animate={exiting ? "exit" : "initial"} fill="#16181a" />
         </svg>
       </>
     )}
   </motion.div>
 );
}