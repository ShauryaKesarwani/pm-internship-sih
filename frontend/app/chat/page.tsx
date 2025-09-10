"use client";

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
      { id: "1", name: "Acme Corp" },
      { id: "2", name: "Globex" },
      { id: "3", name: "Initech" },
    ];
  };

  const fetchMessages = async (companyId: string): Promise<ChatMessage[]> => {
    // Example: const res = await fetch(`/api/chats/${companyId}`);
    // return res.json();
    return [
      {
        id: "m1",
        companyId,
        senderId: companyId, // received
        body: "Hello, thanks for applying!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: "m2",
        companyId,
        senderId: CURRENT_USER_ID, // sent
        body: "Happy to connect. Here are my details.",
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
    <div className="min-h-screen bg-[#FAEFE9] p-2">
      <div className="flex h-[calc(100vh-3rem)] border border-orange-200 rounded-md overflow-hidden shadow-sm bg-white">
      
      {/* Left: Companies list */}
      <aside className="w-full sm:w-72 md:w-80 border-r border-orange-200 flex flex-col bg-white">
        <div className="p-3 border-b border-orange-200">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies"
            className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingCompanies ? (
            <div className="p-4 text-sm text-gray-500">Loading companies…</div>
          ) : filteredCompanies.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No companies found</div>
          ) : (
            <ul>
              {filteredCompanies.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedCompanyId(c.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-orange-50 ${
                      selectedCompanyId === c.id ? "bg-orange-100" : ""
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      {c.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{c.name}</div>
                      {c.lastMessagePreview ? (
                        <div className="truncate text-xs text-gray-500">
                          {c.lastMessagePreview}
                        </div>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Right: Chat area */}
      <section className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="h-14 border-b border-orange-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="truncate font-medium text-sm">
              {selectedCompany ? selectedCompany.name : "Select a company"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-white">
          {loadingMessages && (
            <div className="text-xs text-gray-500">Loading messages…</div>
          )}
          {!loadingMessages && messages.length === 0 && selectedCompany && (
            <div className="text-xs text-gray-500">No messages yet</div>
          )}

          {messages.map((m) => {
            const isMine = m.senderId === CURRENT_USER_ID;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    isMine
                      ? "bg-orange-500 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  <div>{m.body}</div>
                  <div className={`mt-1 text-[10px] ${isMine ? "text-orange-100" : "text-gray-500"}`}>
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

        {/* Composer */}
        <div className="border-t border-orange-200 p-3 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={selectedCompany ? "Type your message…" : "Select a company to start chatting"}
              value={pendingMessage}
              onChange={(e) => setPendingMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend();
              }}
              disabled={!selectedCompany}
              className="flex-1 rounded-md border border-orange-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:bg-gray-50"
            />
            <button
              onClick={onSend}
              disabled={!selectedCompany || !pendingMessage.trim()}
              className="rounded-md bg-orange-500 text-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600"
            >
              Send
            </button>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}


