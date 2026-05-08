"use client";

import { useEffect, useRef, useState } from "react";
import type { CBTSegment } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface AudioPlayerProps {
  audioUrl?: string;
  segments: ReadonlyArray<CBTSegment>;
  currentSeg: CBTSegment | null;
  onSegmentClick: (seg: CBTSegment) => void;
}

export function AudioPlayer({
  audioUrl,
  segments,
  currentSeg,
  onSegmentClick,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoad = () => setDuration(audio.duration || 3600);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoad);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoad);
    };
  }, [audioUrl]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else void audioRef.current.play();
    setPlaying((p) => !p);
  };

  const seekToMin = (min: number) => {
    const sec = min * 60;
    if (audioRef.current) audioRef.current.currentTime = sec;
    setCurrentTime(sec);
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mb-4 rounded-xl bg-brand-tint p-3.5">
      {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}

      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand text-base text-white"
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div className="flex-1">
          <div
            className="relative h-1.5 cursor-pointer rounded bg-rule"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const frac = (e.clientX - rect.left) / rect.width;
              seekToMin((frac * duration) / 60);
            }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded bg-brand"
              style={{ width: `${pct}%` }}
            />
            {segments.map((seg) => (
              <div
                key={seg.id}
                title={seg.label}
                className="absolute top-[-2px] h-[10px] w-[2px] rounded"
                style={{ background: seg.color, left: `${(seg.start / 60) * 100}%` }}
              />
            ))}
          </div>
        </div>
        <div className="min-w-[96px] flex-shrink-0 text-right text-xs font-semibold text-ink-muted">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="mb-2.5 flex h-[22px] overflow-hidden rounded-lg">
        {segments.map((seg) => {
          const w = ((seg.end - seg.start) / 60) * 100;
          const active = currentSeg?.id === seg.id;
          return (
            <div
              key={seg.id}
              onClick={() => {
                seekToMin(seg.start);
                onSegmentClick(seg);
              }}
              title={`${seg.label} (${seg.start}–${seg.end} min)`}
              className="flex flex-shrink-0 cursor-pointer items-center justify-center border-r border-white/20 transition"
              style={{
                flex: `0 0 ${w}%`,
                background: active ? seg.color : `${seg.color}55`,
              }}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap px-1 text-[8px] font-bold text-white">
                {seg.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {segments.map((seg) => {
          const active = currentSeg?.id === seg.id;
          return (
            <div
              key={seg.id}
              onClick={() => {
                seekToMin(seg.start);
                onSegmentClick(seg);
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border bg-white px-2 py-0.5"
              style={{
                borderColor: `${seg.color}44`,
                background: active ? `${seg.color}22` : "#fff",
              }}
            >
              <div
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: seg.color }}
              />
              <span className="text-[10px] font-semibold text-ink">
                {seg.label}
              </span>
              <span className="text-[9px] text-ink-muted">
                {seg.start}–{seg.end}m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
