import type { AppLocale } from "@/lib/i18n";

export type IndustryMetric = {
  label: string;
  value: string;
};

export type IndustryDetailContent = {
  headline: string;
  description: string;
  highlights: string[];
  metrics: IndustryMetric[];
};

export const industryDetailsByLocale: Record<
  AppLocale,
  Record<string, IndustryDetailContent>
> = {
  en: {
    mining: {
      headline: "Digitally Managed Strategic Mineral Operations",
      description:
        "We operate integrated extraction and processing pipelines with real-time fleet telemetry and predictive maintenance controls.",
      highlights: [
        "Autonomous dispatch optimization across pit-to-port flows",
        "Ore recovery analytics with AI-assisted grade balancing",
        "Safety-critical permit-to-work controls across all shifts",
      ],
      metrics: [
        { label: "Annual Throughput", value: "84.6 Mtpa" },
        { label: "Recovery Factor", value: "93.8%" },
        { label: "TRIR", value: "0.17" },
        { label: "Asset Availability", value: "97.1%" },
      ],
    },
    "oil-gas": {
      headline: "High-Uptime Upstream and Midstream Execution",
      description:
        "Our oil and gas operations blend production engineering, integrity management, and SCADA observability for resilient output.",
      highlights: [
        "Remote operations center for 24/7 field performance monitoring",
        "Predictive corrosion and pipeline integrity models",
        "Turnaround orchestration with zero-loss workpack planning",
      ],
      metrics: [
        { label: "Terminal Throughput", value: "1.92 MMbbl/day" },
        { label: "Unplanned Shutdown Reduction", value: "31%" },
        { label: "Process Safety Events", value: "0.02 rate" },
        { label: "Dispatch SLA", value: "99.4%" },
      ],
    },
    healthcare: {
      headline: "Clinical Operations with Enterprise Reliability",
      description:
        "We modernize hospitals through patient-flow engineering, digital care pathways, and clinical governance systems.",
      highlights: [
        "Integrated triage and bed-capacity optimization",
        "Clinical pathway standardization and quality dashboards",
        "EMR-driven analytics for service continuity",
      ],
      metrics: [
        { label: "Network Bed Capacity", value: "8,420 beds" },
        { label: "Emergency Response Time", value: "< 8 min" },
        { label: "Patient Satisfaction", value: "94.6%" },
        { label: "Readmission Improvement", value: "22%" },
      ],
    },
    electrical: {
      headline: "Grid-Grade Electrical Engineering for Industry",
      description:
        "We deliver medium and high-voltage engineering with reliability-centered maintenance and rapid contingency response.",
      highlights: [
        "N-1 redundancy architecture for critical facilities",
        "Power quality stabilization and harmonic mitigation",
        "Condition-based maintenance for substation assets",
      ],
      metrics: [
        { label: "Managed Capacity", value: "18.4 GW" },
        { label: "SAIDI Improvement", value: "28%" },
        { label: "Protection Trip Accuracy", value: "99.7%" },
        { label: "Critical Uptime", value: "99.95%" },
      ],
    },
    semiconductor: {
      headline: "Precision Support for Semiconductor Value Chains",
      description:
        "We support ultra-clean manufacturing ecosystems with materials logistics, uptime services, and high-precision utilities.",
      highlights: [
        "Contamination-controlled material handling operations",
        "Fab utility reliability with predictive alerting",
        "Yield-informed process support at scale",
      ],
      metrics: [
        { label: "Tool Uptime Support", value: "99.3%" },
        { label: "Contamination Incident Rate", value: "0.04%" },
        { label: "Cycle Time Gain", value: "17%" },
        { label: "On-Time Material Delivery", value: "99.6%" },
      ],
    },
    machinery: {
      headline: "Heavy Machinery Performance Engineering",
      description:
        "Our machinery division improves lifecycle efficiency through advanced diagnostics, rebuild programs, and digital twinning.",
      highlights: [
        "Predictive maintenance playbooks for rotating equipment",
        "Critical component remanufacturing pipelines",
        "Fleet utilization optimization across multi-site operations",
      ],
      metrics: [
        { label: "Fleet Availability", value: "96.8%" },
        { label: "Mean Time To Repair", value: "-34%" },
        { label: "Lifecycle Cost Reduction", value: "21%" },
        { label: "Maintenance Compliance", value: "99.2%" },
      ],
    },
    ai: {
      headline: "Industrial AI for Decision-Grade Intelligence",
      description:
        "We deploy AI across operations to forecast risk, optimize output, and automate high-value workflows.",
      highlights: [
        "Digital twins for production and logistics scenarios",
        "Edge AI inference in remote industrial environments",
        "Portfolio-level performance command center",
      ],
      metrics: [
        { label: "Models In Production", value: "340+" },
        { label: "Forecast Accuracy", value: "96.1%" },
        { label: "Decision Latency", value: "-42%" },
        { label: "Automated Workflows", value: "1,280/day" },
      ],
    },
    manufacturing: {
      headline: "Lean Manufacturing with Real-Time Control",
      description:
        "We transform plants with integrated planning, OEE optimization, and cross-line automation frameworks.",
      highlights: [
        "High-frequency OEE monitoring and loss categorization",
        "Line balancing with adaptive scheduling engines",
        "Quality control loops powered by vision systems",
      ],
      metrics: [
        { label: "Average OEE", value: "89.4%" },
        { label: "Scrap Reduction", value: "26%" },
        { label: "On-Time Delivery", value: "98.8%" },
        { label: "Unit Cost Improvement", value: "19%" },
      ],
    },
    "civil-infrastructure": {
      headline: "National-Scale Civil and Infrastructure Delivery",
      description:
        "We execute complex infrastructure portfolios through integrated design-build-operate governance and digital QA systems.",
      highlights: [
        "BIM-driven multi-contractor coordination",
        "Program controls with earned-value governance",
        "Lifecycle asset performance and resilience planning",
      ],
      metrics: [
        { label: "Projects Under Delivery", value: "312" },
        { label: "Program Value", value: "USD 186B" },
        { label: "Schedule Adherence", value: "97.9%" },
        { label: "Quality NCR Reduction", value: "29%" },
      ],
    },
  },
  id: {
    mining: {
      headline: "Operasi Mineral Strategis Berbasis Kendali Digital",
      description:
        "Operasi ekstraksi dan pemrosesan terintegrasi dengan telemetri armada real-time serta kendali predictive maintenance.",
      highlights: [
        "Optimasi dispatch otonom dari pit hingga pelabuhan",
        "Analitik recovery bijih dengan AI-assisted grade balancing",
        "Kontrol permit-to-work kritikal untuk semua shift",
      ],
      metrics: [
        { label: "Throughput Tahunan", value: "84,6 Mtpa" },
        { label: "Faktor Recovery", value: "93,8%" },
        { label: "TRIR", value: "0,17" },
        { label: "Ketersediaan Aset", value: "97,1%" },
      ],
    },
    "oil-gas": {
      headline: "Eksekusi Hulu dan Midstream Berbasis High Uptime",
      description:
        "Operasi migas menggabungkan rekayasa produksi, integrity management, dan observabilitas SCADA untuk output stabil.",
      highlights: [
        "Remote operations center untuk monitoring 24/7",
        "Model prediktif korosi dan integritas pipa",
        "Orkestrasi turnaround dengan perencanaan workpack",
      ],
      metrics: [
        { label: "Throughput Terminal", value: "1,92 MMbbl/hari" },
        { label: "Penurunan Shutdown Tak Terencana", value: "31%" },
        { label: "Process Safety Events", value: "0,02 rate" },
        { label: "Dispatch SLA", value: "99,4%" },
      ],
    },
    healthcare: {
      headline: "Operasi Klinis dengan Reliabilitas Enterprise",
      description:
        "Kami memodernisasi rumah sakit melalui rekayasa patient-flow, jalur layanan digital, dan sistem tata kelola klinis.",
      highlights: [
        "Integrasi triase dan optimasi kapasitas bed",
        "Standarisasi clinical pathway dan dashboard kualitas",
        "Analitik berbasis EMR untuk kontinuitas layanan",
      ],
      metrics: [
        { label: "Kapasitas Bed Jaringan", value: "8.420 bed" },
        { label: "Waktu Respons Darurat", value: "< 8 menit" },
        { label: "Kepuasan Pasien", value: "94,6%" },
        { label: "Perbaikan Readmission", value: "22%" },
      ],
    },
    electrical: {
      headline: "Rekayasa Kelistrikan Kelas Grid untuk Industri",
      description:
        "Eksekusi kelistrikan menengah-tinggi dengan reliability-centered maintenance dan respons kontinjensi cepat.",
      highlights: [
        "Arsitektur redundansi N-1 fasilitas kritis",
        "Stabilisasi power quality dan mitigasi harmonik",
        "Condition-based maintenance untuk aset gardu",
      ],
      metrics: [
        { label: "Kapasitas Terkelola", value: "18,4 GW" },
        { label: "Perbaikan SAIDI", value: "28%" },
        { label: "Akurasi Protection Trip", value: "99,7%" },
        { label: "Uptime Kritis", value: "99,95%" },
      ],
    },
    semiconductor: {
      headline: "Dukungan Presisi untuk Rantai Nilai Semikonduktor",
      description:
        "Mendukung ekosistem manufaktur ultra-clean dengan logistik material, layanan uptime, dan utilitas presisi tinggi.",
      highlights: [
        "Material handling berbasis contamination control",
        "Reliabilitas utilitas fab dengan predictive alerting",
        "Dukungan proses berbasis data yield",
      ],
      metrics: [
        { label: "Dukungan Tool Uptime", value: "99,3%" },
        { label: "Rasio Insiden Kontaminasi", value: "0,04%" },
        { label: "Peningkatan Cycle Time", value: "17%" },
        { label: "On-Time Material Delivery", value: "99,6%" },
      ],
    },
    machinery: {
      headline: "Engineering Performa Alat Berat",
      description:
        "Divisi permesinan meningkatkan efisiensi siklus hidup lewat diagnostik lanjutan, program rebuild, dan digital twin.",
      highlights: [
        "Playbook predictive maintenance untuk rotating equipment",
        "Pipeline remanufaktur komponen kritis",
        "Optimasi utilisasi armada multi-site",
      ],
      metrics: [
        { label: "Ketersediaan Armada", value: "96,8%" },
        { label: "Mean Time To Repair", value: "-34%" },
        { label: "Penurunan Lifecycle Cost", value: "21%" },
        { label: "Kepatuhan Maintenance", value: "99,2%" },
      ],
    },
    ai: {
      headline: "AI Industri untuk Decision-Grade Intelligence",
      description:
        "Penerapan AI lintas operasi untuk prediksi risiko, optimasi output, dan otomasi workflow bernilai tinggi.",
      highlights: [
        "Digital twin untuk simulasi produksi dan logistik",
        "Edge AI inference untuk area industrial remote",
        "Performance command center tingkat portofolio",
      ],
      metrics: [
        { label: "Model di Produksi", value: "340+" },
        { label: "Akurasi Prediksi", value: "96,1%" },
        { label: "Penurunan Latensi Keputusan", value: "42%" },
        { label: "Workflow Terotomasi", value: "1.280/hari" },
      ],
    },
    manufacturing: {
      headline: "Manufaktur Lean dengan Kendali Real-Time",
      description:
        "Transformasi plant melalui perencanaan terintegrasi, optimasi OEE, dan framework otomasi lintas lini.",
      highlights: [
        "Monitoring OEE frekuensi tinggi dan klasifikasi losses",
        "Line balancing dengan adaptive scheduling engine",
        "Loop quality control berbasis vision system",
      ],
      metrics: [
        { label: "Rata-rata OEE", value: "89,4%" },
        { label: "Penurunan Scrap", value: "26%" },
        { label: "On-Time Delivery", value: "98,8%" },
        { label: "Perbaikan Biaya Unit", value: "19%" },
      ],
    },
    "civil-infrastructure": {
      headline: "Delivery Sipil dan Infrastruktur Skala Nasional",
      description:
        "Eksekusi portofolio infrastruktur kompleks dengan tata kelola design-build-operate terintegrasi dan sistem QA digital.",
      highlights: [
        "Koordinasi multi-kontraktor berbasis BIM",
        "Program controls dengan earned-value governance",
        "Perencanaan performa dan resiliensi aset jangka panjang",
      ],
      metrics: [
        { label: "Proyek Aktif", value: "312" },
        { label: "Nilai Program", value: "USD 186B" },
        { label: "Kepatuhan Jadwal", value: "97,9%" },
        { label: "Penurunan NCR Kualitas", value: "29%" },
      ],
    },
  },
};
