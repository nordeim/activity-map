"use client";

// The Leaflet canvas itself (browser-only; loaded via next/dynamic from
// MapExplorer). Basemap: CARTO Voyager tiles (the reference app's carto.com
// basemap). Markers: black dot divIcons that turn violet when active.

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PlaceDTO } from "@/types";

const AUSGBURG_CENTER: L.LatLngExpression = [48.3713, 10.8982];

export function LeafletCanvas({
  places,
  activeSlug,
  onSelect,
}: {
  places: PlaceDTO[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const selectRef = useRef(onSelect);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  const points = useMemo(
    () => places.filter((p) => p.lat != null && p.lng != null),
    [places],
  );
  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: AUSGBURG_CENTER,
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Sync markers with the filtered places.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = markersRef.current;
    const wanted = new Set(points.map((p) => p.slug));

    for (const [slug, marker] of markers) {
      if (!wanted.has(slug)) {
        marker.remove();
        markers.delete(slug);
      }
    }

    for (const p of points) {
      if (markers.has(p.slug)) continue;
      const marker = L.marker([p.lat!, p.lng!], {
        icon: L.divIcon({
          className: "",
          html: '<span class="roam-marker" role="presentation"></span>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
        title: p.name,
        alt: p.name,
      });
      marker.on("click", () => selectRef.current(p.slug));
      marker.addTo(map);
      markers.set(p.slug, marker);
    }

    // Fit the view to the plotted points (once, when there are any).
    if (points.length > 0 && markers.size === points.length && !map.getBounds().contains(L.latLngBounds(points.map((p) => [p.lat!, p.lng!] as L.LatLngTuple)).getCenter())) {
      map.fitBounds(L.latLngBounds(points.map((p) => [p.lat!, p.lng!] as L.LatLngTuple)).pad(0.18), {
        animate: false,
      });
    }
  }, [points]);

  // Reflect the active selection + fly to it.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const [slug, marker] of markersRef.current) {
      const el = marker.getElement()?.querySelector(".roam-marker") as HTMLElement | null;
      if (el) el.dataset.active = String(slug === activeSlug);
    }
    if (activeSlug) {
      const point = points.find((p) => p.slug === activeSlug);
      const marker = markersRef.current.get(activeSlug);
      if (point && marker) {
        map.flyTo([point.lat!, point.lng!], Math.max(map.getZoom(), 15), { duration: 0.6 });
        marker
          .bindPopup(
            `<strong>${escapeHtml(point.name)}</strong><br/>` +
              `<span style="color:#555;font-size:12px">${escapeHtml(point.subCategory ?? "")}` +
              `${point.neighborhood ? " · " + escapeHtml(point.neighborhood) : ""}</span>`,
          )
          .openPopup();
      }
    }
  }, [activeSlug, points]);

  // Leaflet needs a manual invalidateSize when the container box changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => map.invalidateSize());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-label="Augsburg places map" />;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
