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
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Logic for Font Size Change ---
  // NOTE: Direct DOM manipulation like this is an anti-pattern in React.
  // This code is a direct translation of the provided script as requested.
  // A better approach would be to manage font size with state and CSS classes/variables.
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
    <header>
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
      <div className="flex justify-between align-items-center gap-2 py-1">
        <div className="flex justify-start align-items-center gap-2">
          <Image
            src="https://www.ux4g.gov.in/assets/img/logos-page/Emblem_of_India%202.png"
            className="img-fluid"
            alt="indian flag"
            width={24}
            height={16}
            background="white"
          />

          <img
            src="https://doc.ux4g.gov.in/assets/img/icon/in-flag.png"
            className="img-fluid"
            alt="indian flag"
            loading="lazy"
          />
          <img
            src="https://doc.ux4g.gov.in/assets/img/icon/in-flag.png"
            className="img-fluid"
            alt="indian flag"
            loading="lazy"
          />
        </div>
        <div className="flex justify-end align-items-center gap-4">
          <button>Youth Registraiton</button>
          <button>Login</button>
        </div>
      </div>
      {/* <div className="header-top px-2">
        <div className="row">
        <div className="col-xl-6 col-lg-3 d-flex col-sm-6 col-6 align-items-left justify-around">
        <span className="goi">
        <a
        href="https://www.india.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="goi flex gap-2 align-items-center01"
              >
                <img
                  src="https://doc.ux4g.gov.in/assets/img/icon/in-flag.png"
                  className="img-fluid"
                  alt="indian flag"
                  loading="lazy"
                />
                <strong>Government of India</strong>
              </a>
              <div className="col-xl-6 col-lg-9 col-sm-6 col-6 text-end">
                <span className=" d-none d-md-inline">
                  <button
                    role="button"
                    id="btn-decrease"
                    className="font01"
                    onClick={() => changeFontSize(-1)}
                  >
                    -A
                  </button>
                  <button
                    role="button"
                    id="btn-orig"
                    className="font01 active01"
                    onClick={resetFontSize}
                  >
                    A
                  </button>
                  <button
                    role="button"
                    id="btn-increase"
                    className="font01"
                    onClick={() => changeFontSize(1)}
                  >
                    A+
                  </button>
                  <span className="partition">|</span>
                </span>
                <span className="light_dark_icon">
                  <input type="checkbox" className="light_mode" id="checkbox" />
                  <label htmlFor="checkbox" className="checkbox-label">
                    <i className="fas fa-moon"></i>
                    <i className="fas fa-sun"></i>
                    <span className="ball"></span>
                  </label>
                </span>
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
              </div>
            </span>
          </div>
        </div>
      </div> */}
    </header>
  );
}
