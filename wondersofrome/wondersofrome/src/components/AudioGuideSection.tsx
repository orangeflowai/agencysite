'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Play, Pause, RotateCcw, Volume2, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Sight, AudioTracks } from '@/lib/sanityService';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English', it: 'Italiano', es: 'Español', fr: 'Français',
  de: 'Deutsch', zh: '中文', ja: '日本語', pt: 'Português',
  pl: 'Polski', ru: 'Русский', ar: 'العربية', ko: '한국어',
};

const TRACK_TYPES = [
  { key: 'audioQuick', label: 'Quick', desc: '~2 min' },
  { key: 'audioDeep', label: 'Deep Dive', desc: '~10 min' },
  { key: 'audioKids', label: 'Kids', desc: 'Myths' },
] as const;

interface AudioGuideSectionProps {
  sights: Sight[];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getAudioForLang(sight: Sight, lang: string): AudioTracks | undefined {
  const map: Record<string, AudioTracks | undefined> = {
    en: sight.audio_en, it: sight.audio_it, es: sight.audio_es,
    fr: sight.audio_fr, de: sight.audio_de, zh: sight.audio_zh,
    ja: sight.audio_ja, pt: sight.audio_pt, pl: sight.audio_pl,
    ru: sight.audio_ru, ar: sight.audio_ar, ko: sight.audio_ko,
  };
  return map[lang];
}

function getAvailableLanguages(sight: Sight): string[] {
  const langs: string[] = [];
  const langCodes = ['en', 'it', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'pl', 'ru', 'ar', 'ko'];
  for (const code of langCodes) {
    const audio = getAudioForLang(sight, code);
    if (audio?.audioQuick?.url || audio?.audioDeep?.url || audio?.audioKids?.url) {
      langs.push(code);
    }
  }
  return langs;
}

function SightCard({ sight }: { sight: Sight }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [activeTrack, setActiveTrack] = useState<'audioQuick' | 'audioDeep' | 'audioKids'>('audioQuick');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const availableLangs = getAvailableLanguages(sight);

  useEffect(() => {
    if (availableLangs.length > 0 && !availableLangs.includes(selectedLang)) {
      setSelectedLang(availableLangs[0]);
    }
  }, [availableLangs, selectedLang]);

  const audioData = getAudioForLang(sight, selectedLang);
  const currentTrack = audioData?.[activeTrack];
  const audioUrl = currentTrack?.url;
  const trackDuration = currentTrack?.duration;

  const availableTracks = TRACK_TYPES.filter(t => audioData?.[t.key]?.url);

  useEffect(() => {
    if (availableTracks.length > 0 && !audioData?.[activeTrack]?.url) {
      setActiveTrack(availableTracks[0].key);
    }
  }, [selectedLang, availableTracks, audioData, activeTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [isPlaying]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    if (!isPlaying) audio.play().catch(() => {});
  }, [isPlaying]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    audio.currentTime = ratio * (duration || trackDuration || 0);
  }, [duration, trackDuration]);

  const thumbUrl = sight.thumbnail?.asset?.url;

  return (
    <div className="min-w-[300px] max-w-[340px] snap-start flex-shrink-0 group bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={sight.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="340px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Headphones className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[7px] font-bold tracking-[0.3em] rounded-full">
            {sight.category?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-serif font-bold text-foreground mb-0.5 leading-tight">{sight.name}</h3>
        {sight.name_it && (
          <p className="text-xs text-muted-foreground italic mb-2">{sight.name_it}</p>
        )}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {sight.description}
        </p>

        {/* Language Selector */}
        {availableLangs.length > 1 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {availableLangs.map(code => (
              <button
                key={code}
                onClick={() => setSelectedLang(code)}
                className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest transition-all ${
                  selectedLang === code
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {LANGUAGE_LABELS[code] || code.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Audio Player */}
        {audioUrl ? (
          <div className="mt-auto pt-3 border-t border-border/50 space-y-2">
            {/* Track type tabs */}
            <div className="flex gap-1">
              {TRACK_TYPES.filter(t => audioData?.[t.key]?.url).map(t => (
                <button
                  key={t.key}
                  onClick={() => { setActiveTrack(t.key); setIsPlaying(false); }}
                  className={`flex-1 px-2 py-1 rounded-md text-[8px] font-bold tracking-widest transition-all ${
                    activeTrack === t.key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div
              className="h-1 bg-muted rounded-full cursor-pointer overflow-hidden"
              onClick={seek}
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-8">
                {formatTime(currentTime)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={restart}
                  className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw size={12} />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-2.5 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-all shadow-md"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-8 text-right">
                {duration > 0 ? formatTime(duration) : trackDuration ? formatTime(trackDuration) : '--:--'}
              </span>
            </div>

            <audio ref={audioRef} src={audioUrl} preload="metadata" />
          </div>
        ) : (
          <div className="mt-auto pt-3 border-t border-border/50">
            <p className="text-[9px] text-muted-foreground italic text-center">
              No audio for this language
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AudioGuideSection({ sights }: AudioGuideSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320;
    const gap = 32;
    const amount = cardWidth + gap;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!sights || sights.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-background border-b border-border overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-bold tracking-[0.4em] text-[8px] mb-4 uppercase">
              Audio Guide Sights
            </p>
            <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none text-foreground">
              Listen &amp; Explore
            </h2>
            <p className="mt-4 text-muted-foreground text-sm font-medium max-w-lg">
              Discover Rome&apos;s monuments with expert narration — quick overviews, deep historical dives, and stories for kids in 12 languages.
            </p>
          </div>

          {/* Scroll Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-8 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 lg:scroll-px-8 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sights.map(sight => (
          <SightCard key={sight._id} sight={sight} />
        ))}
      </div>
    </section>
  );
}
