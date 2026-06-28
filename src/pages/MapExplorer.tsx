import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { dummyReports } from "../data/dummyReports";
import { Report } from "../types";

const API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function ReportMarker({ report }: { report: Report, key?: string | number }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  // Red = Critical, Orange = High, Yellow = Medium/Moderate, Green = Resolved
  let pinColor = "#fbbc04"; // Default Yellow (Medium)
  if (report.status === "Resolved") {
    pinColor = "#34a853"; // Green
  } else if (report.severity === "Critical") {
    pinColor = "#ea4335"; // Red
  } else if (report.severity === "High") {
    pinColor = "#fb8c00"; // Orange
  } else if (report.severity === "Low") {
    pinColor = "#fbbc04"; // Yellow (as per instructions: medium/low yellow)
  } else if (report.severity === "Moderate") {
    pinColor = "#fbbc04";
  }

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: report.lat || 37.7749, lng: report.lng || -122.4194 }}
        onClick={() => setOpen(true)}
      >
        <Pin background={pinColor} glyphColor="#fff" borderColor={pinColor} />
      </AdvancedMarker>

      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="max-w-xs font-sans text-slate-900">
            {report.imageUrl && (
              <img src={report.imageUrl} alt={report.title} className="w-full h-32 object-cover rounded-md mb-3" />
            )}
            <h3 className="font-bold text-base mb-1">{report.title}</h3>
            <p className="text-sm text-slate-600 mb-2">{report.description || report.location}</p>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className={`px-2 py-1 rounded text-white ${report.status === 'Resolved' ? 'bg-green-500' : 'bg-slate-700'}`}>
                {report.status}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {report.upvotes} Votes
              </span>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function MapExplorer() {
  if (!hasValidKey) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-slate-100 p-8 text-center">
        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
        </svg>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Map Preview Unavailable</h2>
        <p className="text-slate-500 max-w-md">
          To view the interactive map, you need to provide a valid Google Maps API Key in the environment variables (<code className="bg-slate-200 px-1 rounded text-sm">VITE_GOOGLE_MAPS_API_KEY</code>).
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full relative">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {dummyReports.map((report) => (
            <ReportMarker key={report.id} report={report} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
