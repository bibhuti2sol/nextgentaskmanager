"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Add imports for chart
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  DoughnutControllerChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Dummy pie chart data for the hero circle
const heroPieData = {
  labels: ["Completed", "In Progress", "Overdue", "Total"],
  datasets: [
    {
      label: "Tasks",
      data: [32, 12, 4, 48],
      backgroundColor: [
        "rgba(34,197,94,0.85)",    // Completed - green
        "rgba(59,130,246,0.85)",   // In Progress - blue
        "rgba(239,68,68,0.85)",    // Overdue - red
        "rgba(251,191,36,0.85)",   // Total - yellow
      ],
      borderWidth: 2,
      borderColor: "#fff",
      hoverOffset: 12,
      offset: [40, 0, 0, 0], // Increase offset for green slice (first slice)
    },
  ],
};

// Remove the `_DeepPartialObject` import and use a generic type assertion for `heroPieOptions`.
const heroPieOptions = {
  responsive: true,
  cutout: "0%", // Make it a full pie, not donut
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        font: { size: 16, family: "inherit" },
        color: "#22223b",
        boxWidth: 24,
        boxHeight: 24,
        padding: 24,
        usePointStyle: true,
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#fff",
      titleColor: "#22223b",
      bodyColor: "#22223b",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      callbacks: {
        label: function (context: any) {
          const dataset = context.dataset;
          const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
          const value = context.parsed;
          const percent = total ? ((value / total) * 100).toFixed(1) : 0;
          return `${context.label}: ${value} (${percent}%)`;
        },
      },
      displayColors: true,
      caretSize: 8,
      cornerRadius: 8,
      padding: 12,
      boxPadding: 6,
    },
    datalabels: {
      display: true,
      color: "#fff",
      font: { weight: "bold", size: 20, family: "inherit" },
      borderRadius: 4,
      backgroundColor: (context: any) => context.dataset.backgroundColor[context.dataIndex],
      padding: 6,
      anchor: "center", // Valid type
      align: "center", // Valid type
      formatter: function (value: number, context: any) {
        const data = context.chart.data.datasets[0].data;
        const total = data.reduce((a: number, b: number) => a + b, 0);
        const percent = total ? parseFloat(((value / total) * 100).toFixed(0)) : 0;
        // Only show if > 5% for realism
        return percent > 5 ? `${percent}%` : "";
      },
    },
  },
  layout: {
    padding: 0,
  },
  animation: {
    animateRotate: true,
    animateScale: true,
  },
} as const;

const features = [
  {
    name: "Task Management",
    desc: "Organize, assign, and track tasks efficiently across your team.",
    type: "bar",
    style: "vertical",
    chartData: [12, 19, 7, 14, 10],
  },
  {
    name: "Project Management",
    desc: "Plan, execute, and monitor projects with timelines and milestones.",
    type: "table",
    table: [
      ["Project", "Status", "Deadline"],
      ["Website Redesign", "In Progress", "Feb 20"],
      ["Mobile App", "Completed", "Jan 15"],
      ["Marketing", "Pending", "Mar 10"],
    ],
  },
  {
    name: "Chat Discussions",
    desc: "Collaborate instantly with team chat and group discussions.",
    type: "pie",
    style: "donut",
    pie: [40, 30, 30],
  },
  {
    name: "Doc And Attachment",
    desc: "Attach files and documents to tasks and projects for easy access.",
    type: "table",
    table: [
      ["File Name", "Type", "Size"],
      ["Specs.pdf", "PDF", "2MB"],
      ["Design.png", "Image", "1.2MB"],
    ],
  },
  {
    name: "Workflow Management",
    desc: "Automate and streamline your business processes.",
    type: "bar",
    style: "horizontal",
    chartData: [5, 8, 12, 6, 9],
  },
  {
    name: "Time Sheet",
    desc: "Track work hours and productivity for each team member.",
    type: "pie",
    style: "segment",
    pie: [50, 25, 25],
  },
  {
    name: "Reports",
    desc: "Generate insightful reports for tasks, projects, and teams.",
    type: "bar",
    style: "vertical",
    chartData: [10, 15, 8, 12, 7],
  },
  {
    name: "Integration",
    desc: "Connect with your favorite tools and platforms seamlessly.",
    type: "table",
    table: [
      ["Tool", "Status"],
      ["Slack", "Connected"],
      ["Google Drive", "Connected"],
      ["Jira", "Pending"],
    ],
  },
  {
    name: "Additional Features",
    desc: "Explore more advanced options for power users.",
    type: "line",
    chartData: [7, 11, 9, 13, 6],
  },
  {
    name: "Task Delegation",
    desc: "Assign tasks to the right people and monitor progress.",
    type: "pie",
    style: "donut",
    pie: [60, 20, 20],
  },
  {
    name: "To Do List",
    desc: "Keep track of daily tasks and priorities.",
    type: "table",
    table: [
      ["Task", "Status"],
      ["Email client", "Done"],
      ["Prepare report", "Pending"],
    ],
  },
  {
    name: "Task Planner",
    desc: "Plan tasks ahead and set reminders for deadlines.",
    type: "bar",
    style: "horizontal",
    chartData: [8, 10, 6, 12, 9],
  },
  {
    name: "Task Tracker",
    desc: "Track progress and completion rates for all tasks.",
    type: "pie",
    style: "segment",
    pie: [70, 15, 15],
  },
  {
    name: "Attendance Management",
    desc: "Monitor attendance and leave for your team.",
    type: "table",
    table: [
      ["Name", "Present"],
      ["Alice", "Yes"],
      ["Bob", "No"],
    ],
  },
  {
    name: "Leave Management",
    desc: "Manage leave requests and approvals easily.",
    type: "line",
    chartData: [3, 6, 2, 8, 5],
  },
];

