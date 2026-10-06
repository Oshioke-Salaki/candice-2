/* ─── Soundtrack ──────────────────────────────────────────────
   One director for the site's sound, living outside React.

   • Alter Ego (Doechii ft. JT) is the score. It starts on the beat
     drop and loops.
   • Scrolling into About crossfades to Candice's intro reel voice.
     When she finishes, or the visitor scrolls on, the score returns
     from where it left off. Each visit to About starts her intro
     where it was left; once finished it starts from the top.
   • Any site video playing with sound fades the soundtrack out; it
     fades back when the video stops. Silent previews don't count.
   • Hidden tab or locked phone: paused. Back: resumes.

   Browser rules this works within:
   • No browser lets a page start sound before the visitor has
     interacted, so the soundtrack starts on the first tap, click or
     key press anywhere (unless they've switched it off before).
   • iOS ignores `audio.volume`, so fades run through Web Audio gain
     nodes. If Web Audio is unavailable, tracks switch without fades.
   • iOS mutes Web Audio on the silent switch unless the audio
     session is declared as playback (Safari 17+).
   • Every play() promise is caught: a refusal just waits for the
     next gesture instead of throwing. */

export type TrackId = "score" | "voice";

export const TRACKS: Record<TrackId, { src: string; title: string; artist: string; level: number; loop: boolean }> = {
  score: { src: "/audio/alter-ego.mp3", title: "Alter Ego", artist: "Doechii ft. JT", level: 0.8, loop: true },
  voice: { src: "/audio/intro-reel.mp3", title: "Intro", artist: "Candice", level: 1, loop: false },
};

const FADE = 1.2; // seconds
const STORAGE_KEY = "wc-sound";

export type SoundState = {
  /** The visitor wants sound (persisted). */
  enabled: boolean;
  /** Audio has been unlocked by a gesture and is running. */
  started: boolean;
  /** Unlocked, waiting for the first audio to buffer. */
  starting: boolean;
  /** Track currently audible, if any. */
  playing: TrackId | null;
  /** Fading out because a site video is playing with sound. */
  yielding: boolean;
  /** Both files failed to load: hide the control. */
  unavailable: boolean;
};

type Listener = () => void;

class Soundtrack {
  private state: SoundState = { enabled: true, started: false, starting: false, playing: null, yielding: false, unavailable: false };
  private listeners = new Set<Listener>();
  private initialised = false;

  private els: Partial<Record<TrackId, HTMLAudioElement>> = {};
  private failed: Partial<Record<TrackId, boolean>> = {};
  private ctx: AudioContext | null = null;
  private gains: Partial<Record<TrackId, GainNode>> = {};
  private pauseTimers: Partial<Record<TrackId, number>> = {};

  private inAbout = false;
  private voiceDone = false;
  private videoAudible = false;
  private hidden = false;

  /* ── public API ─────────────────────────────────────────── */

  subscribe = (fn: Listener) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getSnapshot = () => this.state;

