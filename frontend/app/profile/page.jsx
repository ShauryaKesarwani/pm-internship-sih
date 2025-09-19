"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Menu from "../components/menu";
import Button from "../components/buttons";

export default function ProfilePage() {
  const [currentTab, setCurrentTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState([]);
  const [currentInternship, setCurrentInternship] = useState(null);
  const [pastInternships, setPastInternships] = useState([]);
  const [openApplications, setOpenApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isResumeUploadOpen, setIsResumeUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  // Unified function to fetch user and internships
  const fetchUserData = async () => {
    setLoading(true);
    setLoadingInternships(true);
    try {
      const [profileRes, ongoingRes, pastRes, appliedRes, resumeRes] = await Promise.all([
        fetch("http://localhost:7470/user/profile", { credentials: "include" }),
        fetch("http://localhost:7470/user/internship/ongoing", { credentials: "include" }),
        fetch("http://localhost:7470/user/internship/past", { credentials: "include" }),
        fetch("http://localhost:7470/user/internship/applied", { credentials: "include" }),
        fetch("http://localhost:7470/user/profile/resume", { credentials: "include" }),
      ]);

      if (!profileRes.ok) throw new Error("Failed to fetch profile");

      const profileData = await profileRes.json();
      const ongoingData = await ongoingRes.json();
      const pastData = await pastRes.json();
      const appliedData = await appliedRes.json();
      const resumeData = await resumeRes.json();

      setUser(profileData.user || null);
      setCurrentInternship(ongoingData.currentInternship || null);
      setPastInternships(pastData.pastInternships || []);
      setOpenApplications(appliedData.applications || []);
      setResume(resumeData.resume || []);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setLoadingInternships(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch history or open applications based on tab
  // No history logic needed, only pure backend data

  // Helper to update form data
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save updated profile
  const saveProfileChanges = async () => {
    setUploadError(null);
    try {
      const updated = {
        ...user,
        ...formData,
        residence: {
          pin: formData.residencePin ? Number(formData.residencePin) : undefined,
          city: formData.residenceCity,
          state: formData.residenceState,
        },
        resume: {
          ...user?.resume,
          skills: (formData.skillsCSV || "").split(",").map(s => s.trim()).filter(Boolean),
          socialLinks: (formData.socialLinksCSV || "").split(",").map(s => s.trim()).filter(Boolean),
          certifications: (formData.certificationsCSV || "").split(",").map(s => s.trim()).filter(Boolean),
        },
      };


      const res = await fetch("http://localhost:7470/user/profile/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updated),
      });

      const data = await res.json();
      if (data?.user) setUser(data.user);
      setIsEditProfileOpen(false);

    } catch (err) {
      console.error("Failed to update profile:", err);
      setUploadError(err.message || "Failed to update profile");
    }
  };

  // Upload PDF file (frontend only)
  const handleUploadPDF = () => {
    setUploadError(null);
    if (!selectedFile) return setUploadError("Please select a file.");
    if (selectedFile.type !== "application/pdf") return setUploadError("Only PDFs allowed.");

    // TODO: integrate backend upload
    setIsResumeUploadOpen(false);
  };

  if (loading || !user) {
    return (
        <>
          <Navbar />
          <HeaderWhite />
          <Menu />
          <main className="mx-auto max-w-1xl px-4 py-6 text-center text-neutral-600">
            Loading profile...
          </main>
        </>
    );
  }
  // Only use pure backend data
  return (
      <>
        <Navbar />
        <HeaderWhite />
        <Menu />
        <main className="w-full px-4 py-6 min-h-screen bg-[#FFF5F2]">
        <section className="grid grid-cols-1 grid-rows-2 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_48px_#FFD1C4]">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-[#FFE1D7]">
                  <Image
                    src={
                      user.avatar ||
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><rect width='256' height='256' rx='24' fill='%23FFE1D7'/><circle cx='128' cy='96' r='40' fill='%23FFC7B8'/><rect x='48' y='152' width='160' height='56' rx='28' fill='%23FFC7B8'/></svg>"
                    }
                    alt={user.name || "User Avatar"}
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="mt-4 text-xl font-semibold text-neutral-900">
                  {user.name}
                </h1>
                <p className="text-sm text-neutral-500">
                  {user.title || "No title provided"}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {(user.residence?.city ? user.residence.city : "No city") + " - "}
                  {(user.residence?.pin ? user.residence.pin : "No PIN") + " - "}
                  {user.residence?.state || "No state"}
                </p>
                <a
                    href={`mailto:${user.email}`}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  {user.email}
                </a>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={resume.socialLinks?.linkedin || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border px-3 py-1.5 text-sm text-neutral-700 hover:bg-[#FFE1D7]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={resume.socialLinks?.github || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border px-3 py-1.5 text-sm text-neutral-700 hover:bg-[#FFE1D7]"
                  >
                    GitHub
                  </a>
                  <a
                    href={resume.socialLinks?.website || "#"}
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
            <div className="rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_48px_#FFD1C4]">
              {currentTab === "profile" && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    About
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    {user.about || "No about information provided"}
                  </p>
                  <div className="mt-6">
                    <h3 className="text-base font-semibold text-neutral-900">
                      Skills
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {resume?.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border px-3 py-1 text-xs text-neutral-700 text-neutral-700"
                        >
                          {skill}
                        </span>
                      )) || <span>No skills listed</span>}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4 border-[#FFC7B8]">
                      <h4 className="text-sm font-semibold text-neutral-900">
                        Preferences
                      </h4>
                      <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                        <li>Preferred Location: Remote / Pune</li>
                        <li>Looking For: Summer Internship 2025</li>
                        <li>Open to: Product, Strategy, Ops</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4 border-[#FFC7B8]">
                      <h4 className="text-sm font-semibold text-neutral-900">
                        Contact
                      </h4>
                      <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                        <li>Email: {user.email}</li>
                        <li>LinkedIn: {user.links?.linkedin || "N/A"}</li>
                        <li>Website: {user.links?.website || "N/A"}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setFormData({
                          username: user?.username || "",
                          name: user?.name || "",
                          gender: user?.gender || "",
                          email: user?.email || "",
                          field: user?.field || "",
                          contact: user?.contact || "",
                          residencePin: user?.residence?.pin || "",
                          residenceCity: user?.residence?.city || "",
                          residenceState: user?.residence?.state || "",
                          about: user?.about || "",
                          skillsCSV: (resume?.skills || []).join(", "),
                          socialLinksCSV: (
                            user?.resume?.socialLinks || []
                          ).join(", "),
                          certificationsCSV: (
                            user?.resume?.certifications || []
                          ).join(", "),
                        });
                        setIsEditProfileOpen(true);
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
                      Upload PDF
                    </button>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {currentTab === "history" && (
                <div>
                  {loadingInternships ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-sm text-neutral-600">Loading internships...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!currentInternship && (!pastInternships || pastInternships.length === 0) ? (
                        <p className="text-neutral-600 mt-4">No internship data available.</p>
                      ) : (
                        <>
                          {currentInternship && (
                            <div className="rounded-lg border p-4 bg-white mb-2">
                              <p><strong>{currentInternship.title || "No title"}</strong>{currentInternship.company ? ` at ${currentInternship.company}` : ""}</p>
                              <p>Status: Ongoing</p>
                            </div>
                          )}
                          {pastInternships && pastInternships.length > 0 && pastInternships.map((internship) => (
                            internship && (internship.title || internship.company) ? (
                              <div key={internship.id} className="rounded-lg border p-4 bg-white mb-2">
                                <p>
                                  {internship.title && internship.company
                                    ? <><strong>{internship.title}</strong> at {internship.company}</>
                                    : internship.title
                                      ? <strong>{internship.title}</strong>
                                      : internship.company
                                        ? <>Internship at {internship.company}</>
                                        : null}
                                </p>
                                <p>Status: Completed</p>
                              </div>
                            ) : null
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}


              {currentTab === "applications" && (
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Open Applications
                  </h2>
                  <p className="mt-2 text-sm text-neutral-700 mb-6">
                    Track and manage your active applications here.
                  </p>

                  {loadingApplications ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-sm text-neutral-600">
                        Loading open applications...
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!openApplications || openApplications.length === 0 ? (
                          <p className="text-neutral-600 mt-4">No internships found.</p>
                      ) : (
                          openApplications.map((application) => (
                              <div key={application.id} className="rounded-lg border border-[#FFC7B8] p-4 bg-white">
                                ...
                              </div>
                          ))
                      )}
                    </div>
                  )}
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
              </div>
            </div>
          </div>
        </section>

        {/* Edit Profile Modal */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsEditProfileOpen(false)}
            />
            <div className="relative z-10 w-full max-w-2xl rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_72px_#FFD1C4] max-h-[85vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-neutral-900">
                Edit Profile
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Update your profile details.
              </p>

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
                    pin: formData.residencePin
                      ? Number(formData.residencePin)
                      : undefined,
                    city: formData.residenceCity || undefined,
                    state: formData.residenceState || undefined,
                  };
                  updated.about = formData.about;
                  updated.resume = {
                    ...user?.resume,
                    skills: (formData.skillsCSV || "")
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0),
                    socialLinks: (formData.socialLinksCSV || "")
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0),
                    certifications: (formData.certificationsCSV || "")
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0),
                  };

                  // Send update to backend
                  fetch("http://localhost:7470/user/profile/edit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(updated),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data?.user)
                        setUser((prev) => ({ ...prev, ...data.user }));
                      setIsEditProfileOpen(false);
                    })
                    .catch((err) => {
                      setUploadError(
                        err?.message || "Failed to update profile"
                      );
                    });
                }}
              >
                {/* Basic fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      Username
                    </label>
                    <input
                      value={formData?.username || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      Name
                    </label>
                    <input
                      value={formData?.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      Gender
                    </label>
                    <input
                      value={formData?.gender || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Gender"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData?.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      Field
                    </label>
                    <input
                      value={formData?.field || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, field: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="e.g., Product / Tech"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      Contact
                    </label>
                    <input
                      value={formData?.contact || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      PIN
                    </label>
                    <input
                      value={formData?.residencePin || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          residencePin: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="e.g., 411001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      City
                    </label>
                    <input
                      value={formData?.residenceCity || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          residenceCity: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      State
                    </label>
                    <input
                      value={formData?.residenceState || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          residenceState: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900">
                    About
                  </label>
                  <textarea
                    value={formData?.about || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, about: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    rows={4}
                    placeholder="Tell us about yourself"
                  />
                </div>

                {/* CSV fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      Skills (comma-separated)
                    </label>
                    <input
                      value={formData?.skillsCSV || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, skillsCSV: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="SQL, A/B Testing, Wireframing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900">
                      Certifications (comma-separated)
                    </label>
                    <input
                      value={formData?.certificationsCSV || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certificationsCSV: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Cert 1, Cert 2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-900">
                      Social Links (comma-separated)
                    </label>
                    <input
                      value={formData?.socialLinksCSV || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinksCSV: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="https://linkedin..., https://github..."
                    />
                  </div>
                </div>

                {uploadError && (
                  <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                )}

                <div className="mt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
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

        {/* Upload PDF Modal */}
        {isResumeUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsResumeUploadOpen(false)}
            />
            <div className="relative z-10 w-full max-w-md rounded-xl border border-[#FFC7B8] bg-[#FCFCFC] p-6 shadow-[0_0_72px_#FFD1C4]">
              <h3 className="text-lg font-semibold text-neutral-900">
                Upload Resume (PDF)
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Choose a PDF to upload. Only .pdf files are allowed.
              </p>

              <div className="mt-4">
                <input
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
                  <p className="mt-2 text-sm text-neutral-700">
                    Selected: {selectedFile.name}
                  </p>
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
      </main>
    </>
  );
}
