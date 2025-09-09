"use client";
import React, { useEffect } from "react";
import Image from "next/image";

export default function Header() {
  useEffect(() => {
    const checkbox = document.getElementById(
      "checkbox"
    ) as HTMLInputElement | null;
    if (!checkbox) return;

    const isDarkModeStored = localStorage.getItem("darkMode") === "true";
    checkbox.checked = isDarkModeStored;
    document.body.classList.toggle("dark", isDarkModeStored);

    const toggleDarkMode = () => {
      const isChecked = checkbox.checked;
      document.body.classList.toggle("dark", isChecked);
      localStorage.setItem("darkMode", String(isChecked));
    };

    checkbox.addEventListener("change", toggleDarkMode);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      checkbox.removeEventListener("change", toggleDarkMode);
    };
  }, []);

  const getAffectedElements = () => {
    return document.querySelectorAll("li, p, h1, h2, h3, h4, h5, h6");
  };

  const storeOriginalFontSizes = () => {
    getAffectedElements().forEach((el) => {
      const element = el as HTMLElement;
      // Use a data attribute to store the original size
      element.dataset.origSize =
        element.style.fontSize || window.getComputedStyle(element).fontSize;
    });
  };

  // Store original sizes once the component has mounted
  useEffect(() => {
    storeOriginalFontSizes();
  }, []);

  const changeFontSize = (direction: number) => {
    getAffectedElements().forEach((el) => {
      const element = el as HTMLElement;
      const currentSize = parseInt(window.getComputedStyle(element).fontSize);
      element.style.fontSize = `${currentSize + direction}px`;
    });
  };

  const resetFontSize = () => {
    getAffectedElements().forEach((el) => {
      const element = el as HTMLElement;
      if (element.dataset.origSize) {
        element.style.fontSize = element.dataset.origSize;
      }
    });
  };

  return (
    <header className="bg-black text-white">
      <div className="header-top px-2 py-1 flex justify-between w-[95%] items-center justify-self-center mx-auto">
        <div className="flex gap-2 justify-start align-items-center">
          <img
            src="https://doc.ux4g.gov.in/assets/img/icon/in-flag.png"
            className="img-fluid"
            alt="indian flag"
            loading="lazy"
          />
          <p>भारत सरकार / Government Of India</p>
        </div>
        <div className="flex gap-4 justify-end align-items-center">
          <span className="language01">
            <form id="langForm" method="POST">
              <i className="fal fa-globe"></i>
              <select name="language" id="changeLang">
                <option value="" disabled>
                  Language
                </option>
                <option value="en">English</option>
              </select>
            </form>
          </span>
          <div>
            <button>Screen Reader</button>
          </div>
          <p>/</p>
          <div className="flex gap-4 justify-end align-items-center">
            <button
              role="button"
              id="btn-increase"
              onClick={() => changeFontSize(1)}
            >
              A+
            </button>
            <button role="button" id="btn-increase" onClick={resetFontSize}>
              A
            </button>
            <button
              role="button"
              id="btn-increase"
              onClick={() => changeFontSize(-1)}
            >
              A-
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
