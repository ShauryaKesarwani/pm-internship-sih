"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { fetchJson } from "../lib/api";

export default function ProfilePage() {
  const [currentTab, setCurrentTab] = useState<
    "profile" | "history" | "applications" | "ongoing"
  >("profile");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isResumeUploadOpen, setIsResumeUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [user, setUser] = useState<any>({
    auth0Id: "auth0|abc123",
    username: "dhruvpankhania",
    name: "DhruvPankhania",
    gender: "Male",
    email: "dhruvpankhania@example.com",
    password: "",
    avatar:
      "data:image/svg+xml;utf8,\
      <svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>\
        <rect width='256' height='256' rx='24' fill='%23FFE1D7'/>\
        <circle cx='128' cy='96' r='40' fill='%23FFC7B8'/>\
        <rect x='48' y='152' width='160' height='56' rx='28' fill='%23FFC7B8'/>\
      </svg>",
    field: "Product / Tech",
    contact: "+91 98765 43210",
    residence: { pin: 411001, city: "Pune", state: "Maharashtra" },
    title: "Product Intern",
    location: "Pune, India",
    about:
      "Aspiring product manager passionate about user research, data-informed decisions, and building delightful experiences.",
    links: {
      linkedin: "https://www.linkedin.com/in/dhruvpankhania",
      github: "https://github.com/dhruvpankhania",
      website: "https://dhruvpankhania.dev",
    },
    experience: {
      internships: [
        {
          title: "Product Analyst Intern",
          company: "Acme Corp",
          duration: "May 2024 - Aug 2024",
          description: "Ran A/B tests, built dashboards, supported roadmap decisions.",
        },
        {
          title: "UX Research Intern",
          company: "DesignHub",
          duration: "Jan 2024 - Apr 2024",
          description: "User interviews, journey mapping, moderated usability tests.",
        },
      ],
    },
    resume: {
      skills: [
        "User Research",
        "Wireframing",
        "A/B Testing",
        "SQL",
        "Analytics",
        "Jira",
      ],
      projects: ["p1", "p2", "p3"],
      certifications: [
        "Google Data Analytics Certificate",
        "Product Analytics 101",
      ],
      socialLinks: [
        "https://linkedin.com/in/janedoe",
        "https://github.com/janedoe",
        "https://janedoe.dev",
      ],
      docResume: {
        url: "https://example.com/resume.pdf",
      },
    },
    internships: {
      applications: ["a1", "a2", "a3"],
      pastInternships: ["i1", "i2"],
      currentInternship: "i3",
    },
  });

  const [formData, setFormData] = useState<any | null>(null);
  const resumeUploadInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isResumeUploadOpen) {
      setTimeout(() => resumeUploadInputRef.current?.focus(), 50);
    }
  }, [isResumeUploadOpen]);

  // Load profile data from backend
  useEffect(() => {
    const load = async () => {
      try {
        const profile = await fetchJson<{ success: boolean; user: any }>(
          "/user/profile"
        );
        if (profile?.user) {
          setUser((prev: any) => ({ ...prev, ...profile.user }));
        }
      } catch (e) {
        console.warn("Failed to load profile:", e);
      }
      try {
        const exp = await fetchJson<{ success: boolean; experience: any }>(
          "/user/experience"
        );
        if (exp?.experience) {
          setUser((prev: any) => ({
            ...prev,
            experience: { internships: exp.experience?.internships || [] },
          }));
        }
      } catch {}
    };
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main className="w-full px-4 py-6 min-h-screen bg-[#FFF5F2]">
        <section className="grid grid-cols-1 grid-rows-2 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_48px_#FFD1C4]">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-[#FFE1D7]">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="mt-4 text-xl font-semibold text-neutral-900">
                  {user.name}
                </h1>
                <p className="text-sm text-neutral-500">
                  {user.title}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {user.location}
                </p>
                <a
                  href={`mailto:${user.email}`}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  {user.email}
                </a>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={user.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border px-3 py-1.5 text-sm text-neutral-700 hover:bg-[#FFE1D7]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={user.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border px-3 py-1.5 text-sm text-neutral-700 hover:bg-[#FFE1D7]"
                  >
                    GitHub
                  </a>
                  <a
                    href={user.links.website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border px-3 py-1.5 text-sm text-neutral-700 hover:bg-[#FFE1D7]"
                  >
                    Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 md:row-span-2">
            <div className="rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_64px_#FFD1C4]">
              {currentTab === "profile" && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">Basic Information</h2>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Username:</span> {user.username}</p>
                      <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Name:</span> {user.name}</p>
                      <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Gender:</span> {user.gender || "—"}</p>
                      <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Email:</span> {user.email}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Field:</span> {user.field || "—"}</p>
                      <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Contact:</span> {user.contact || "—"}</p>
                      <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Residence:</span> {user?.residence ? `${user.residence.city || "—"}, ${user.residence.state || "—"} ${user.residence.pin ? `- ${user.residence.pin}` : ""}` : "—"}</p>
                      <p className="text-sm text-neutral-600"><span className="font-medium text-neutral-900">Auth0 ID:</span> {user.auth0Id || "—"}</p>
                    </div>
                  </div>

                  <h3 className="mt-6 text-base font-semibold text-neutral-900">About</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    {user.about}
                  </p>
                  <div className="mt-6">
                    <h3 className="text-base font-semibold text-neutral-900">
                      Skills
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.resume.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-full border px-3 py-1 text-xs text-neutral-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-semibold text-neutral-900">Experience</h4>
                      <ul className="mt-2 space-y-3 text-sm text-neutral-700">
                        {user.experience.internships.map((exp: any, idx: number) => (
                          <li key={`${exp.title}-${idx}`}>
                            <p className="font-medium text-neutral-900">{exp.title} · {exp.company}</p>
                            <p className="text-neutral-600">{exp.duration}</p>
                            <p className="text-neutral-700">{exp.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="text-sm font-semibold text-neutral-900">Resume</h4>
                      <div className="mt-2">
                        <p className="text-sm text-neutral-700"><span className="font-medium text-neutral-900">Certifications:</span></p>
                        <ul className="ml-4 list-disc text-sm text-neutral-700">
                          {user.resume.certifications.map((c: string) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                        <p className="mt-3 text-sm text-neutral-700"><span className="font-medium text-neutral-900">Social Links:</span></p>
                        <ul className="ml-4 list-disc text-sm text-neutral-700">
                          {user.resume.socialLinks.map((s: string) => (
                            <li key={s}><a className="underline" href={s} target="_blank" rel="noreferrer">{s}</a></li>
                          ))}
                        </ul>
                        {user.resume.docResume?.url && (
                          <a
                            href={user.resume.docResume.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-block rounded-md bg-[#FF9982] px-3 py-1.5 text-sm text-white hover:bg-[#FF876A]"
                          >
                            View Resume (PDF)
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border p-4">
                    <h4 className="text-sm font-semibold text-neutral-900">Internships Overview</h4>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-neutral-700">
                      <div>
                        <p className="font-medium text-neutral-900">Applications</p>
                        <p>{user.internships.applications.length}</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Past</p>
                        <p>{user.internships.pastInternships.length}</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Current</p>
                        <p>{user.internships.currentInternship ? 1 : 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setUploadError(null);
                        setSelectedFile(null);
                        setFormData({
                          username: user.username,
                          name: user.name,
                          gender: user.gender,
                          email: user.email,
                          field: user.field,
                          contact: user.contact,
                          residencePin: user?.residence?.pin || "",
                          residenceCity: user?.residence?.city || "",
                          residenceState: user?.residence?.state || "",
                          about: user.about,
                          skillsCSV: (user.resume?.skills || []).join(", "),
                          socialLinksCSV: (user.resume?.socialLinks || []).join(", "),
                          certificationsCSV: (user.resume?.certifications || []).join(", "),
                        });
                        setIsUploadOpen(true);
                      }}
                      className="rounded-md bg-[#FF9982] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF876A]"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setUploadError(null);
                        setSelectedFile(null);
                        setIsResumeUploadOpen(true);
                      }}
                      className="rounded-md border border-[#FF9982] px-4 py-2 text-sm font-medium text-[#FF9982] hover:bg-[#FFE1D7]"
                    >
                      Upload Resume
                    </button>
                  </div>
                </div>
              )}

              {currentTab === "history" && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Internship History
                  </h2>
                  <div className="mt-4 space-y-3">
                    {[
                      {
                        role: "Product Analyst Intern",
                        company: "Acme Corp",
                        duration: "May 2024 – Aug 2024",
                        status: "Completed",
                        summary:
                          "Owned weekly metrics reporting and supported two A/B tests.",
                      },
                      {
                        role: "UX Research Intern",
                        company: "DesignHub",
                        duration: "Jan 2024 – Apr 2024",
                        status: "Completed",
                        summary:
                          "Conducted 12 interviews and helped craft journey maps.",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-neutral-900">
                            {item.role} · {item.company}
                          </p>
                          <span className="rounded-full bg-[#FFE1D7] px-2 py-0.5 text-xs text-neutral-900">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">{item.duration}</p>
                        <p className="mt-1 text-sm text-neutral-700">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === "applications" && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Open Applications
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                      {
                        role: "PM Intern",
                        company: "ByteWorks",
                        appliedOn: "2025-01-15",
                        stage: "Interview",
                      },
                      {
                        role: "Strategy Intern",
                        company: "NovaLabs",
                        appliedOn: "2025-01-10",
                        stage: "Applied",
                      },
                    ].map((app, idx) => (
                      <div key={idx} className="rounded-lg border p-4">
                        <p className="font-medium text-neutral-900">
                          {app.role} · {app.company}
                        </p>
                        <p className="text-sm text-neutral-600">Applied on: {app.appliedOn}</p>
                        <p className="mt-1 text-sm">
                          <span className="font-medium text-neutral-900">Stage:</span> {app.stage}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button className="rounded-md border px-3 py-1 text-sm hover:bg-[#FFE1D7]">
                            View
                          </button>
                          <button className="rounded-md border px-3 py-1 text-sm hover:bg-[#FFE1D7]">
                            Withdraw
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {currentTab === "ongoing" && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Ongoing Internship
                  </h2>
                  <div className="mt-4 rounded-lg border p-4">
                    <p className="font-medium text-neutral-900">Product Intern · OrbitX</p>
                    <p className="text-sm text-neutral-600">Feb 2025 – Present · Remote</p>
                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-md border p-3">
                        <p className="text-sm font-medium text-neutral-900">Mentor</p>
                        <p className="text-sm text-neutral-700">Arjun Mehta (Senior PM)</p>
                      </div>
                      <div className="rounded-md border p-3">
                        <p className="text-sm font-medium text-neutral-900">Current Milestone</p>
                        <p className="text-sm text-neutral-700">Ship onboarding funnel improvements (Week 3)</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-neutral-900">Recent Updates</p>
                      <ul className="ml-4 list-disc text-sm text-neutral-700">
                        <li>Completed baseline funnel analysis</li>
                        <li>Prepared user interview script</li>
                        <li>Drafted experiment plan for step-2 drop-off</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_48px_#FFD1C4]">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setCurrentTab("profile")}
                  aria-pressed={currentTab === "profile"}
                  className={`text-xl rounded-lg p-3 flex items-center justify-center gap-2 ${
                    currentTab === "profile"
                      ? "bg-[#FF9982] text-white"
                      : "bg-[#FFE1D7] hover:bg-[#FFC7B8] text-neutral-900"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setCurrentTab("history")}
                  aria-pressed={currentTab === "history"}
                  className={`text-xl rounded-lg p-3 flex items-center justify-center gap-2 ${
                    currentTab === "history"
                      ? "bg-[#FF9982] text-white"
                      : "bg-[#FFE1D7] hover:bg-[#FFC7B8] text-neutral-900"
                  }`}
                >
                  Internship History
                </button>
                <button
                  onClick={() => setCurrentTab("applications")}
                  aria-pressed={currentTab === "applications"}
                  className={`text-xl rounded-lg p-3 flex items-center justify-center gap-2 ${
                    currentTab === "applications"
                      ? "bg-[#FF9982] text-white"
                      : "bg-[#FFE1D7] hover:bg-[#FFC7B8] text-neutral-900"
                  }`}
                >
                  Open Application
                </button>
                <button
                  onClick={() => setCurrentTab("ongoing")}
                  aria-pressed={currentTab === "ongoing"}
                  className={`text-xl rounded-lg p-3 flex items-center justify-center gap-2 ${
                    currentTab === "ongoing"
                      ? "bg-[#FF9982] text-white"
                      : "bg-[#FFE1D7] hover:bg-[#FFC7B8] text-neutral-900"
                  }`}
                >
                  Ongoing Internship
                </button>
              </div>
            </div>
          </div>
        </section>

        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsUploadOpen(false)}
            />
            <div className="relative z-10 w-full max-w-2xl rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_72px_#FFD1C4] max-h-[85vh] overflow-y-auto no-scrollbar">
              <h3 className="text-lg font-semibold text-neutral-900">Edit Profile</h3>
              <p className="mt-1 text-sm text-neutral-600">Update your profile details or upload a new resume (PDF).</p>

              <form
                className="mt-4 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setUploadError(null);

                  // Build updated user object
                  const updated = { ...user };
                  updated.username = formData.username;
                  updated.name = formData.name;
                  updated.gender = formData.gender;
                  updated.email = formData.email;
                  updated.field = formData.field;
                  updated.contact = formData.contact;
                  updated.residence = {
                    pin: formData.residencePin ? Number(formData.residencePin) : undefined,
                    city: formData.residenceCity || undefined,
                    state: formData.residenceState || undefined,
                  };
                  updated.about = formData.about;
                  updated.resume = {
                    ...user.resume,
                    skills: (formData.skillsCSV || "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
                    socialLinks: (formData.socialLinksCSV || "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
                    certifications: (formData.certificationsCSV || "").split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0),
                  };

                  // Send update to backend
                  fetchJson<{ message: string; user: any }>(
                    "/user/profile/edit",
                    {
                      method: "POST",
                      body: JSON.stringify(updated),
                    }
                  )
                    .then((res) => {
                      if (res?.user) setUser((prev: any) => ({ ...prev, ...res.user }));
                      setIsUploadOpen(false);
                    })
                    .catch((err) => {
                      setUploadError(err?.message || "Failed to update profile");
                    });
                }}
              >
                {/* Basic fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Username</label>
                    <input
                      value={formData?.username || ""}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Name</label>
                    <input
                      value={formData?.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Gender</label>
                    <input
                      value={formData?.gender || ""}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Gender"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Email</label>
                    <input
                      type="email"
                      value={formData?.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Field</label>
                    <input
                      value={formData?.field || ""}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="e.g., Product / Tech"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Contact</label>
                    <input
                      value={formData?.contact || ""}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-900">PIN</label>
                      <input
                        value={formData?.residencePin || ""}
                        onChange={(e) => setFormData({ ...formData, residencePin: e.target.value })}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="e.g., 411001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-900">City</label>
                      <input
                        value={formData?.residenceCity || ""}
                        onChange={(e) => setFormData({ ...formData, residenceCity: e.target.value })}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-900">State</label>
                      <input
                        value={formData?.residenceState || ""}
                        onChange={(e) => setFormData({ ...formData, residenceState: e.target.value })}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="State"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900">About</label>
                  <textarea
                    value={formData?.about || ""}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    rows={4}
                    placeholder="Tell us about yourself"
                  />
                </div>

                {/* CSV fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Skills (comma-separated)</label>
                    <input
                      value={formData?.skillsCSV || ""}
                      onChange={(e) => setFormData({ ...formData, skillsCSV: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="SQL, A/B Testing, Wireframing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">Certifications (comma-separated)</label>
                    <input
                      value={formData?.certificationsCSV || ""}
                      onChange={(e) => setFormData({ ...formData, certificationsCSV: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Cert 1, Cert 2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-900">Social Links (comma-separated)</label>
                    <input
                      value={formData?.socialLinksCSV || ""}
                      onChange={(e) => setFormData({ ...formData, socialLinksCSV: e.target.value })}
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="https://linkedin..., https://github..."
                    />
                  </div>
                </div>

                {/* Resume upload moved to dedicated modal; removed from Edit Profile */}

                <div className="mt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="rounded-md border px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-[#FF9982] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF876A]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {isResumeUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsResumeUploadOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_72px_#FFD1C4] max-h-[85vh] overflow-y-auto no-scrollbar">
            <h3 className="text-lg font-semibold text-neutral-900">Upload Resume (PDF)</h3>
            <p className="mt-1 text-sm text-neutral-600">Choose a PDF to upload. Only .pdf files are allowed.</p>

            <div className="mt-4">
              <input
                ref={resumeUploadInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="w-full cursor-pointer rounded-md border px-3 py-2 text-sm text-neutral-800 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-neutral-800 hover:file:bg-neutral-200"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  setUploadError(null);
                  setSelectedFile(file ?? null);
                }}
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-neutral-700">Selected: {selectedFile.name}</p>
              )}
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResumeUploadOpen(false)}
                className="rounded-md border px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadError(null);
                  if (!selectedFile) {
                    setUploadError("Please choose a PDF file to upload.");
                    return;
                  }
                  if (selectedFile.type !== "application/pdf") {
                    setUploadError("Only PDF files are allowed.");
                    return;
                  }
                  // TODO: integrate with backend upload endpoint
                  setIsResumeUploadOpen(false);
                }}
                className="rounded-md bg-[#FF9982] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF876A]"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </main>
    </>
  );
}
