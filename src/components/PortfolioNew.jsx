import React, { lazy, Suspense, useRef, useEffect, useState, useCallback } from "react";
import "./PortfolioNew.css";
import axios from "axios";
import { FiChevronDown, FiChevronUp, FiMaximize2 } from "react-icons/fi";
import "lightbox.js-react/dist/index.css";
import { getOptimalUrl, isResponsiveVariant } from "../utils/imageUtils";

const SlideshowLightbox = lazy(() =>
  import("lightbox.js-react").then((m) => ({ default: m.SlideshowLightbox }))
);

const CACHE_KEY = "arapro_portfolio_v2";
const API_URL = process.env.REACT_APP_PORTFOLIO_API_URL || "https://www.arapro.cz/index.php";
const PHOTO_BASE = process.env.REACT_APP_PUBLIC_BASE || "https://www.arapro.cz";

// Defined outside component – no component state deps
const isElementInViewport = (el, offset = 200) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset
  );
};

function getCachedPortfolio() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw); // { data, modified }
  } catch {
    return null;
  }
}

function setCachedPortfolio(data, modified) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, modified }));
  } catch {}
}

const PortfolioNew = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const tilesRef = useRef(null);
  const [projectVisibleAll, setProjectVisibleAll] = useState(false);

  async function getData(option, signal) {
    setError(false);
    const cached = getCachedPortfolio();

    // Zobraz cache okamžitě
    if (cached) {
      setData(option === "cut" ? cached.data.slice(0, 12) : cached.data);
    }

    // Ověř v pozadí, zda se data změnila
    try {
      const {
        data: { modified },
      } = await axios.get(`${API_URL}?modified`, { signal });

      if (cached && cached.modified === modified) {
        return; // Data jsou aktuální, cache platí
      }

      // Data se změnila (nebo cache neexistuje) → stáhni znovu
      const res = await axios.get(API_URL, { signal });
      const serverData = res.data.map((project) => ({
        ...project,
        photos: project.photos.map((p) => ({
          ...p,
          name: p.name.replace(/\.(jpg|jpeg|png|gif)$/i, ".webp"),
          path: `${PHOTO_BASE}/${p.path.replace(/\.(jpg|jpeg|png|gif)$/i, ".webp")}`,
        })),
      }));
      setCachedPortfolio(serverData, modified);
      setData(option === "cut" ? serverData.slice(0, 12) : serverData);
    } catch (err) {
      if (axios.isCancel(err)) return; // Zrušeno – ignoruj
      if (!cached) setError(true);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const controller = new AbortController();
    getData("cut", controller.signal);
    return () => controller.abort();
  }, []);

  const handleVisibility = useCallback(() => {
    if (!tilesRef.current) return;
    tilesRef.current.querySelectorAll(".grid-item").forEach((tile) => {
      if (isElementInViewport(tile) && !tile.classList.contains("animate")) {
        tile.classList.add("animate");
      }
    });
  }, []);

  useEffect(() => {
    handleVisibility();
    window.addEventListener("scroll", handleVisibility);
    return () => window.removeEventListener("scroll", handleVisibility);
  }, [handleVisibility, data]);

  useEffect(() => {
    const controller = new AbortController();
    getData(projectVisibleAll ? "all" : "cut", controller.signal);
    return () => controller.abort();
  }, [projectVisibleAll]); // eslint-disable-line react-hooks/exhaustive-deps

  const [chosenProject, setChosenProject] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleGallery = (ind) => {
    const project = data[ind];
    // Target pixel width: screen width × device pixel ratio (for hi-DPI)
    const targetPx = window.screen.width * (window.devicePixelRatio || 1);
    const images = project.photos
      .filter((p) => !isResponsiveVariant(p.name) && !p.name.startsWith("thumb."))
      .map((p) => ({
        src: getOptimalUrl(p.path, project.photos, targetPx),
      }));
    setChosenProject(images);
    setIsOpen(true);
  };

  // Back button closes lightbox instead of navigating away
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ lightbox: true }, "");
      const handlePop = () => setIsOpen(false);
      window.addEventListener("popstate", handlePop);
      return () => window.removeEventListener("popstate", handlePop);
    }
  }, [isOpen]);

  const actionLabel = (akce) => {
    if (akce === "studie") return "architektonická studie";
    if (akce === "dokumentace") return "projektová dokumentace";
    return akce;
  };

  return (
    <section className="portfolio-section">
      {/* ── Header ── */}
      <div className="portfolio-header">
        <div>
          <h2 id="reference" className="heading portfolio-heading">
            Reference
          </h2>
          <hr className="cara portfolio-cara" />
          <p className="portfolio-sub">
            Výběr realizovaných projektů — kliknutím otevřete fotogalerii.
          </p>
        </div>
      </div>

      {error && (
        <p className="portfolio-error">
          Projekty se nepodařilo načíst. Zkuste stránku obnovit.
        </p>
      )}

      {/* ── Grid ── */}
      <div className="portfolio-grid" ref={tilesRef}>
        {data.map((x, index) => (
          <div
            className="grid-item"
            key={x.id}
            onClick={() => handleGallery(index)}
            style={{ animationDelay: `${(index % 4) * 0.08}s` }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleGallery(index)}
            aria-label={`${x.name}, ${x.location} – otevřít galerii`}
          >
            {(() => {
              // Thumbnail = první galeriová fotka (ne varianta).
              const thumb = x.photos.find((p) => !isResponsiveVariant(p.name) && !p.name.startsWith("thumb."));
              // V gridu vždy použij _400w variantu – nikdy nestahuj full-size nebo _1200w.
              const thumb400 = thumb
                ? x.photos.find((p) => p.path === thumb.path.replace(/\.webp$/, "_400w.webp")) || thumb
                : null;
              return (
                <img
                  src={thumb400?.path}
                  alt={`${x.name} – ${x.location}`}
                  loading="lazy"
                />
              );
            })()}

            {/* Always-visible bottom label */}
            <div className="tile-label">
              <p className="tile-name">{x.name}</p>
              <p className="tile-location">{x.location}</p>
              <p className="tile-actions">
                {x.actions.map(actionLabel).join(" · ")}
              </p>
            </div>

            {/* Hover overlay – just the expand icon */}
            <div className="tile-hover">
              <FiMaximize2 className="tile-expand-icon" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Show more ── */}
      <div className="portfolio-more">
        <button
          className="portfolio-more-btn"
          onClick={() => setProjectVisibleAll(!projectVisibleAll)}
        >
          {projectVisibleAll ? (
            <>
              <FiChevronUp /> Zobrazit méně
            </>
          ) : (
            <>
              <FiChevronDown /> Zobrazit všechny projekty
            </>
          )}
        </button>
      </div>

      <Suspense fallback={null}>
        <SlideshowLightbox
          theme="day"
          disableImageZoom={true}
          downloadImages={false}
          fullScreen={true}
          showSlideshowIcon={false}
          images={chosenProject}
          showThumbnails={true}
          open={isOpen}
          lightboxIdentifier="lbox1"
          onClose={() => setIsOpen(false)}
        />
      </Suspense>
    </section>
  );
};

export default PortfolioNew;
