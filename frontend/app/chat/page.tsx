"use client";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Menu from "../components/menu";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Company = {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessagePreview?: string;
};

type ChatMessage = {
  id: string;
  companyId: string;
  senderId: string;
  body: string;
  createdAt: string; // ISO
};

// NOTE: Replace with real authenticated user id from your auth state
const CURRENT_USER_ID = "me";

export default function ChatPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string>("");
  const [loadingCompanies, setLoadingCompanies] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // --- Backend integration hooks ---
  // Implement these three functions to connect to your backend
  const fetchCompanies = async (): Promise<Company[]> => {
    // Example: const res = await fetch("/api/companies", { credentials: "include" });
    // return res.json();
    return [
      { 
        id: "1", 
        name: "TechCorp Solutions", 
        lastMessagePreview: "Thanks for your interest in our internship program!"
      },
      { 
        id: "2", 
        name: "InnovateLab", 
        lastMessagePreview: "We'd love to schedule an interview with you."
      },
      { 
        id: "3", 
        name: "DataFlow Inc", 
        lastMessagePreview: "Your portfolio looks impressive!"
      },
      { 
        id: "4", 
        name: "CloudTech Systems", 
        lastMessagePreview: "When can you start?"
      },
      { 
        id: "5", 
        name: "AI Innovations", 
        lastMessagePreview: "We have a perfect role for you."
      },
    ];
  };

  const fetchMessages = async (companyId: string): Promise<ChatMessage[]> => {
    // Example: const res = await fetch(`/api/chats/${companyId}`);
    // return res.json();
    const company = companies.find(c => c.id === companyId);
    const companyName = company?.name || "Company";
    
    return [
      {
        id: "m1",
        companyId,
        senderId: companyId, // received
        body: `Hello! Thank you for your interest in our internship program at ${companyName}. We're excited to learn more about you!`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "m2",
        companyId,
        senderId: CURRENT_USER_ID, // sent
        body: "Hi! Thank you for reaching out. I'm very interested in the software development internship position. I have experience with React, Node.js, and Python.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: "m3",
        companyId,
        senderId: companyId, // received
        body: "That's great to hear! We're looking for someone with exactly those skills. Could you share your portfolio or GitHub profile so we can review your work?",
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: "m4",
        companyId,
        senderId: CURRENT_USER_ID, // sent
        body: "Absolutely! Here's my GitHub: github.com/username and my portfolio: myportfolio.com. I've worked on several projects including a full-stack e-commerce application and a machine learning model for data analysis.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ];
  };

  const sendMessageAPI = async (
    companyId: string,
    body: string
  ): Promise<ChatMessage> => {
    // Example POST. Return the saved message from backend
    // const res = await fetch(`/api/chats/${companyId}`, { method: "POST", body: JSON.stringify({ body }) });
    // return res.json();
    return {
      id: Math.random().toString(36).slice(2),
      companyId,
      senderId: CURRENT_USER_ID,
      body,
      createdAt: new Date().toISOString(),
    };
  };

  useEffect(() => {
    const load = async () => {
      setLoadingCompanies(true);
      try {
        const list = await fetchCompanies();
        setCompanies(list);
        if (list.length > 0) setSelectedCompanyId(list[0].id);
      } finally {
        setLoadingCompanies(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedCompanyId) return;
      setLoadingMessages(true);
      try {
        const list = await fetchMessages(selectedCompanyId);
        setMessages(list);
      } finally {
        setLoadingMessages(false);
      }
    };
    loadMessages();
  }, [selectedCompanyId]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  const onSend = async () => {
    if (!selectedCompanyId || !pendingMessage.trim()) return;
    const text = pendingMessage.trim();
    setPendingMessage("");
    // Optimistic update
    const optimistic: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      companyId: selectedCompanyId,
      senderId: CURRENT_USER_ID,
      body: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const saved = await sendMessageAPI(selectedCompanyId, text);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? saved : m))
      );
    } catch (e) {
      // Revert optimistic on error
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setPendingMessage(text);
      // Optionally show an error toast
    }
  };

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId) || null,
    [companies, selectedCompanyId]
  );

  const filteredCompanies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, search]);

  return (
    <div className="min-h-screen bg-[#FAEFE9]">
      <Navbar />
      <HeaderWhite />
      <Menu />
      
      {/* Main Chat Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-[calc(100vh-12rem)]">
            {/* Left: Companies list */}
            <aside className="w-full sm:w-80 md:w-96 border-r border-gray-200 flex flex-col bg-gray-50">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Companies List */}
              <div className="flex-1 overflow-y-auto">
                {loadingCompanies ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      <span className="text-sm">Loading companies...</span>
                    </div>
                  </div>
                ) : filteredCompanies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <svg className="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                    </svg>
                    <span className="text-sm">No companies found</span>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredCompanies.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCompanyId(c.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors ${
                          selectedCompanyId === c.id 
                            ? "bg-orange-100 border-l-4 border-orange-500" 
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                          {c.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-gray-900">
                            {c.name}
                          </div>
                          {c.lastMessagePreview ? (
                            <div className="truncate text-xs text-gray-500 mt-1">
                              {c.lastMessagePreview}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 mt-1">
                              No messages yet
                            </div>
                          )}
                        </div>
                        {selectedCompanyId === c.id && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
        </aside>

            {/* Right: Chat area */}
            <section className="flex-1 flex flex-col bg-white">
              {/* Chat Header */}
              <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                    {selectedCompany ? selectedCompany.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() : "?"}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-gray-900">
                      {selectedCompany ? selectedCompany.name : "Select a company"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedCompany ? "Online" : "Choose a company to start chatting"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={scrollerRef}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50"
              >
                {loadingMessages && (
                  <div className="flex items-center justify-center h-32">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      <span className="text-sm">Loading messages...</span>
                    </div>
                  </div>
                )}
                {!loadingMessages && messages.length === 0 && selectedCompany && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <div className="bg-orange-100 rounded-full p-4 mb-4">
                      <svg className="h-12 w-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your conversation</h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm">
                      You can now start chatting with {selectedCompany?.name}. Ask questions about the internship, 
                      share your portfolio, or discuss any requirements.
                    </p>
                  </div>
                )}

                {!selectedCompany && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Chat</h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm">
                      Select a company from the sidebar to start a conversation about internship opportunities.
                    </p>
                  </div>
                )}

                {messages.map((m) => {
                  const isMine = m.senderId === CURRENT_USER_ID;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] ${isMine ? "ml-12" : "mr-12"}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            isMine
                              ? "bg-orange-500 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.body}</div>
                        </div>
                        <div
                          className={`mt-1 text-xs ${
                            isMine ? "text-right text-gray-500" : "text-left text-gray-400"
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={
                        selectedCompany
                          ? "Type your message..."
                          : "Select a company to start chatting"
                      }
                      value={pendingMessage}
                      onChange={(e) => setPendingMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onSend();
                      }}
                      disabled={!selectedCompany}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={onSend}
                    disabled={!selectedCompany || !pendingMessage.trim()}
                    className="rounded-xl bg-orange-500 text-white px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
