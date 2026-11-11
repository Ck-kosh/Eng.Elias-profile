/* ============================================================
   SITE CONTENT — single source of truth.
   The Admin Dashboard edits this data (stored in localStorage
   as a demo, or served from /api/* once the backend is live).
   ============================================================ */

const DEFAULT_DATA = {
  profile: {
    name: "Kosh",
    tagline: "I build modern web applications and install professional security systems — from CCTV & IP cameras to solar cameras, alarm systems and automated school bells.",
    bio: "I'm a passionate Software Engineer and Security Systems Specialist based in Kenya. I combine clean, reliable code with hands-on technical expertise to solve real problems — businesses hire me to build their digital products, and families, schools and companies trust me to protect their premises with professional CCTV, alarm and bell installations. Every project, whether software or security, gets the same standard: neat work, honest advice, and systems that simply work.",
    photo: "assets/profile.png",
    skills: ["JavaScript","HTML5","CSS3","Node.js","MongoDB","Python","CCTV Installation","IP Camera Config","Solar Systems","Alarm Systems","Electrical Bells","Networking"]
  },
  projects: [
    {
      id: 1,
      title: "School Management System",
      description: "A full web platform for schools to manage students, staff, fees, exams and reports — with role-based dashboards for admins, teachers and parents.",
      image: "assets/project-1.svg",
      tech: ["HTML","CSS","JavaScript","Node.js","MongoDB"],
      live: "https://example.com",
      github: "https://github.com/thekosh12"
    },
    {
      id: 2,
      title: "Business Inventory & POS",
      description: "Point-of-sale and stock management system for retail shops — tracks sales, stock levels, suppliers and generates daily reports.",
      image: "assets/project-2.svg",
      tech: ["JavaScript","Node.js","Express","MongoDB"],
      live: "https://example.com",
      github: "https://github.com/thekosh12"
    },
    {
      id: 3,
      title: "CCTV Client Monitoring App",
      description: "A dashboard that lets clients view their camera feeds, playback recordings and receive motion alerts from any device.",
      image: "assets/project-3.svg",
      tech: ["JavaScript","HTML","CSS","REST API"],
      live: "https://example.com",
      github: "https://github.com/thekosh12"
    }
  ],
  services: [
    { id:1, icon:"📹", title:"Cable CCTV Cameras", description:"Professional installation of traditional wired CCTV surveillance systems with high-quality video and secure recording." },
    { id:2, icon:"🌐", title:"IP Cameras", description:"Installation and configuration of network-based IP security cameras with remote viewing on your phone." },
    { id:3, icon:"☀️", title:"Solar Cameras", description:"Solar-powered surveillance cameras — perfect for remote areas and sites without reliable electricity." },
    { id:4, icon:"📷", title:"Standalone Cameras", description:"Independent security camera systems that record to memory cards — simple, affordable and effective." },
    { id:5, icon:"🚪", title:"Gate Alarm Systems", description:"Alarm systems with bell notifications inside the house whenever someone accesses or triggers the gate." },
    { id:6, icon:"🚨", title:"Siren Cameras", description:"Security cameras equipped with built-in siren alarms that scare off intruders instantly." },
    { id:7, icon:"🔔", title:"Electric Bells for Schools", description:"Installation of reliable electric bell systems for school notifications, break times and assemblies." },
    { id:8, icon:"⏰", title:"Automatic Siren Bells with Timers", description:"Automated siren and bell systems programmed to ring according to your exact schedule." }
  ],
  gallery: [
    { id:1, image:"assets/gallery-1.svg", title:"4-Camera Home CCTV Setup", category:"cctv", desc:"Full wired DVR system installed for a private residence." },
    { id:2, image:"assets/gallery-2.svg", title:"Solar Camera — Farm Perimeter", category:"solar", desc:"Solar-powered 4G camera securing a farm boundary." },
    { id:3, image:"assets/gallery-3.svg", title:"School Bell Timer System", category:"school", desc:"Automatic bell programmed for 8 daily schedules." },
    { id:4, image:"assets/gallery-4.svg", title:"8-Channel IP Camera Network", category:"cctv", desc:"NVR-based IP system with remote phone viewing." },
    { id:5, image:"assets/gallery-5.svg", title:"Gate Alarm + Indoor Bell", category:"alarm", desc:"Gate-triggered alarm with notification bell in the house." },
    { id:6, image:"assets/gallery-6.svg", title:"Inventory POS Dashboard", category:"software", desc:"Stock and sales dashboard built for a retail client." },
    { id:7, image:"assets/gallery-7.svg", title:"Siren Camera — Shop Front", category:"alarm", desc:"Camera with motion-activated siren at a storefront." },
    { id:8, image:"assets/gallery-8.svg", title:"Standalone Camera — Parking", category:"cctv", desc:"SD-card camera monitoring a private parking area." }
  ],
  contact: {
    phone: "+254769021360",
    email: "thekosh12@gmail.com",
    whatsapp: "254769021360",
    location: "Kenya — available nationwide",
    socials: [
      { name:"GitHub", url:"https://github.com/thekosh12", icon:"github" },
      { name:"LinkedIn", url:"https://linkedin.com/in/thekosh12", icon:"linkedin" },
      { name:"X (Twitter)", url:"https://x.com/thekosh12", icon:"x" },
      { name:"Instagram", url:"https://instagram.com/thekosh12", icon:"instagram" }
    ]
  }
};
