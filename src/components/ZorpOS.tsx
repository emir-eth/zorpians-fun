"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { IncomingTransmission } from "./IncomingTransmission";
import { IdentityTerminal } from "./IdentityTerminal";
import { AbductionScene } from "./AbductionScene";
import { HumanScanScene } from "./HumanScanScene";
import { CrewMontage } from "./CrewMontage";
import { SubjectClassificationScene } from "./SubjectClassificationScene";
import { CompanyAssignmentScene } from "./CompanyAssignmentScene";
import { AbductionRecord } from "./AbductionRecord";
import { PlanetZorpArrival } from "./PlanetZorpArrival";
import { CrewArchive } from "./CrewArchive";
import { InspectMode } from "./InspectMode";
import { Disclaimer } from "./Disclaimer";
import { generateHumanProfile } from "@/lib/profile";
import { loadHandle } from "@/lib/identity";
import { ZORPIANS } from "@/lib/zorpians";
import {
  preloadSceneAssets,
  EARLY_SCENE_ASSETS,
  SCAN_SCENE_ASSETS,
  COMPANY_SCENE_ASSETS,
  RECORD_SCENE_ASSETS,
  ARRIVAL_SCENE_ASSETS,
} from "@/lib/scene-assets";

type AppPhase =
  | "transmission"
  | "identity"
  | "abduction"
  | "humanScan"
  | "classification"
  | "company"
  | "crewMontage"
  | "record"
  | "arrival"
  | "crewArchive"
  | "inspect";

export function ZorpOS() {
  const [phase, setPhase] = useState<AppPhase>("transmission");
  const [handle, setHandle] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const keyBuffer = useRef("");

  const profile = useMemo(
    () => (handle ? generateHumanProfile(handle) : null),
    [handle],
  );

  const inspectZorpian =
    ZORPIANS[((selectedIndex % 20) + 20) % 20]!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        keyBuffer.current = (keyBuffer.current + e.key.toUpperCase()).slice(-4);
        if (keyBuffer.current === "ZORP") {
          setGlitching(true);
          setTimeout(() => setGlitching(false), 1000);
          keyBuffer.current = "";
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    preloadSceneAssets(EARLY_SCENE_ASSETS).catch(() => {});
  }, []);

  useEffect(() => {
    if (phase === "identity" || phase === "abduction") {
      preloadSceneAssets(SCAN_SCENE_ASSETS).catch(() => {});
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "humanScan" || phase === "classification") {
      preloadSceneAssets(COMPANY_SCENE_ASSETS).catch(() => {});
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "company" || phase === "crewMontage") {
      preloadSceneAssets(RECORD_SCENE_ASSETS).catch(() => {});
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "record") {
      preloadSceneAssets(ARRIVAL_SCENE_ASSETS).catch(() => {});
    }
  }, [phase]);

  const handleTransmissionComplete = useCallback(() => {
    const saved = loadHandle();
    if (saved) {
      setHandle(saved);
      setPhase("abduction");
    } else {
      setPhase("identity");
    }
  }, []);

  const handleIdentityComplete = useCallback((h: string) => {
    setHandle(h);
    setPhase("abduction");
  }, []);

  const advance = useCallback((next: AppPhase) => setPhase(next), []);

  const hideFooter =
    phase === "transmission" ||
    phase === "identity" ||
    phase === "arrival" ||
    phase === "crewArchive" ||
    phase === "inspect";

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-x-hidden ${
        glitching ? "glitch-active" : ""
      }`}
    >
      <div className="scanline-overlay" aria-hidden />

      {glitching && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <p className="font-mono text-sm tracking-[0.3em] text-[var(--zorp-green)] animate-pulse">
            ALIEN OVERRIDE
          </p>
        </div>
      )}

      <main className="flex-1 relative">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "transmission" && (
            <IncomingTransmission
              key="transmission"
              onComplete={handleTransmissionComplete}
            />
          )}
          {phase === "identity" && (
            <IdentityTerminal
              key="identity"
              onComplete={handleIdentityComplete}
            />
          )}
          {phase === "abduction" && (
            <AbductionScene
              key="abduction"
              onComplete={() => advance("humanScan")}
            />
          )}
          {phase === "humanScan" && profile && (
            <HumanScanScene
              key="humanScan"
              profile={profile}
              onComplete={() => advance("classification")}
            />
          )}
          {phase === "classification" && profile && (
            <SubjectClassificationScene
              key="classification"
              profile={profile}
              onComplete={() => advance("company")}
            />
          )}
          {phase === "company" && profile && (
            <CompanyAssignmentScene
              key="company"
              profile={profile}
              onComplete={() => advance("crewMontage")}
            />
          )}
          {phase === "crewMontage" && (
            <CrewMontage
              key="crewMontage"
              onComplete={() => advance("record")}
            />
          )}
          {phase === "record" && profile && (
            <AbductionRecord
              key="record"
              profile={profile}
              onContinue={() => advance("arrival")}
            />
          )}
          {phase === "arrival" && (
            <PlanetZorpArrival
              key="arrival"
              onOpenArchive={() => advance("crewArchive")}
            />
          )}
          {(phase === "crewArchive" || phase === "inspect") && (
            <CrewArchive
              key="crewArchive"
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onInspect={() => advance("inspect")}
              onBack={() => advance("arrival")}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "inspect" && (
            <InspectMode
              key="inspect"
              zorpian={inspectZorpian}
              onSync={() => advance("crewArchive")}
              onClose={() => advance("crewArchive")}
            />
          )}
        </AnimatePresence>
      </main>

      {!hideFooter && (
        <footer className="py-4 px-4 border-t border-[var(--zorp-green-dim)]/30">
          <Disclaimer compact />
          <div className="flex justify-center gap-4 mt-3">
            <a
              href="https://x.com/zorpians"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] text-[var(--zorp-green-dim)] hover:text-[var(--zorp-green)]"
            >
              @zorpians
            </a>
            <a
              href="https://x.com/emir_ethh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[9px] text-[var(--zorp-green-dim)] hover:text-[var(--zorp-green)]"
            >
              @emir_ethh
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}