  /** Wire up listeners. Safe to call repeatedly. Plays nothing. */
  init() {
    if (this.initialised || typeof window === "undefined") return;
    this.initialised = true;

    let enabled = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "off") enabled = false;
      else if (saved === null) {
        // Visitors on data saver don't get a surprise download.
        const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        if (conn?.saveData) enabled = false;
      }
    } catch {
      /* storage blocked: keep the default */
    }
    this.set({ enabled });

    const unlockEvents = ["pointerup", "touchend", "keydown", "click"] as const;
    const onGesture = (e: Event) => {
      if (this.state.started || this.state.starting || !this.state.enabled) return;
      if (e instanceof KeyboardEvent && (e.key === "Escape" || e.repeat)) return;
      // The sound button handles its own clicks.
      if ((e.target as Element | null)?.closest?.("[data-sound-toggle]")) return;
      this.start();
    };
    unlockEvents.forEach((t) => window.addEventListener(t, onGesture, { capture: true, passive: true }));

    // Media events don't bubble, but they do pass the capture phase.
    const onMedia = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) this.checkVideos();
    };
    ["play", "playing", "pause", "ended", "volumechange", "emptied"].forEach((t) =>
      document.addEventListener(t, onMedia, true),
    );
    // A video removed while playing (closing the shoot viewer) sends
    // no pause event, so also re-check whenever a video leaves the page.
    new MutationObserver((records) => {
      const lostVideo = records.some((r) =>
        Array.from(r.removedNodes).some(
          (n) => n instanceof HTMLVideoElement || (n instanceof Element && n.querySelector("video")),
        ),
      );
      if (lostVideo) this.checkVideos();
    }).observe(document.body, { childList: true, subtree: true });

    document.addEventListener("visibilitychange", () => {
      this.hidden = document.hidden;
      if (!this.hidden) this.resumeContext();
      this.reconcile();
    });
    window.addEventListener("pageshow", () => {
      this.resumeContext();
      this.reconcile();
    });

    this.watchAbout();
  }

  /** The sound button. Runs inside a click, so it may unlock audio. */
  toggle() {
    const { enabled: on, started, starting } = this.state;
    // Sound is wanted but hasn't begun: the button means "start".
    if (on && !started) {
      if (!starting) this.start();
      return;
    }
    const enabled = !on;
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    } catch {
      /* ignore */
    }
    this.set({ enabled });
    if (enabled && !this.state.started) this.start();
    else this.reconcile();
  }

  /* ── internals ──────────────────────────────────────────── */

  private set(patch: Partial<SoundState>) {
    const next = { ...this.state, ...patch };
    const changed = (Object.keys(next) as (keyof SoundState)[]).some((k) => next[k] !== this.state[k]);
    if (!changed) return;
    this.state = next;
    this.listeners.forEach((fn) => fn());
  }

  /** Which track should be heard right now, ignoring pauses. */
  private wanted(): TrackId | null {
    const voiceOk = !this.failed.voice;
    const scoreOk = !this.failed.score;
    if (this.inAbout && !this.voiceDone && voiceOk) return "voice";
    if (scoreOk) return "score";
    return null;
  }

  private element(id: TrackId) {
    let el = this.els[id];
    if (el) return el;
    el = new Audio();
    el.src = TRACKS[id].src;
    el.loop = TRACKS[id].loop;
    el.preload = "auto";
    el.setAttribute("playsinline", "");
    el.addEventListener("error", () => {
      this.failed[id] = true;
      if (this.failed.score && this.failed.voice) this.set({ unavailable: true, playing: null });
      this.reconcile();
    });
    if (id === "voice") {
      el.addEventListener("ended", () => {
        this.voiceDone = true;
        el!.currentTime = 0;
        this.reconcile();
      });
    }
    this.els[id] = el;
    return el;
  }

  /** Must run synchronously inside a user gesture. */
  private start() {
    if (this.state.unavailable || this.state.starting) return;
    this.set({ starting: true });
    const score = this.element("score");
    const voice = this.element("voice");

    // Web Audio graph: element → gain → speakers. Built once.
    if (!this.ctx) {
      try {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctx) {
          const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
          if (session) session.type = "playback";
          const ctx = new Ctx();
          (["score", "voice"] as TrackId[]).forEach((id) => {
            const gain = ctx.createGain();
            gain.gain.value = 0;
            ctx.createMediaElementSource(this.els[id]!).connect(gain).connect(ctx.destination);
            this.gains[id] = gain;
          });
          this.ctx = ctx;
        }
      } catch {
        // Fall back to plain elements (no fades).
        this.ctx = null;
        this.gains = {};
      }
    }
    this.resumeContext();

    // Start both inside the gesture so iOS lets us play them later;
    // they sit at zero gain until reconcile() decides.
    const want = this.wanted();
    let pending = 0;
    let ok = false;
    for (const [id, el] of [["score", score], ["voice", voice]] as const) {
      if (this.failed[id]) continue;
      if (!this.ctx) el.volume = 0;
      pending++;
      el.play()
        .then(() => {
          ok = true;
          if (id !== want) el.pause();
        })
        .catch(() => {
          /* refused or interrupted: handled below */
        })
        .finally(() => {
          if (--pending > 0) return;
          if (ok) {
            this.set({ started: true, starting: false });
            // A beat's grace: if this tap also started a video with
            // sound, its play event lands first and we stay quiet.
            window.setTimeout(() => this.reconcile(), 150);
          } else {
            this.set({ started: false, starting: false });
          }
        });
    }
  }

  private resumeContext() {
    if (this.ctx && this.ctx.state !== "running") {
      this.ctx.resume().catch(() => {
        // Needs a fresh gesture (e.g. iOS after an interruption).
        this.set({ started: false });
      });
    }
  }

  private checkVideos() {
    const audible = Array.from(document.querySelectorAll("video")).some(
      (v) => v.isConnected && !v.paused && !v.ended && !v.muted && v.volume > 0,
    );
    if (audible !== this.videoAudible) {
      this.videoAudible = audible;
      this.reconcile();
    }
  }

  private watchAbout() {
    const attach = () => {
      const about = document.getElementById("about");
      if (!about) return false;
      // "In About" = the section crosses the middle band of the screen.
      const io = new IntersectionObserver(
        ([entry]) => {
          const now = entry.isIntersecting;
          if (now === this.inAbout) return;
          this.inAbout = now;
          // Leaving About re-arms her intro for the next visit.
          if (!now) this.voiceDone = false;
          this.reconcile();
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      io.observe(about);
      return true;
    };
    if (!attach()) window.addEventListener("load", attach, { once: true });
  }

  /** Bring every track to where it should be. */
  private reconcile() {
    const { enabled, started } = this.state;
    const yielding = this.videoAudible;
    const target = enabled && started && !yielding && !this.hidden ? this.wanted() : null;

    (["score", "voice"] as TrackId[]).forEach((id) => {
      const el = this.els[id];
      if (!el) return;
      if (id === target) this.fadeIn(id, el);
      else this.fadeOut(id, el);
    });

    this.set({ playing: target, yielding: enabled && started && yielding });
    this.updateMediaSession(target);
  }

  private fadeIn(id: TrackId, el: HTMLAudioElement) {
    window.clearTimeout(this.pauseTimers[id]);
    if (el.paused) el.play().catch(() => this.set({ started: false }));
    this.ramp(id, el, TRACKS[id].level);
  }

  private fadeOut(id: TrackId, el: HTMLAudioElement) {
    if (el.paused) return;
    if (!this.ctx) {
      // No fades available (iOS ignores volume): stop at once.
      el.pause();
      return;
    }
    this.ramp(id, el, 0);
    window.clearTimeout(this.pauseTimers[id]);
    // Pause once silent, keeping the position for next time.
    this.pauseTimers[id] = window.setTimeout(() => el.pause(), FADE * 1000 + 60);
  }

  private ramp(id: TrackId, el: HTMLAudioElement, to: number) {
    const gain = this.gains[id];
    if (this.ctx && gain) {
      const now = this.ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(to, now + FADE);
    } else {
      el.volume = to; // no fade without Web Audio
    }
  }

  private updateMediaSession(id: TrackId | null) {
    if (!("mediaSession" in navigator)) return;
    try {
      if (id && "MediaMetadata" in window) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: TRACKS[id].title,
          artist: TRACKS[id].artist,
          album: "WowCandice",
        });
      }
      navigator.mediaSession.playbackState = id ? "playing" : "paused";
      navigator.mediaSession.setActionHandler("pause", () => this.state.enabled && this.toggle());
      navigator.mediaSession.setActionHandler("play", () => !this.state.enabled && this.toggle());
    } catch {
      /* unsupported action: ignore */
    }
  }
}

export const soundtrack = new Soundtrack();
