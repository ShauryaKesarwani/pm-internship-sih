"use client";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
    };
  }, []);

  // Custom function to trigger translation
  const translateTo = (lang: string, langName: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
      setSelectedLanguage(langName);
      setIsOpen(false);
    }
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "bn", name: "বাংলা" },
    { code: "te", name: "తెలుగు" },
    { code: "mr", name: "मराठी" },
    { code: "ta", name: "தமிழ்" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "ml", name: "മലയാളം" },
    { code: "pa", name: "ਪੰਜਾਬੀ" },
    { code: "or", name: "ଓଡ଼ିଆ" },
    { code: "as", name: "অসমীয়া" },
  ];

  return (
    <div className="relative">
      {/* Hidden Google widget */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Custom dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded text-black hover:bg-gray-300 transition-colors"
        >
          <i className="fal fa-globe"></i>
          <span className="text-sm">{selectedLanguage}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => translateTo(lang.code, lang.name)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
