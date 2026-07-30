// Dynamically discovers every project folder in src/projects/<slug>/.
// Drop in a new folder with a project.json (+ model/images/drawings) and it
// becomes a new project automatically on the next build. All asset paths in
// project.json are RELATIVE to the folder; they're resolved to built URLs here.


type Drawing = { file: string; caption?: string; wide?: boolean };
type Step = { stage: string; note: string; media?: string };
type RawProject = {
 title: string; year: string; type: string; role: string; location: string;
 order?: number; summary: string; brief: string; note?: string;
 tools?: string[]; tags?: string[]; cameraOrbit?: string;
 model: string; modelLow?: string; hero: string; render?: string; modelPhoto?: string;
 drawings?: Drawing[]; process?: Step[];
};


export type Project = {
 slug: string; title: string; year: string; type: string; role: string; location: string;
 order: number; summary: string; brief: string; note: string;
 tools: string[]; tags: string[]; cameraOrbit?: string;
 model: string; modelLow?: string; hero: string; render: string; modelPhoto: string;
 drawings: { src: string; caption: string; wide: boolean }[];
 process: { stage: string; note: string; media: string }[];
};


const jsons = import.meta.glob<{ default: RawProject }>('../projects/*/project.json', { eager: true });
const assets = import.meta.glob<string>('../projects/*/*.{glb,jpg,jpeg,png,svg,webp}', {
 eager: true, query: '?url', import: 'default',
});


const slugOf = (key: string) => key.match(/\/projects\/([^/]+)\//)?.[1] ?? '';


export function getProjects(): Project[] {
 const list = Object.entries(jsons).map(([key, mod]) => {
   const slug = slugOf(key);
   const d = mod.default;
   const url = (rel?: string) => (rel ? assets[`../projects/${slug}/${rel}`] ?? '' : '');
   return {
     slug,
     title: d.title, year: d.year, type: d.type, role: d.role, location: d.location,
     order: d.order ?? 999, summary: d.summary, brief: d.brief, note: d.note ?? '',
     tools: d.tools ?? [], tags: d.tags ?? [], cameraOrbit: d.cameraOrbit,
     model: url(d.model), modelLow: d.modelLow ? url(d.modelLow) : undefined,
     hero: url(d.hero), render: url(d.render), modelPhoto: url(d.modelPhoto),
     drawings: (d.drawings ?? []).map((dr) => ({ src: url(dr.file), caption: dr.caption ?? '', wide: !!dr.wide })),
     process: (d.process ?? []).map((s) => ({ stage: s.stage, note: s.note, media: url(s.media) })),
   } as Project;
 });
 return list.sort((a, b) => a.order - b.order);
}