const industries = [
  "Manufacturing Industry",
  "Real Estate and Construction Sector",
  "CA/CS/CFA",
  "Event Management",
  "IT Industry",
  "Education Sector",
  "Law Firms",
  "Service Sector & Consulting Firms",
  "BPO & KPO Firms",
  "Healthcare & Hospitals",
];

function FeatureModal({ feature, onClose }: { feature: any; onClose: () => void }) {
  // Pie chart colors
  const pieColors = ["#60a5fa", "#34d399", "#fbbf24", "#818cf8", "#f472b6", "#a3e635", "#f87171", "#f43f5e", "#38bdf8", "#facc15"];

  // Pie chart generator
  function renderPieChart(data: number[], style: string = "segment") {
    const total = data.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const radius = style === "donut" ? 40 : 48;
    const center = 60;
    return (
      <svg width={120} height={120} viewBox="0 0 120 120">
        <circle cx={center} cy={center} r={radius} fill="#f3f4f6" />
        {style === "donut" && <circle cx={center} cy={center} r={radius - 18} fill="#fff" />}
        {data.map((value, i) => {
          const startAngle = (cumulative / total) * 2 * Math.PI;
          const endAngle = ((cumulative + value) / total) * 2 * Math.PI;
          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(endAngle);
          const y2 = center + radius * Math.sin(endAngle);
          const largeArc = value / total > 0.5 ? 1 : 0;
          const pathData = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
          cumulative += value;
          return (
            <path key={i} d={pathData} fill={pieColors[i % pieColors.length]} stroke="#fff" strokeWidth={2} />
          );
        })}
      </svg>
    );
  }

  // Line chart generator
  function renderLineChart(data: number[]) {
    const max = Math.max(...data);
    const points = data.map((val, i) => `${20 + i * 20},${100 - (val / max) * 80}`).join(" ");
    return (
      <svg width={120} height={120} viewBox="0 0 120 120">
        <rect x={0} y={0} width={120} height={120} rx={16} fill="#f3f4f6" />
        <polyline points={points} fill="none" stroke="#60a5fa" strokeWidth={4} strokeLinejoin="round" />
        {data.map((val, i) => (
          <circle key={i} cx={20 + i * 20} cy={100 - (val / max) * 80} r={5} fill={pieColors[i % pieColors.length]} />
        ))}
      </svg>
    );
  }

  // Horizontal bar chart
  function renderHorizontalBarChart(data: number[]) {
    const max = Math.max(...data);
    return (
      <div className="flex flex-col gap-2 mb-4">
        {data.map((val: number, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="h-8 rounded-xl bg-gradient-to-r from-primary/30 to-primary/70 shadow-md" style={{ width: `${(val / max) * 120}px`, background: pieColors[idx % pieColors.length] }}></div>
            <span className="text-xs text-primary font-bold">{val}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
        <button className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary" onClick={onClose}>&times;</button>
        <h3 className="text-2xl font-bold text-primary mb-2 text-center">{feature.name}</h3>
        <p className="text-base text-muted-foreground mb-4 text-center">{feature.desc}</p>
        {feature.type === "bar" && feature.style === "vertical" && (
          <div className="flex items-end justify-center gap-2 h-36 mb-4">
            {feature.chartData.map((val: number, idx: number) => (
              <div key={idx} className="w-10 rounded-xl flex flex-col justify-end items-center shadow-md hover:scale-105 transition" style={{ background: pieColors[idx % pieColors.length] }}>
                <div style={{ height: `${val * 6}px`, background: pieColors[idx % pieColors.length] }} className="w-full rounded-xl"></div>
                <span className="block text-xs text-primary mt-2 font-bold">{val}</span>
              </div>
            ))}
          </div>
        )}
        {feature.type === "bar" && feature.style === "horizontal" && renderHorizontalBarChart(feature.chartData)}
        {feature.type === "pie" && renderPieChart(feature.pie, feature.style)}
        {feature.type === "line" && renderLineChart(feature.chartData)}
        {feature.type === "table" && (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border rounded-lg overflow-hidden text-sm">
              <tbody>
                {feature.table.map((row: string[], i: number) => (
                  <tr key={i} className={i === 0 ? "font-bold bg-primary/10" : ""}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 border-b border-border text-center">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pie chart legend */}
        {feature.type === "pie" && (
          <div className="flex gap-2 mt-2 flex-wrap justify-center">
            {feature.pie.map((val: number, i: number) => (
              <span key={i} className="flex items-center gap-1 text-xs font-semibold text-primary">
                <span style={{ background: pieColors[i % pieColors.length] }} className="inline-block w-3 h-3 rounded-full mr-1"></span>
                {val}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductMainPage() {
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col scroll-smooth relative overflow-x-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-80px] left-[-120px] w-[340px] h-[340px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-[180px] h-[180px] bg-success/10 rounded-full blur-2xl" />
      </div>
      {/* Header */}
      <header className="w-full bg-white/90 border-b border-border shadow-lg flex items-center justify-between px-8 py-4 sticky top-0 z-20 backdrop-blur-md">
        <Link href="/#" className="flex items-center gap-3">
          <span className="text-2xl font-bold text-primary">NextGenTask</span>
          <span className="text-xs font-semibold text-success ml-2">BE ORGANIZED</span>
        </Link>
        <nav className="flex gap-6 items-center">
          <button className="text-base font-medium text-primary hover:text-accent transition" onClick={() => scrollTo(featuresRef)}>Features</button>
          <button className="text-base font-medium text-primary hover:text-accent transition" onClick={() => scrollTo(industriesRef)}>Industries</button>
          <Link href="/signup" className="text-base font-medium text-primary hover:text-accent transition">Pricing</Link>
          <button className="text-base font-medium text-primary hover:text-accent transition" onClick={() => scrollTo(blogRef)}>Blog</button>
          <button className="text-base font-medium text-primary hover:text-accent transition" onClick={() => scrollTo(contactRef)}>Contact Us</button>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-primary to-accent text-white font-semibold px-5 py-2 rounded-full shadow hover:scale-105 transition">Demo</button>
          </Link>
          <Link href="/login">
            <button className="border border-primary text-primary font-semibold px-5 py-2 rounded-full hover:bg-primary/10 transition">Account</button>
          </Link>
        </nav>
      </header>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto py-20 px-6 gap-8 relative z-10">
        <div className="flex-1 flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight drop-shadow-lg animate-fade-in">
            NextGenTask Manager
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-accent mb-4 animate-fade-in">Understand Our Core Features</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg animate-fade-in">
            Take advantage of a range of features that help you and your team become organised and productive. Experience seamless task management, efficient project planning, and effective communication—all in one user-friendly platform.
          </p>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-primary to-accent text-white font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all animate-fade-in">Get Started</button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center relative">
          <div className="rounded-full bg-white shadow-2xl border-4 border-accent/30 w-[370px] h-[370px] flex items-center justify-center animate-fade-in relative">
            {/* Decorative elements */}
            <div className="absolute top-8 left-8 w-16 h-2 bg-primary/20 rounded-full" />
            <div className="absolute bottom-8 right-8 w-10 h-10 border-2 border-primary/10 rounded-full" />
            {/* Realistic pie chart */}
            <div className="flex items-center justify-center w-[350px] h-[350px] rounded-full bg-transparent">
              <Pie
                data={heroPieData}
                options={heroPieOptions}
                plugins={[ChartDataLabels]}
                width={350}
                height={350}
              />
            </div>
            {/* Subtle shadow for realism */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[220px] h-8 bg-black/10 rounded-full blur-md z-0" />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section ref={featuresRef} id="features" className="w-full max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-primary mb-8 text-center drop-shadow-lg animate-fade-in">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <button
              key={feature.name}
              className="bg-gradient-to-br from-white via-primary/5 to-accent/10 rounded-2xl border border-primary/10 shadow-lg p-8 flex items-center justify-center text-primary font-semibold text-lg hover:scale-105 hover:bg-primary/10 transition-all text-center animate-fade-in"
              onClick={() => setSelectedFeature(feature)}
            >
              {feature.name}
            </button>
          ))}
        </div>
        {selectedFeature && <FeatureModal feature={selectedFeature} onClose={() => setSelectedFeature(null)} />}
      </section>
      {/* Industries Section */}
      <section ref={industriesRef} id="industries" className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-accent mb-8 text-center drop-shadow-lg animate-fade-in">Industries We Serve</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
          {industries.map((industry) => (
            <li key={industry} className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-xl border border-accent/20 shadow p-6 text-primary font-semibold hover:scale-105 hover:bg-accent/10 transition-all animate-fade-in">
              {industry}
            </li>
          ))}
        </ul>
      </section>
      {/* Pricing Section (links to signup) */}
      <section ref={pricingRef} id="pricing" className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center drop-shadow-lg animate-fade-in">Pricing</h2>
        <div className="flex flex-col items-center">
          <p className="mb-6 text-lg text-muted-foreground text-center animate-fade-in">See our flexible plans and get started for free.</p>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-primary to-accent text-white font-bold px-10 py-4 rounded-full shadow-lg hover:scale-105 transition-all animate-fade-in">View Pricing & Sign Up</button>
          </Link>
        </div>
      </section>
      {/* Blog Section */}
      <section ref={blogRef} id="blog" className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-primary mb-8 text-center drop-shadow-lg animate-fade-in">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Post 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition-all">
            <h3 className="text-2xl font-semibold text-primary mb-4">Boost Your Productivity</h3>
            <p className="text-sm text-muted-foreground mb-6">Learn how NextGenTask Manager can help you streamline your workflows and achieve more in less time.</p>
            <button className="text-accent font-medium hover:underline">Read More</button>
          </div>
          {/* Blog Post 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition-all">
            <h3 className="text-2xl font-semibold text-primary mb-4">Effective Team Collaboration</h3>
            <p className="text-sm text-muted-foreground mb-6">Discover the best practices for fostering collaboration and communication within your team.</p>
            <button className="text-accent font-medium hover:underline">Read More</button>
          </div>
          {/* Blog Post 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition-all">
            <h3 className="text-2xl font-semibold text-primary mb-4">All-in-One Task Management</h3>
            <p className="text-sm text-muted-foreground mb-6">Explore how NextGenTask Manager combines all essential tools in one platform for seamless task management.</p>
            <button className="text-accent font-medium hover:underline">Read More</button>
          </div>
        </div>
      </section>
      {/* Contact Us Section */}
      <section ref={contactRef} id="contact" className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-accent mb-8 text-center drop-shadow-lg animate-fade-in">Contact Us</h2>
        <div className="flex flex-col items-center">
          <p className="mb-6 text-lg text-muted-foreground text-center animate-fade-in">For inquiries, partnerships, or support, email us at <a href="mailto:support@nextgentask.com" className="text-accent underline">support@nextgentask.com</a></p>
        </div>
      </section>
      {/* Subtask Modal */}
      {subtaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
            <button className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary" onClick={() => setSubtaskModalOpen(false)}>&times;</button>
            <h3 className="text-2xl font-bold text-primary mb-4 text-center">Edit Subtask</h3>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Subtask Name"
                className="border border-border rounded-lg px-4 py-2 w-full"
              />
              <select
                name="status"
                className="border border-border rounded-lg px-4 py-2 w-full"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="text"
                name="assignee"
                placeholder="Assignee"
                className="border border-border rounded-lg px-4 py-2 w-full"
              />
              <input
                type="date"
                name="date"
                className="border border-border rounded-lg px-4 py-2 w-full"
              />
              <button
                type="button"
                className="bg-gradient-to-r from-primary to-accent text-white font-bold px-6 py-2 rounded-lg hover:scale-105 transition"
                onClick={() => {
                  console.log("Subtask updated:");
                  setSubtaskModalOpen(false);
                }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Subtask Modal */}
      {subtaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
            <button className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary" onClick={() => setSubtaskModalOpen(false)}>&times;</button>
            <h3 className="text-2xl font-bold text-primary mb-4 text-center">Edit Subtask</h3>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Subtask Name"
                className="border border-border rounded-lg px-4 py-2 w-full"
              />
              <select
                name="status"
                className="border border-border rounded-lg px-4 py-2 w-full"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="text"
                name="assignee"
                placeholder="Assignee"
                className="border border-border rounded-lg px-4 py-2 w-full"
              />
              <input
                type="date"
                name="date"
                className="border border-border rounded-lg px-4 py-2 w-full"
              />
              <button
                type="button"
                className="bg-gradient-to-r from-primary to-accent text-white font-bold px-6 py-2 rounded-lg hover:scale-105 transition"
                onClick={() => {
                  console.log("Subtask updated:");
                  setSubtaskModalOpen(false);
                }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
