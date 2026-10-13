const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

const playButton = document.getElementById("playButton");
const statusText = document.getElementById("statusText");
const selectedTrackText = document.getElementById("selectedTrack");
const filterSlider = document.getElementById("filterSlider");
const filterValue = document.getElementById("filterValue");
const reverbSlider = document.getElementById("reverbSlider");
const reverbValue = document.getElementById("reverbValue");
const loopStatus = document.getElementById("loopStatus");
const jogWheel = document.getElementById("jogWheel");
const jogValue = document.getElementById("jogValue");

const tracks = ["drums", "bass", "chords", "lead"];
const trackLabels = {
  drums: "Drums",
  bass: "Bass",
  chords: "Chords",
  lead: "Lead",
};

const colors = {
  stage: "#020203",
  deep: "#09090b",
  ink: "#070707",
  charcoal: "#1a1a19",
  graphite: "#30302e",
  slate: "#5d5b56",
  ash: "#b8b4aa",
  line: "#d9d6cf",
  paper: "#f7f6f2",
  white: "#f3f0e8",
  orange: "#e06f17",
  aqua: "#7eb8ad",
  violet: "#aa5aa0",
  lime: "#84a33b",
  plasma: "#d8c5ff",
};

const accentBySample = {
  impact: colors.orange,
  riser: colors.aqua,
  vocal: colors.violet,
  laser: colors.lime,
};

const kandinskyMarks = [
  { angle: 0.08, r: 0.52, size: 0.03, color: colors.orange, kind: "circle", phase: 0.2 },
  { angle: 0.16, r: 0.76, size: 0.05, color: colors.aqua, kind: "line", phase: 1.1 },
  { angle: 0.27, r: 0.44, size: 0.037, color: colors.violet, kind: "triangle", phase: 2.4 },
  { angle: 0.34, r: 0.86, size: 0.075, color: colors.charcoal, kind: "line", phase: 3.2 },
  { angle: 0.46, r: 0.61, size: 0.034, color: colors.aqua, kind: "circle", phase: 4.4 },
  { angle: 0.57, r: 0.72, size: 0.044, color: colors.orange, kind: "rect", phase: 0.9 },
  { angle: 0.66, r: 0.39, size: 0.03, color: colors.violet, kind: "circle", phase: 5.1 },
  { angle: 0.74, r: 0.89, size: 0.046, color: colors.orange, kind: "triangle", phase: 2.0 },
  { angle: 0.83, r: 0.55, size: 0.04, color: colors.aqua, kind: "rect", phase: 3.7 },
  { angle: 0.93, r: 0.79, size: 0.045, color: colors.lime, kind: "line", phase: 4.8 },
];

const irregularSegments = [
  { start: 0.002, span: 0.118, inner: 0.18, outer: 0.42, tone: 0.56, lift: 0.04, shake: 0.8 },
  { start: 0.072, span: 0.031, inner: 0.48, outer: 0.82, tone: 0.32, lift: 0.26, shake: 1.4 },
  { start: 0.126, span: 0.058, inner: 0.25, outer: 0.58, tone: 0.42, lift: 0.18, shake: 1.1 },
  { start: 0.171, span: 0.096, inner: 0.2, outer: 0.49, tone: 0.68, lift: 0.08, shake: 0.75 },
  { start: 0.244, span: 0.038, inner: 0.6, outer: 0.95, tone: 0.3, lift: 0.2, shake: 1.5 },
  { start: 0.285, span: 0.172, inner: 0.17, outer: 0.55, tone: 0.48, lift: 0.04, shake: 0.9 },
  { start: 0.392, span: 0.076, inner: 0.42, outer: 0.72, tone: 0.58, lift: 0.22, shake: 1.25 },
  { start: 0.447, span: 0.032, inner: 0.28, outer: 0.88, tone: 0.36, lift: 0.3, shake: 1.6 },
  { start: 0.512, span: 0.128, inner: 0.2, outer: 0.63, tone: 0.44, lift: 0.15, shake: 1.0 },
  { start: 0.586, span: 0.055, inner: 0.54, outer: 0.97, tone: 0.28, lift: 0.24, shake: 1.45 },
  { start: 0.648, span: 0.196, inner: 0.16, outer: 0.47, tone: 0.72, lift: 0.02, shake: 0.7 },
  { start: 0.764, span: 0.043, inner: 0.38, outer: 0.68, tone: 0.5, lift: 0.12, shake: 1.2 },
  { start: 0.826, span: 0.071, inner: 0.3, outer: 0.76, tone: 0.38, lift: 0.18, shake: 1.35 },
  { start: 0.887, span: 0.027, inner: 0.58, outer: 0.9, tone: 0.31, lift: 0.2, shake: 1.65 },
  { start: 0.921, span: 0.082, inner: 0.22, outer: 0.56, tone: 0.54, lift: 0.1, shake: 0.95 },
];

const greyBlocks = [
  { start: 0.025, span: 0.19, inner: 0.45, outer: 0.93, alpha: 0.1, phase: 0.2 },
  { start: 0.102, span: 0.084, inner: 0.33, outer: 0.68, alpha: 0.13, phase: 1.5 },
  { start: 0.19, span: 0.061, inner: 0.57, outer: 0.86, alpha: 0.1, phase: 2.4 },
  { start: 0.302, span: 0.255, inner: 0.43, outer: 0.84, alpha: 0.11, phase: 3.1 },
  { start: 0.414, span: 0.09, inner: 0.24, outer: 0.6, alpha: 0.12, phase: 0.9 },
  { start: 0.49, span: 0.13, inner: 0.3, outer: 0.58, alpha: 0.12, phase: 4.2 },
  { start: 0.566, span: 0.235, inner: 0.5, outer: 0.96, alpha: 0.1, phase: 2.7 },
  { start: 0.704, span: 0.064, inner: 0.22, outer: 0.48, alpha: 0.14, phase: 5.5 },
  { start: 0.817, span: 0.15, inner: 0.35, outer: 0.79, alpha: 0.11, phase: 4.9 },
  { start: 0.924, span: 0.065, inner: 0.56, outer: 0.9, alpha: 0.1, phase: 1.1 },
];

const state = {
  playing: false,
  bpm: 128,
  selectedTrack: "drums",
  volumes: {
    drums: 1,
    bass: 1,
    chords: 0.85,
    lead: 0.9,
  },
  filter: 0,
  reverb: 0.18,
  loopBeats: 0,
  loopStartStep: 0,
  transportStep: 0,
  scheduledStep: 0,
  currentStep: 0,
  nextNoteTime: 0,
  baseRotation: 0,
  jog: 0,
  jogAngle: 0,
  lastKick: 0,
  lastSnare: 0,
  lastHat: 0,
  lastBass: 0,
  samplePulses: [],
  scratchPulses: [],
  energyBursts: [],
  fragments: [],
};

let audio = null;
let schedulerTimer = null;
let animationId = null;
let frequencyData = null;

function resizeCanvas() {
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createNoiseBuffer(context, seconds = 1) {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createImpulse(context) {
  const seconds = 2.2;
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const decay = Math.pow(1 - i / length, 2.8);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  return buffer;
}

function initAudio() {
  if (audio) {
    return;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();

  const trackGains = Object.fromEntries(
    tracks.map((track) => {
      const gain = context.createGain();
      gain.gain.value = state.volumes[track];
      return [track, gain];
    }),
  );

  const mixBus = context.createGain();
  mixBus.gain.value = 0.78;
  const filter = context.createBiquadFilter();
  filter.type = "allpass";
  filter.frequency.value = 12000;
  filter.Q.value = 0.2;

  const dryGain = context.createGain();
  dryGain.gain.value = 0.82;
  const reverbGain = context.createGain();
  reverbGain.gain.value = state.reverb;
  const convolver = context.createConvolver();
  convolver.buffer = createImpulse(context);

  const analyser = context.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.72;

  const master = context.createGain();
  master.gain.value = 0.82;

  Object.values(trackGains).forEach((gain) => gain.connect(mixBus));
  mixBus.connect(filter);
  filter.connect(dryGain);
  filter.connect(convolver);
  dryGain.connect(master);
  convolver.connect(reverbGain);
  reverbGain.connect(master);
  master.connect(analyser);
  analyser.connect(context.destination);

  audio = {
    context,
    trackGains,
    mixBus,
    filter,
    reverbGain,
    analyser,
    noiseBuffer: createNoiseBuffer(context, 1),
  };

  frequencyData = new Uint8Array(analyser.frequencyBinCount);
  updateFilter();
  updateReverb();
}

function now() {
  return audio?.context.currentTime || 0;
}

function gainEnvelope(gain, start, attack, decay, peak, end = 0.0001) {
  gain.gain.cancelScheduledValues(start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0001), start + attack);
  gain.gain.exponentialRampToValueAtTime(Math.max(end, 0.0001), start + attack + decay);
}

function scheduleKick(time) {
  const { context, trackGains } = audio;
  const osc = context.createOscillator();
  const amp = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(145, time);
  osc.frequency.exponentialRampToValueAtTime(42, time + 0.16);
  gainEnvelope(amp, time, 0.006, 0.26, 1.15);
  osc.connect(amp).connect(trackGains.drums);
  osc.start(time);
  osc.stop(time + 0.34);
  state.lastKick = performance.now();
}

function scheduleSnare(time) {
  const { context, trackGains, noiseBuffer } = audio;
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const amp = context.createGain();
  noise.buffer = noiseBuffer;
  filter.type = "bandpass";
  filter.frequency.value = 1650;
  filter.Q.value = 0.7;
  gainEnvelope(amp, time, 0.004, 0.17, 0.34);
  noise.connect(filter).connect(amp).connect(trackGains.drums);
  noise.start(time);
  noise.stop(time + 0.22);
  state.lastSnare = performance.now();
}

function scheduleHat(time, open = false) {
  const { context, trackGains, noiseBuffer } = audio;
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const amp = context.createGain();
  noise.buffer = noiseBuffer;
  filter.type = "highpass";
  filter.frequency.value = open ? 5800 : 7600;
  gainEnvelope(amp, time, 0.002, open ? 0.18 : 0.055, open ? 0.22 : 0.13);
  noise.connect(filter).connect(amp).connect(trackGains.drums);
  noise.start(time);
  noise.stop(time + (open ? 0.24 : 0.08));
  state.lastHat = performance.now();
}

function noteFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function scheduleBass(time, step) {
  const { context, trackGains } = audio;
  const pattern = [45, null, 45, 45, 48, null, 45, null, 43, null, 43, 48, 50, null, 48, null];
  const note = pattern[step % pattern.length];
  if (note === null) {
    return;
  }
  const osc = context.createOscillator();
  const filter = context.createBiquadFilter();
  const amp = context.createGain();
  const pitchBend = 1 + state.jog * 0.09;
  osc.type = "sawtooth";
  osc.frequency.value = noteFrequency(note) * pitchBend;
  filter.type = "lowpass";
  filter.frequency.value = 520;
  filter.Q.value = 5;
  gainEnvelope(amp, time, 0.01, 0.22, 0.42);
  osc.connect(filter).connect(amp).connect(trackGains.bass);
  osc.start(time);
  osc.stop(time + 0.28);
  state.lastBass = performance.now();
}

function scheduleChord(time, step) {
  if (![0, 8].includes(step % 16)) {
    return;
  }
  const { context, trackGains } = audio;
  const chord = step % 16 === 0 ? [57, 60, 64] : [55, 59, 62];
  chord.forEach((midi, index) => {
    const osc = context.createOscillator();
    const amp = context.createGain();
    osc.type = "triangle";
    osc.frequency.value = noteFrequency(midi + 12) * (1 + state.jog * 0.025);
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.exponentialRampToValueAtTime(0.14 / (index + 1), time + 0.08);
    amp.gain.exponentialRampToValueAtTime(0.0001, time + 1.05);
    osc.connect(amp).connect(trackGains.chords);
    osc.start(time);
    osc.stop(time + 1.1);
  });
}

function scheduleLead(time, step) {
  const melody = [69, null, 72, null, 74, 72, null, 67, null, 69, 72, null, 76, null, 74, null];
  const midi = melody[step % melody.length];
  if (midi === null) {
    return;
  }
  const { context, trackGains } = audio;
  const osc = context.createOscillator();
  const amp = context.createGain();
  const filter = context.createBiquadFilter();
  osc.type = "square";
  osc.frequency.value = noteFrequency(midi) * (1 + state.jog * 0.055);
  filter.type = "bandpass";
  filter.frequency.value = 1600 + (step % 4) * 260;
  filter.Q.value = 3.5;
  gainEnvelope(amp, time, 0.012, 0.16, 0.16);
  osc.connect(filter).connect(amp).connect(trackGains.lead);
  osc.start(time);
  osc.stop(time + 0.24);
}

function scheduleStep(step, time) {
  const beatStep = step % 16;
  if ([0, 4, 8, 12].includes(beatStep)) {
    scheduleKick(time);
    triggerBeatVisual("kick", step);
  }
  if ([4, 12].includes(beatStep)) {
    scheduleSnare(time);
    triggerBeatVisual("snare", step);
  }
  if (beatStep % 2 === 0) {
    scheduleHat(time, beatStep === 14);
    triggerBeatVisual("hat", step);
  }
  scheduleBass(time, beatStep);
  scheduleChord(time, beatStep);
  scheduleLead(time, beatStep);
}

function scheduler() {
  if (!audio || !state.playing) {
    return;
  }

  const secondsPerStep = 60 / state.bpm / 4;
  const scheduleAhead = 0.18;
  while (state.nextNoteTime < audio.context.currentTime + scheduleAhead) {
    scheduleStep(state.scheduledStep, state.nextNoteTime);
    state.currentStep = state.scheduledStep;
    state.transportStep += 1;

    if (state.loopBeats > 0) {
      const loopSteps = state.loopBeats * 4;
      const next = state.scheduledStep + 1;
      state.scheduledStep = next >= state.loopStartStep + loopSteps ? state.loopStartStep : next;
    } else {
      state.scheduledStep += 1;
    }

    const jogSpeed = 1 + Math.abs(state.jog) * 0.18;
    state.nextNoteTime += secondsPerStep / jogSpeed;
  }
}

function startTransport() {
  initAudio();
  audio.context.resume();
  state.playing = true;
  state.nextNoteTime = audio.context.currentTime + 0.05;
  playButton.textContent = "暂停";
  playButton.classList.add("playing");
  statusText.textContent = `${state.bpm} BPM · playing`;
  schedulerTimer = window.setInterval(scheduler, 24);
}

function stopTransport() {
  state.playing = false;
  playButton.textContent = "播放";
  playButton.classList.remove("playing");
  statusText.textContent = "paused";
  window.clearInterval(schedulerTimer);
}

function updateVolumes(track) {
  if (!audio) {
    return;
  }
  const gain = audio.trackGains[track];
  gain.gain.setTargetAtTime(state.volumes[track], now(), 0.025);
}

function updateFilter() {
  const value = state.filter;
  const abs = Math.abs(value);
  if (value < -0.03) {
    audio.filter.type = "lowpass";
    audio.filter.frequency.setTargetAtTime(18000 - abs * 17000, now(), 0.03);
    audio.filter.Q.setTargetAtTime(0.6 + abs * 5.5, now(), 0.03);
    filterValue.textContent = `Low ${Math.round(abs * 100)}%`;
  } else if (value > 0.03) {
    audio.filter.type = "highpass";
    audio.filter.frequency.setTargetAtTime(35 + abs * 3900, now(), 0.03);
    audio.filter.Q.setTargetAtTime(0.5 + abs * 4.5, now(), 0.03);
    filterValue.textContent = `High ${Math.round(abs * 100)}%`;
  } else {
    audio.filter.type = "allpass";
    audio.filter.frequency.setTargetAtTime(12000, now(), 0.03);
    audio.filter.Q.setTargetAtTime(0.2, now(), 0.03);
    filterValue.textContent = "Clean";
  }
}

function updateReverb() {
  if (!audio) {
    return;
  }
  audio.reverbGain.gain.setTargetAtTime(state.reverb, now(), 0.04);
  reverbValue.textContent = `${Math.round(state.reverb * 100)}%`;
}

function quantizedTime() {
  if (!audio || !state.playing) {
    return now() + 0.02;
  }
  const secondsPerStep = 60 / state.bpm / 4;
  const current = now();
  const stepsUntilNext = Math.max(0, Math.ceil((current - state.nextNoteTime) / secondsPerStep));
  return state.nextNoteTime + stepsUntilNext * secondsPerStep;
}

function triggerSample(type) {
  initAudio();
  audio.context.resume();
  const time = quantizedTime();
  const visualTime = performance.now();
  const angle = ((state.currentStep % 64) / 64) * Math.PI * 2 - Math.PI / 2;
  const colorMap = {
    impact: accentBySample.impact,
    riser: accentBySample.riser,
    vocal: accentBySample.vocal,
    laser: accentBySample.laser,
  };

  state.samplePulses.push({
    type,
    angle,
    color: colorMap[type],
    start: visualTime,
    duration: type === "riser" ? 2300 : type === "impact" ? 1500 : type === "vocal" ? 1650 : 1450,
  });
  pushEnergyBurst(type, angle, colorMap[type], type === "impact" ? 1.8 : 1.25, type === "riser" ? 1500 : 980);
  spawnFragments(angle, colorMap[type], type === "impact" ? 26 : type === "laser" ? 18 : 16, type === "impact" ? 1.6 : 1.2);

  if (type === "impact") {
    sampleImpact(time);
  } else if (type === "riser") {
    sampleRiser(time);
  } else if (type === "vocal") {
    sampleVocal(time);
  } else {
    sampleLaser(time);
  }
}

function sampleImpact(time) {
  const { context, trackGains, noiseBuffer } = audio;
  const osc = context.createOscillator();
  const noise = context.createBufferSource();
  const amp = context.createGain();
  const filter = context.createBiquadFilter();
  osc.type = "sine";
  osc.frequency.setValueAtTime(90, time);
  osc.frequency.exponentialRampToValueAtTime(28, time + 0.38);
  noise.buffer = noiseBuffer;
  filter.type = "lowpass";
  filter.frequency.value = 900;
  gainEnvelope(amp, time, 0.004, 0.45, 0.7);
  osc.connect(amp);
  noise.connect(filter).connect(amp);
  amp.connect(trackGains.drums);
  osc.start(time);
  noise.start(time);
  osc.stop(time + 0.5);
  noise.stop(time + 0.5);
}

function sampleRiser(time) {
  const { context, trackGains } = audio;
  const osc = context.createOscillator();
  const amp = context.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(240, time);
  osc.frequency.exponentialRampToValueAtTime(1500, time + 0.95);
  amp.gain.setValueAtTime(0.0001, time);
  amp.gain.exponentialRampToValueAtTime(0.24, time + 0.35);
  amp.gain.exponentialRampToValueAtTime(0.0001, time + 1.05);
  osc.connect(amp).connect(trackGains.lead);
  osc.start(time);
  osc.stop(time + 1.08);
}

function sampleVocal(time) {
  const { context, trackGains } = audio;
  [0, 0.09, 0.18].forEach((offset, index) => {
    const osc = context.createOscillator();
    const amp = context.createGain();
    const filter = context.createBiquadFilter();
    osc.type = "square";
    osc.frequency.value = noteFrequency([72, 76, 79][index]);
    filter.type = "bandpass";
    filter.frequency.value = 960 + index * 420;
    filter.Q.value = 8;
    gainEnvelope(amp, time + offset, 0.005, 0.08, 0.13);
    osc.connect(filter).connect(amp).connect(trackGains.lead);
    osc.start(time + offset);
    osc.stop(time + offset + 0.12);
  });
}

function sampleLaser(time) {
  const { context, trackGains } = audio;
  const osc = context.createOscillator();
  const amp = context.createGain();
  const filter = context.createBiquadFilter();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1900, time);
  osc.frequency.exponentialRampToValueAtTime(260, time + 0.22);
  filter.type = "bandpass";
  filter.frequency.value = 1300;
  filter.Q.value = 10;
  gainEnvelope(amp, time, 0.003, 0.18, 0.19);
  osc.connect(filter).connect(amp).connect(trackGains.lead);
  osc.start(time);
  osc.stop(time + 0.28);
}

function setLoop(beats) {
  if (state.loopBeats === beats) {
    state.loopBeats = 0;
    state.loopStartStep = 0;
  } else {
    state.loopBeats = beats;
    const loopSteps = beats * 4;
    state.loopStartStep = Math.floor(state.currentStep / loopSteps) * loopSteps;
    state.scheduledStep = Math.max(state.loopStartStep, state.currentStep);
  }

  loopStatus.textContent = state.loopBeats ? `${state.loopBeats} beat` : "Off";
  document.querySelectorAll(".loop-buttons button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.loop) === state.loopBeats);
  });
}

function ageSince(timestamp, halfLife = 180) {
  if (!timestamp) {
    return 0;
  }
  const delta = performance.now() - timestamp;
  return Math.max(0, 1 - delta / halfLife);
}

function drawArcBand(cx, cy, inner, outer, start, end, fill) {
  ctx.beginPath();
  ctx.arc(cx, cy, outer, start, end);
  ctx.arc(cx, cy, inner, end, start, true);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawRadialLine(cx, cy, angle, r1, r2, stroke, width = 1) {
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
  ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

function withAlpha(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

function solidAccent(hex, alpha = 0.92) {
  return withAlpha(hex, alpha);
}

function polarPoint(cx, cy, angle, radius) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function stepAngle(step = state.currentStep) {
  return ((step % 64) / 64) * Math.PI * 2 - Math.PI / 2;
}

function pushEnergyBurst(type, angle, color, intensity = 1, duration = 760) {
  state.energyBursts.push({
    type,
    angle,
    color,
    intensity,
    duration,
    start: performance.now(),
    spin: (Math.random() - 0.5) * 0.9,
  });
}

function spawnFragments(angle, color, count = 10, intensity = 1) {
  const start = performance.now();
  for (let i = 0; i < count; i += 1) {
    const spread = (Math.random() - 0.5) * (0.9 + intensity * 0.5);
    state.fragments.push({
      angle: angle + spread,
      color,
      start,
      duration: 700 + Math.random() * 680,
      speed: 0.28 + Math.random() * 0.78 + intensity * 0.16,
      radius: 0.2 + Math.random() * 0.3,
      size: 0.008 + Math.random() * 0.026 + intensity * 0.004,
      spin: (Math.random() - 0.5) * 2.6,
      shape: i % 3,
    });
  }
}

function triggerBeatVisual(kind, step) {
  const angle = stepAngle(step);
  if (kind === "kick") {
    pushEnergyBurst("kick", angle, colors.plasma, 1.1, 900);
    spawnFragments(angle, colors.white, 8, 0.7);
    return;
  }

  if (kind === "snare") {
    pushEnergyBurst("snare", angle + 0.22, colors.orange, 0.85, 640);
    spawnFragments(angle + 0.22, colors.orange, 12, 0.9);
    return;
  }

  pushEnergyBurst("hat", angle - 0.08, colors.aqua, 0.48, 380);
  if (step % 4 === 2) {
    spawnFragments(angle - 0.08, colors.aqua, 4, 0.4);
  }
}

function drawTriangle(cx, cy, angle, radius, size, fill, alpha = 1) {
  const center = polarPoint(cx, cy, angle, radius);
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.9, size * 0.75);
  ctx.lineTo(-size * 0.9, size * 0.75);
  ctx.closePath();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = "rgba(243, 240, 232, 0.46)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawOffsetRect(cx, cy, angle, radius, width, height, fill, alpha = 1) {
  const center = polarPoint(cx, cy, angle, radius);
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fill;
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawStageBackdrop(width, height, cx, cy, radius, time, transient) {
  const vignette = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.55);
  vignette.addColorStop(0, "#141216");
  vignette.addColorStop(0.28, "#09090b");
  vignette.addColorStop(0.72, "#030304");
  vignette.addColorStop(1, "#000000");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  const coreGlow = ctx.createRadialGradient(cx, cy, radius * 0.08, cx, cy, radius * (0.52 + transient * 0.08));
  coreGlow.addColorStop(0, "rgba(216, 197, 255, 0.46)");
  coreGlow.addColorStop(0.16, "rgba(243, 240, 232, 0.24)");
  coreGlow.addColorStop(0.34, "rgba(126, 184, 173, 0.11)");
  coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = coreGlow;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.045);
  ctx.translate(-cx, -cy);
  ctx.strokeStyle = "rgba(243, 240, 232, 0.1)";
  ctx.lineWidth = 1;
  for (let r = radius * 0.18; r <= radius * 1.08; r += radius * 0.045) {
    ctx.beginPath();
    ctx.arc(cx, cy, r * (1 + Math.sin(time * 0.8 + r * 0.02) * 0.006), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(243, 240, 232, 0.08)";
  for (let i = 0; i < 30; i += 1) {
    const angle = i * 0.42 + Math.sin(i * 1.3) * 0.12;
    const inner = radius * (0.16 + (i % 4) * 0.02);
    const outer = radius * (0.78 + (i % 7) * 0.052 + transient * 0.08);
    drawRadialLine(cx, cy, angle, inner, outer, "rgba(243, 240, 232, 0.075)", i % 6 === 0 ? 1.7 : 0.7);
  }
  ctx.restore();
}

function drawSpinGhosts(cx, cy, radius, time, transient) {
  const ghostCount = 3;
  for (let i = ghostCount; i > 0; i -= 1) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(state.baseRotation - i * (0.055 + transient * 0.034));
    ctx.scale(1 + i * 0.014 + transient * 0.025, 1 + i * 0.014 + transient * 0.025);
    ctx.translate(-cx, -cy);
    irregularSegments.forEach((segment, index) => {
      if ((index + i) % 2 !== 0) {
        return;
      }
      const drift = Math.sin(time * 0.62 + index * 1.7) * 0.012;
      const start = (segment.start + drift) * Math.PI * 2;
      const end = (segment.start + segment.span + drift * 0.5) * Math.PI * 2;
      const inner = radius * (segment.inner + i * 0.018);
      const outer = radius * (segment.outer + segment.lift * 0.34 + i * 0.028);
      drawArcBand(cx, cy, inner, outer, start, end, `rgba(243, 240, 232, ${0.026 + i * 0.018})`);
    });
    ctx.restore();
  }
}

function motionStrength(transient) {
  return (state.playing ? 1 : 0.22) * (0.78 + transient * 0.34 + Math.abs(state.jog) * 0.18);
}

function floatingCenter(cx, cy, radius, time, index, amount, phase = 0) {
  const motion = state.playing ? 1 : 0.18;
  const slow = time * (0.23 + (index % 5) * 0.014) + phase + index * 0.73;
  const fast = time * (0.67 + (index % 4) * 0.026) + phase * 1.7 + index * 1.31;
  return {
    x: cx + Math.sin(slow) * radius * amount * motion + Math.sin(fast) * radius * amount * 0.34 * motion,
    y: cy + Math.cos(slow * 0.92) * radius * amount * 0.78 * motion + Math.cos(fast * 0.81) * radius * amount * 0.24 * motion,
  };
}

function dynamicDepth(index, time, seed = 0) {
  return Math.sin(time * 0.42 + index * 1.19 + seed) + Math.cos(time * 0.27 + index * 0.53) * 0.6;
}

function drawCompositionOccluders(cx, cy, radius, time, transient, motion) {
  const count = 7;
  for (let i = 0; i < count; i += 1) {
    const center = floatingCenter(cx, cy, radius, time, i, 0.018 + (i % 3) * 0.006, i * 0.91);
    const phase = time * (0.3 + i * 0.025) + i * 1.27;
    const start = i * 0.88 + Math.sin(phase) * 0.22 + state.baseRotation * (0.08 + i * 0.006);
    const span = 0.16 + (i % 4) * 0.08 + Math.sin(phase * 0.7) * 0.035;
    const inner = radius * (0.26 + (i % 5) * 0.09 + Math.sin(phase) * 0.018);
    const outer = inner + radius * (0.1 + (i % 3) * 0.06 + transient * 0.04 + motion * 0.018);
    drawArcBand(center.x, center.y, inner, outer, start, start + span, `rgba(0, 0, 0, ${0.48 + motion * 0.18})`);

    if (i % 2 === 0) {
      drawArcBand(
        center.x,
        center.y,
        outer * 0.96,
        outer * (1.02 + motion * 0.02),
        start + span * 0.18,
        start + span * 0.78,
        `rgba(243, 240, 232, ${0.1 + motion * 0.08})`,
      );
    }
  }
}

function drawForegroundSlices(cx, cy, radius, time, transient, motion) {
  for (let i = 0; i < 8; i += 1) {
    const center = floatingCenter(cx, cy, radius, time, i + 17, 0.024 + (i % 2) * 0.008, i * 0.61);
    const phase = time * (0.34 + i * 0.035) + i * 1.8;
    const angle = i * 0.77 + Math.sin(phase) * 0.18 + state.baseRotation * 0.16;
    const inner = radius * (0.46 + (i % 4) * 0.08 + Math.sin(phase * 0.8) * 0.026);
    const outer = radius * (0.64 + (i % 5) * 0.072 + Math.cos(phase) * 0.03 + transient * 0.08);
    const span = 0.055 + (i % 3) * 0.04 + motion * 0.04;
    const fill =
      i % 5 === 0
        ? solidAccent(colors.orange, 0.66)
        : i % 5 === 2
          ? solidAccent(colors.aqua, 0.62)
          : `rgba(243, 240, 232, ${0.22 + motion * 0.18})`;
    drawArcBand(center.x, center.y, inner, outer, angle - span, angle + span * 1.6, fill);
  }
}

function drawVisualization() {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const cx = width * 0.5;
  const cy = height * 0.52;
  const size = Math.min(width, height) * 0.78;
  const radius = Math.max(130, size * 0.5);
  const time = performance.now() * 0.001;

  if (audio?.analyser && frequencyData) {
    audio.analyser.getByteFrequencyData(frequencyData);
  }

  const kick = ageSince(state.lastKick, 180);
  const snare = ageSince(state.lastSnare, 170);
  const hat = ageSince(state.lastHat, 95);
  const bassPulse = ageSince(state.lastBass, 220);
  const transient = Math.min(1, kick * 0.54 + snare * 0.28 + hat * 0.16 + bassPulse * 0.34);
  const motion = motionStrength(transient);
  const breath =
    1 +
    Math.sin(time * 1.1 + state.transportStep * 0.015) * 0.026 +
    Math.sin(time * 0.47 + 1.8) * 0.014 +
    bassPulse * 0.018;
  const filterAmount = Math.abs(state.filter);
  const rotationSpeed = state.playing ? 0.0032 : 0.0008;
  state.baseRotation += rotationSpeed + state.jog * 0.014;
  state.jog *= 0.92;

  const rotation = state.baseRotation;
  const masterPulse = breath + transient * 0.018;
  const layerMotion = {
    foundation: -time * 0.045 + Math.sin(time * 0.48) * 0.035 - state.jog * 0.08,
    bass: time * 0.072 + state.transportStep * 0.0018 + state.jog * 0.12,
    chord: -time * 0.105 + Math.sin(time * 0.72 + 0.6) * 0.04,
    lead: time * 0.18 + state.jog * 0.18,
    drum: time * 0.126 + transient * 0.11,
    filter: time * 0.09,
    loop: time * 0.035,
    reverb: -time * 0.032,
  };

  ctx.clearRect(0, 0, width, height);
  drawStageBackdrop(width, height, cx, cy, radius, time, transient);
  drawSpinGhosts(cx, cy, radius, time, transient);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.translate(-cx, -cy);

  ctx.strokeStyle = "rgba(243, 240, 232, 0.18)";
  ctx.lineWidth = 1;
  for (let r = radius * 0.22; r <= radius * 0.93; r += radius * 0.085) {
    ctx.beginPath();
    ctx.arc(cx, cy, r * masterPulse * (1 + Math.sin(time * 1.4 + r * 0.015) * 0.008), 0, Math.PI * 2);
    ctx.stroke();
  }

  drawFoundationBlocks(cx, cy, radius, time, breath, transient, layerMotion.foundation, motion);
  drawBassLayer(cx, cy, radius, kick, bassPulse, breath, transient, layerMotion.bass, motion);
  drawCompositionOccluders(cx, cy, radius, time, transient, motion);
  drawChordLayer(cx, cy, radius, time, breath, transient, layerMotion.chord, motion);
  drawLeadLayer(cx, cy, radius, time, breath, transient, layerMotion.lead, motion);
  drawDrumLayer(cx, cy, radius, kick, snare, hat, breath, transient, layerMotion.drum, motion);
  drawForegroundSlices(cx, cy, radius, time, transient, motion);
  drawKandinskyLayer(cx, cy, radius, time, breath, transient);
  drawFilterLayer(cx, cy, radius, filterAmount, layerMotion.filter);
  drawLoopLayer(cx, cy, radius, layerMotion.loop);
  drawSamples(cx, cy, radius);
  drawScratch(cx, cy, radius);
  drawReverb(cx, cy, radius, layerMotion.reverb);
  drawEnergyBursts(cx, cy, radius);
  drawFragments(cx, cy, radius);

  ctx.restore();

  drawCenter(cx, cy, radius, kick);
  drawReadouts(width, height);

  animationId = requestAnimationFrame(drawVisualization);
}

function drawFoundationBlocks(cx, cy, radius, time, breath, transient, rotationOffset, motion) {
  const orderedBlocks = greyBlocks
    .map((block, index) => ({ block, index, depth: dynamicDepth(index, time, block.phase) }))
    .sort((a, b) => a.depth - b.depth);

  orderedBlocks.forEach(({ block, index, depth }) => {
    const center = floatingCenter(cx, cy, radius, time, index, 0.014 + block.alpha * 0.12, block.phase);
    const layerRadius = radius * (1 + Math.sin(time * 0.26 + index * 0.93) * 0.018 * motion + depth * 0.006 * motion);
    const localBreath = breath + Math.sin(time * 0.58 + block.phase) * 0.018;
    const radialStretch =
      1 + Math.sin(time * 1.15 + block.phase + index * 0.4) * (0.038 + motion * 0.026) + transient * (0.04 + (index % 3) * 0.018);
    const shake = transient * (0.008 + (index % 4) * 0.004);
    const drift = Math.sin(time * 0.35 + index * 1.8) * (0.018 + motion * 0.014) + shake + depth * 0.004 * motion;
    const start = (block.start + drift) * Math.PI * 2 + rotationOffset;
    const spanWarp = 1 + Math.sin(time * 0.31 + index * 1.13) * 0.18 * motion + transient * 0.08;
    const end = (block.start + block.span * spanWarp + drift * 0.58 + transient * 0.018) * Math.PI * 2 + rotationOffset;
    const inner = layerRadius * (block.inner * (localBreath - 0.02) - transient * 0.026 - depth * 0.006 * motion);
    const outer = layerRadius * (block.outer * localBreath * radialStretch + Math.sin(time * 0.5 + index) * 0.028 + transient * 0.07 + depth * 0.012 * motion);
    drawArcBand(center.x, center.y, inner, outer, start, end, `rgba(243, 240, 232, ${0.09 + block.alpha * 1.05 + motion * 0.02})`);

    if (index % 2 === 0) {
      const capStart = start + (end - start) * 0.64;
      drawArcBand(center.x, center.y, outer * 0.93, outer * 1.03, capStart, end + 0.045, "rgba(243, 240, 232, 0.18)");
    }
  });
}

function drawBassLayer(cx, cy, radius, kick, bassPulse, breath, transient, rotationOffset, motion) {
  const orderedSegments = irregularSegments
    .map((segment, index) => ({
      segment,
      index,
      depth: dynamicDepth(index, performance.now() * 0.001, segment.start * 8) + segment.lift * 1.4,
    }))
    .sort((a, b) => a.depth - b.depth);

  orderedSegments.forEach(({ segment, index, depth }) => {
    const time = performance.now() * 0.001;
    const center = floatingCenter(cx, cy, radius, time, index + 4, 0.018 + segment.lift * 0.045, segment.start * 9);
    const layerRadius =
      radius * (1 + Math.sin(time * 0.33 + index * 0.71) * 0.024 * motion + Math.sin(time * 0.19 + index) * 0.018 * motion + depth * 0.007 * motion);
    const beatHit = index === state.currentStep % irregularSegments.length ? kick * 0.13 : 0;
    const energy = 0.5 + Math.sin(index * 1.9 + state.transportStep * 0.27) * 0.22;
    const localBreath = breath + Math.sin(index * 0.94 + time * 1.1) * (0.02 + motion * 0.018);
    const radialStretch =
      1 + Math.sin(time * 1.45 + index * 0.82) * (0.045 + motion * 0.04) + bassPulse * 0.055 + transient * segment.shake * 0.035;
    const jitter = transient * segment.shake * 0.012;
    const inner = layerRadius * (segment.inner * (localBreath - 0.035) + bassPulse * 0.006 - jitter - transient * 0.016 - depth * 0.007 * motion);
    const outer =
      layerRadius *
      (segment.outer * localBreath * radialStretch + segment.lift * state.volumes.bass + energy * 0.028 + beatHit + transient * segment.shake * 0.055 + depth * 0.015 * motion);
    const start =
      (segment.start + Math.sin(index * 2.7 + state.transportStep * 0.04) * (0.003 + motion * 0.008) + jitter + depth * 0.006 * motion) * Math.PI * 2 +
      0.01 +
      rotationOffset;
    const spanWarp = 1 + Math.sin(time * 0.38 + index * 1.4) * 0.24 * motion + bassPulse * 0.1;
    const end = (segment.start + segment.span * spanWarp + beatHit * 0.1 + transient * 0.006 * segment.shake) * Math.PI * 2 - 0.012 + rotationOffset;
    const alpha = 0.16 + segment.tone * 0.34 + state.volumes.bass * 0.22;
    const fill = index % 3 === 1 ? `rgba(243, 240, 232, ${alpha * 0.78})` : `rgba(184, 180, 170, ${alpha})`;
    drawArcBand(center.x, center.y, inner, outer, start, end, fill);

    if (index % 2 === 0) {
      const cut = start + (end - start) * 0.55;
      drawArcBand(center.x, center.y, inner * 0.91, inner * 1.1, cut, end + 0.025 + transient * 0.02, "rgba(2, 2, 3, 0.82)");
    }

    if (index % 5 === 1) {
      const spikeAngle = end + 0.035;
      drawRadialLine(center.x, center.y, spikeAngle, outer * 0.84, outer + radius * (0.05 + segment.shake * 0.035), "rgba(243, 240, 232, 0.62)", 2);
    }
  });
}

function drawChordLayer(cx, cy, radius, time, breath, transient, rotationOffset, motion) {
  ctx.lineCap = "butt";
  const volume = state.volumes.chords;
  const alpha = clamp(0.2 + volume * 0.62, 0.15, 0.95);
  const chordColors = [colors.aqua, colors.violet, colors.orange];

  for (let i = 0; i < 9; i += 1) {
    const center = floatingCenter(cx, cy, radius, time, i + 31, 0.016 + volume * 0.014, i * 0.44);
    const layerRadius = radius * (1 + Math.sin(time * 0.24 + i * 0.9) * 0.024 * motion);
    const phase = time * (0.52 + i * 0.025) + i * 0.88;
    const start = i * 0.68 + Math.sin(phase) * (0.12 + motion * 0.06) + rotationOffset;
    const span = 0.42 + (i % 3) * 0.18 + Math.sin(time * 0.7 + i) * (0.1 + motion * 0.09) + transient * 0.18;
    const inner = layerRadius * ((0.31 + (i % 3) * 0.055) * breath + Math.sin(phase * 0.8) * (0.014 + motion * 0.014));
    const outer = inner + layerRadius * (0.035 + volume * 0.066 + transient * 0.04 + motion * 0.012);
    const fill = i % 4 === 0 ? chordColors[i % chordColors.length] : colors.white;
    drawArcBand(center.x, center.y, inner, outer, start, start + span, solidAccent(fill, i % 4 === 0 ? alpha : 0.2 + volume * 0.24));
  }

  for (let i = 0; i < 28; i += 1) {
    const center = floatingCenter(cx, cy, radius, time, i + 43, 0.009 + (i % 4) * 0.002, i * 0.31);
    const uneven = i % 4 === 0 ? 0.07 : i % 5 === 0 ? -0.035 : 0;
    const r =
      radius *
      ((0.27 + i * 0.018 + uneven) * (breath + Math.sin(time * 0.92 + i) * (0.032 + motion * 0.018)) + transient * (0.02 + (i % 3) * 0.01));
    const start = time * (0.2 + motion * 0.06) + i * 0.43 + (i % 3) * 0.21 + transient * 0.1 + rotationOffset;
    const span = 0.22 + Math.sin(time * 0.72 + i) * (0.2 + motion * 0.1) + (i % 5 === 0 ? 0.72 : 0) + (i % 7 === 0 ? 0.38 : 0) + transient * 0.1;
    ctx.beginPath();
    ctx.arc(center.x, center.y, r, start, start + span);
    ctx.strokeStyle = i % 4 === 0 ? solidAccent(colors.aqua, alpha) : `rgba(243, 240, 232, ${0.15 + volume * 0.34})`;
    ctx.lineWidth = i % 4 === 0 ? 3.6 + transient * 2 : 1.2 + volume * 1.2;
    ctx.stroke();
  }
}

function drawLeadLayer(cx, cy, radius, time, breath, transient, rotationOffset, motion) {
  const notes = 30;
  const volume = state.volumes.lead;
  for (let i = 0; i < notes; i += 1) {
    const center = floatingCenter(cx, cy, radius, time, i + 59, 0.01 + volume * 0.01, i * 0.17);
    const angle = i * 1.73 + time * (1.15 + volume * 0.36) + rotationOffset;
    const r =
      radius *
      ((0.34 + (i % 8) * 0.038 + Math.sin(i * 1.2 + time) * (0.034 + motion * 0.02)) * breath + transient * (0.022 + (i % 4) * 0.008));
    const pulse = i % 8 === state.currentStep % 8 ? 1 : 0.42;
    const color = i % 3 === 0 ? colors.violet : i % 3 === 1 ? colors.orange : colors.aqua;
    const p = polarPoint(center.x, center.y, angle, r);
    const tail = 0.11 + pulse * 0.14 + transient * 0.06;

    ctx.beginPath();
    ctx.arc(center.x, center.y, r, angle - tail, angle + tail * 0.34);
    ctx.strokeStyle = solidAccent(color, 0.34 + volume * 0.52 * pulse);
    ctx.lineWidth = 2 + volume * 3.5 + pulse * 2.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius * (0.008 + pulse * 0.012 + volume * 0.008 + transient * 0.004), 0, Math.PI * 2);
    ctx.fillStyle = solidAccent(color, 0.72 + volume * 0.24);
    ctx.fill();

    if (pulse > 0.9) {
      drawRadialLine(center.x, center.y, angle, radius * 0.18, r + radius * 0.16, solidAccent(colors.white, 0.82), 1.8 + volume * 2.2);
      drawTriangle(center.x, center.y, angle + 0.08, r + radius * 0.06, radius * (0.02 + volume * 0.012), solidAccent(color, 0.96), 1);
    }
  }
}

function drawDrumLayer(cx, cy, radius, kick, snare, hat, breath, transient, rotationOffset, motion) {
  const orderedSegments = irregularSegments
    .map((segment, groupIndex) => ({ segment, groupIndex, depth: dynamicDepth(groupIndex, performance.now() * 0.001, segment.span * 12) }))
    .sort((a, b) => a.depth - b.depth);

  orderedSegments.forEach(({ segment, groupIndex, depth }) => {
    const time = performance.now() * 0.001;
    const center = floatingCenter(cx, cy, radius, time, groupIndex + 71, 0.01 + segment.shake * 0.006, segment.span * 6);
    const layerRadius = radius * (1 + depth * 0.006 * motion + Math.sin(time * 0.29 + groupIndex) * 0.016 * motion);
    const tickCount = 4 + ((groupIndex * 9) % 24);
    const start = (segment.start + Math.sin(groupIndex * 1.7 + state.transportStep * 0.025) * (0.004 + motion * 0.006) + depth * 0.004 * motion) * Math.PI * 2 + rotationOffset;
    const span = (segment.span + (groupIndex % 4) * 0.01 + Math.sin(time * 0.37 + groupIndex) * 0.02 * motion) * Math.PI * 2;
    const radialStretch = 1 + Math.sin(time * 1.7 + groupIndex * 0.55) * (0.04 + motion * 0.026) + transient * segment.shake * 0.035;
    const inner = layerRadius * ((0.52 + (groupIndex % 4) * 0.038) * (breath - 0.026) - transient * 0.026);
    const outer = layerRadius * ((0.72 + (groupIndex % 5) * 0.052) * breath * radialStretch + transient * segment.shake * 0.055 + depth * 0.012 * motion);
    for (let i = 0; i < tickCount; i += 1) {
      const offset = Math.sin(i * 1.8 + groupIndex) * 0.006 * Math.PI * 2;
      const angle = start + (i / Math.max(1, tickCount - 1)) * span + offset;
      const strong = i === 0 || i === tickCount - 1;
      const medium = i % 4 === 0;
      const len = radius * (strong ? 0.13 + kick * 0.09 : medium ? 0.07 + snare * 0.055 : 0.032 + hat * 0.05 + transient * 0.012);
      const alpha = state.volumes.drums * (strong ? 0.86 : medium ? 0.56 : 0.34);
      drawRadialLine(center.x, center.y, angle, inner, outer + len, `rgba(243, 240, 232, ${alpha})`, strong ? 2.4 : 1.1);
    }
  });
}

function drawKandinskyLayer(cx, cy, radius, time, breath, transient) {
  kandinskyMarks.forEach((mark, index) => {
    const angle = mark.angle * Math.PI * 2 + time * (index % 2 === 0 ? 0.055 : -0.04) + transient * 0.08;
    const r = radius * (mark.r * breath + Math.sin(time * 0.82 + mark.phase) * 0.018 + transient * 0.025);
    const size = radius * mark.size * (1 + Math.sin(time * 1.1 + mark.phase) * 0.12 + transient * 0.28);
    const alpha = mark.color === colors.charcoal ? 0.46 : 0.78 + (index % 3) * 0.07;

    if (mark.kind === "circle") {
      const p = polarPoint(cx, cy, angle, r);
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = withAlpha(mark.color, alpha);
      ctx.fill();
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = "rgba(243, 240, 232, 0.36)";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.84, 0, Math.PI * 2);
      ctx.strokeStyle = withAlpha(mark.color, 0.72);
      ctx.lineWidth = 1;
      ctx.stroke();
      return;
    }

    if (mark.kind === "triangle") {
      drawTriangle(cx, cy, angle, r, size, withAlpha(mark.color, alpha), 0.92);
      return;
    }

    if (mark.kind === "rect") {
      drawOffsetRect(cx, cy, angle, r, size * 0.38, size * 1.35, withAlpha(mark.color, alpha), 0.9);
      return;
    }

    const p1 = polarPoint(cx, cy, angle, r - size * 1.5);
    const p2 = polarPoint(cx, cy, angle + 0.15, r + size * 1.8);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = withAlpha(mark.color, Math.min(0.95, alpha + 0.12));
    ctx.lineWidth = Math.max(1.6, size * 0.11);
    ctx.stroke();
  });
}

function drawFilterLayer(cx, cy, radius, amount, rotationOffset) {
  if (amount < 0.02) {
    return;
  }
  const angle = state.baseRotation * 1.8 + state.filter * Math.PI + rotationOffset;
  const width = 0.18 + amount * 0.42;
  const color = state.filter < 0 ? "rgba(243, 240, 232, 0.26)" : "rgba(126, 184, 173, 0.42)";
  const stretch = 1 + Math.sin(performance.now() * 0.0012 + amount * 4) * 0.035 + amount * 0.06;
  drawArcBand(cx, cy, radius * 0.16, radius * 0.88 * stretch, angle - width, angle + width, color);

  if (state.filter > 0) {
    for (let i = 0; i < 36; i += 1) {
      const a = angle - width + (i / 35) * width * 2;
      drawRadialLine(cx, cy, a, radius * 0.2, radius * 0.86 * stretch, "rgba(243, 240, 232, 0.24)", 0.8);
    }
  }
}

function drawLoopLayer(cx, cy, radius, rotationOffset) {
  if (!state.loopBeats) {
    return;
  }
  const loopSteps = state.loopBeats * 4;
  const pulse = 1 + Math.sin(performance.now() * 0.004) * 0.025;
  const start = ((state.loopStartStep % 64) / 64) * Math.PI * 2 + rotationOffset;
  const end = start + (loopSteps / 64) * Math.PI * 2;
  drawArcBand(cx, cy, radius * 0.86, radius * 0.99 * pulse, start, end, "rgba(224, 111, 23, 0.64)");
  ctx.strokeStyle = "rgba(243, 240, 232, 0.88)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.99 * pulse, start, end);
  ctx.stroke();
}

function drawSamples(cx, cy, radius) {
  const current = performance.now();
  state.samplePulses = state.samplePulses.filter((pulse) => current - pulse.start < pulse.duration);
  state.samplePulses.forEach((pulse) => {
    const progress = (current - pulse.start) / pulse.duration;
    const alpha = 1 - progress;
    const eased = 1 - Math.pow(1 - progress, 3);
    const r = radius * (0.2 + eased * 0.82);
    const anchor = polarPoint(cx, cy, pulse.angle, radius * (0.64 + eased * 0.18));

    ctx.save();
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, radius * (0.025 + eased * 0.02), 0, Math.PI * 2);
    ctx.fillStyle = solidAccent(pulse.color, 0.72 + alpha * 0.28);
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = withAlpha(colors.white, alpha * 0.72);
    ctx.stroke();
    ctx.restore();

    drawArcBand(
      cx,
      cy,
      radius * (0.93 + eased * 0.03),
      radius * (1.05 + eased * 0.06),
      pulse.angle - 0.09 - progress * 0.08,
      pulse.angle + 0.18 + progress * 0.2,
      solidAccent(pulse.color, 0.4 + alpha * 0.46),
    );
    drawRadialLine(cx, cy, pulse.angle, radius * 0.18, radius * (1.05 + eased * 0.08), solidAccent(pulse.color, 0.76 + alpha * 0.24), 4.6);
    drawRadialLine(cx, cy, pulse.angle + 0.024, radius * 0.24, radius * 0.96, withAlpha(colors.white, 0.56 + alpha * 0.32), 1.8);

    if (pulse.type === "impact") {
      const impactColor = solidAccent(colors.orange, 0.46 + alpha * 0.36);
      drawArcBand(cx, cy, radius * (0.12 + eased * 0.08), radius * (0.46 + eased * 0.68), pulse.angle - 0.46, pulse.angle + 0.5, impactColor);
      drawArcBand(cx, cy, radius * 0.66, radius * (0.86 + eased * 0.24), pulse.angle + 0.34, pulse.angle + 0.72, solidAccent(colors.orange, 0.5 + alpha * 0.3));

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = solidAccent(colors.orange, 0.72 + alpha * 0.28);
      ctx.lineWidth = 3.8 + progress * 8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * (0.48 + eased * 0.36), pulse.angle - 0.8, pulse.angle + 0.12);
      ctx.strokeStyle = solidAccent(colors.orange, 0.78 + alpha * 0.18);
      ctx.lineWidth = 3.4;
      ctx.stroke();

      for (let i = 0; i < 13; i += 1) {
        const a = pulse.angle - 0.92 + i * 0.155;
        drawRadialLine(cx, cy, a, radius * (0.22 + progress * 0.08), radius * (0.86 + progress * 0.24), withAlpha(colors.white, alpha * 0.72), i % 3 === 0 ? 2.6 : 1.2);
      }

      drawOffsetRect(cx, cy, pulse.angle + 0.56, radius * (0.62 + progress * 0.24), radius * 0.04, radius * 0.24, withAlpha(colors.white, alpha * 0.78), 1);
      return;
    }

    if (pulse.type === "riser") {
      for (let i = 0; i < 13; i += 1) {
        const t = i / 12;
        const spiralAngle = pulse.angle + t * 1.85 + progress * 1.6;
        const spiralRadius = radius * (0.22 + t * 0.66 + progress * 0.08);
        const p = polarPoint(cx, cy, spiralAngle, spiralRadius);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * (0.014 + t * 0.008), 0, Math.PI * 2);
        ctx.fillStyle = solidAccent(i % 2 === 0 ? colors.orange : colors.aqua, 0.62 + alpha * 0.34);
        ctx.fill();
      }

      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * (0.35 + i * 0.13 + progress * 0.1), pulse.angle + i * 0.18, pulse.angle + progress * 1.9 + i * 0.34);
        ctx.strokeStyle = solidAccent(i % 2 === 0 ? colors.orange : colors.aqua, 0.62 + alpha * 0.32);
        ctx.lineWidth = Math.max(1.4, 2.9 - i * 0.22);
        ctx.stroke();
      }
      return;
    }

    if (pulse.type === "vocal") {
      const base = radius * (0.42 + progress * 0.22);
      for (let i = 0; i < 20; i += 1) {
        const a = pulse.angle - 0.54 + i * 0.055;
        const h = radius * (0.046 + Math.sin(i * 1.7 + progress * 8) * 0.022 + (i % 5) * 0.012);
        const width = radius * 0.016;
        const p = polarPoint(cx, cy, a, base + h * 1.6);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(a + Math.PI / 2);
        ctx.fillStyle = i % 3 === 0 ? solidAccent(colors.violet, 0.7 + alpha * 0.25) : withAlpha(colors.white, 0.58 + alpha * 0.26);
        ctx.fillRect(-width / 2, -h / 2, width, h);
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, radius * (0.5 + progress * 0.26), pulse.angle - 0.48, pulse.angle + 0.48);
      ctx.strokeStyle = solidAccent(colors.violet, 0.72 + alpha * 0.24);
      ctx.lineWidth = 4.8;
      ctx.stroke();
      return;
    }

    if (pulse.type === "laser") {
      const sweep = pulse.angle + progress * 0.42;
      drawArcBand(cx, cy, radius * 0.18, radius * (0.98 + progress * 0.2), sweep - 0.045, sweep + 0.055, solidAccent(colors.lime, 0.5 + alpha * 0.34));
      drawRadialLine(cx, cy, sweep, radius * 0.06, radius * (1.16 + progress * 0.18), solidAccent(colors.lime, 0.78 + alpha * 0.2), 6.2);
      drawRadialLine(cx, cy, sweep - 0.055, radius * 0.16, radius * 1.0, solidAccent(colors.aqua, 0.66 + alpha * 0.28), 2.8);
      drawRadialLine(cx, cy, sweep + 0.065, radius * 0.12, radius * 0.94, withAlpha(colors.white, 0.62 + alpha * 0.18), 1.6);
      drawTriangle(cx, cy, sweep, radius * (0.91 + progress * 0.15), radius * 0.045, solidAccent(colors.lime, 0.92), 1);
      return;
    }
  });
}

function drawEnergyBursts(cx, cy, radius) {
  const current = performance.now();
  state.energyBursts = state.energyBursts.filter((burst) => current - burst.start < burst.duration);
  state.energyBursts.forEach((burst) => {
    const progress = (current - burst.start) / burst.duration;
    const alpha = 1 - progress;
    const eased = 1 - Math.pow(1 - progress, 3);
    const spread = burst.type === "hat" ? 0.08 : burst.type === "snare" ? 0.34 : 0.52;
    const baseAngle = burst.angle + burst.spin * progress + state.baseRotation * 0.08;
    const inner = radius * (0.16 + eased * 0.42);
    const outer = radius * (0.48 + eased * (burst.type === "kick" ? 0.72 : 0.48));

    drawArcBand(cx, cy, inner, outer, baseAngle - spread, baseAngle + spread, solidAccent(burst.color, alpha * (0.24 + burst.intensity * 0.22)));

    ctx.beginPath();
    ctx.arc(cx, cy, radius * (0.2 + eased * 0.86), baseAngle - spread * 1.4, baseAngle + spread * 1.4);
    ctx.strokeStyle = solidAccent(burst.color, alpha * (0.5 + burst.intensity * 0.28));
    ctx.lineWidth = 1.8 + burst.intensity * 4 + progress * 3;
    ctx.stroke();

    const rayCount = burst.type === "hat" ? 5 : burst.type === "snare" ? 10 : 16;
    for (let i = 0; i < rayCount; i += 1) {
      const offset = (i / Math.max(1, rayCount - 1) - 0.5) * spread * 2.4 + Math.sin(i * 1.7) * 0.035;
      const angle = baseAngle + offset;
      const rayOuter = radius * (0.62 + eased * 0.54 + (i % 4) * 0.025);
      drawRadialLine(
        cx,
        cy,
        angle,
        radius * (0.12 + progress * 0.16),
        rayOuter,
        i % 3 === 0 ? solidAccent(burst.color, alpha * 0.92) : withAlpha(colors.white, alpha * 0.64),
        i % 3 === 0 ? 2.4 + burst.intensity * 1.4 : 1.1,
      );
    }
  });
}

function drawFragments(cx, cy, radius) {
  const current = performance.now();
  state.fragments = state.fragments.filter((fragment) => current - fragment.start < fragment.duration);
  state.fragments.forEach((fragment) => {
    const progress = (current - fragment.start) / fragment.duration;
    const alpha = 1 - progress;
    const eased = 1 - Math.pow(1 - progress, 2.4);
    const angle = fragment.angle + fragment.spin * progress * 0.28 + state.baseRotation * 0.02;
    const distance = radius * (fragment.radius + eased * fragment.speed);
    const p = polarPoint(cx, cy, angle, distance);
    const size = radius * fragment.size * (1 - progress * 0.32);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle + fragment.spin * progress);
    ctx.fillStyle = fragment.color === colors.white ? withAlpha(colors.white, alpha * 0.84) : solidAccent(fragment.color, 0.58 + alpha * 0.36);
    if (fragment.shape === 0) {
      ctx.fillRect(-size * 0.45, -size * 1.4, size * 0.9, size * 2.8);
    } else if (fragment.shape === 1) {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.3);
      ctx.lineTo(size, size);
      ctx.lineTo(-size, size * 0.7);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawScratch(cx, cy, radius) {
  const current = performance.now();
  state.scratchPulses = state.scratchPulses.filter((pulse) => current - pulse.start < 360);
  state.scratchPulses.forEach((pulse) => {
    const progress = (current - pulse.start) / 360;
    const alpha = 1 - progress;
    for (let i = 0; i < 5; i += 1) {
      const angle = pulse.angle + i * 0.05 * pulse.direction;
      const r1 = radius * (0.28 + i * 0.06);
      const r2 = radius * (0.66 + i * 0.05);
      drawRadialLine(cx, cy, angle, r1, r2, `rgba(243, 240, 232, ${alpha * 0.62})`, 2);
    }
  });
}

function drawReverb(cx, cy, radius, rotationOffset) {
  if (state.reverb < 0.03) {
    return;
  }
  for (let i = 0; i < 5; i += 1) {
    const phase = (performance.now() * 0.00022 + i / 5) % 1;
    const r = radius * (0.72 + phase * 0.42 + state.reverb * 0.12);
    ctx.beginPath();
    ctx.arc(cx, cy, r * (1 + Math.sin(phase * Math.PI * 2 + rotationOffset) * 0.018), rotationOffset, Math.PI * 2 + rotationOffset);
    ctx.strokeStyle = `rgba(216, 197, 255, ${(1 - phase) * state.reverb * 0.24})`;
    ctx.lineWidth = 1 + state.reverb * 4;
    ctx.stroke();
  }
}

function drawCenter(cx, cy, radius, kick) {
  ctx.save();
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.06, cx, cy, radius * (0.24 + kick * 0.06));
  glow.addColorStop(0, "rgba(216, 197, 255, 0.7)");
  glow.addColorStop(0.38, "rgba(243, 240, 232, 0.22)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(cx - radius * 0.45, cy - radius * 0.45, radius * 0.9, radius * 0.9);

  ctx.beginPath();
  ctx.arc(cx, cy, radius * (0.145 + kick * 0.018), 0, Math.PI * 2);
  ctx.fillStyle = colors.stage;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(243, 240, 232, 0.72)";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.07, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 0.96;
  ctx.fill();
  ctx.restore();
}

function drawReadouts(width, height) {
  ctx.save();
  ctx.fillStyle = "rgba(243, 240, 232, 0.68)";
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  const readout = [
    `BPM ${state.bpm}`,
    `STEP ${String(state.currentStep % 64).padStart(2, "0")}`,
    `FILTER ${filterValue.textContent}`,
    `LOOP ${state.loopBeats ? `${state.loopBeats}B` : "OFF"}`,
  ];
  readout.forEach((text, index) => {
    ctx.fillText(text, Math.max(24, width - 160), height - 86 + index * 18);
  });
  ctx.restore();
}

playButton.addEventListener("click", () => {
  if (state.playing) {
    stopTransport();
  } else {
    startTransport();
  }
});

document.querySelectorAll(".track-tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedTrack = button.dataset.track;
    selectedTrackText.textContent = trackLabels[state.selectedTrack];
    document.querySelectorAll(".track-tab").forEach((tab) => {
      tab.classList.toggle("active", tab === button);
    });
  });
});

document.querySelectorAll(".volume-slider").forEach((slider) => {
  slider.addEventListener("input", () => {
    const track = slider.dataset.track;
    state.volumes[track] = Number(slider.value) / 100;
    updateVolumes(track);
  });
});

filterSlider.addEventListener("input", () => {
  initAudio();
  state.filter = Number(filterSlider.value) / 100;
  updateFilter();
});

reverbSlider.addEventListener("input", () => {
  initAudio();
  state.reverb = Number(reverbSlider.value) / 100;
  updateReverb();
});

document.querySelectorAll(".sample-pad").forEach((button) => {
  button.addEventListener("click", () => {
    triggerSample(button.dataset.sample);
    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.96)" },
        { transform: "scale(1)" },
      ],
      { duration: 170, easing: "ease-out" },
    );
  });
});

document.querySelectorAll(".loop-buttons button").forEach((button) => {
  button.addEventListener("click", () => setLoop(Number(button.dataset.loop)));
});

let draggingJog = false;
let lastJogAngle = 0;

function getPointerAngle(event) {
  const rect = jogWheel.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  return Math.atan2(y, x);
}

jogWheel.addEventListener("pointerdown", (event) => {
  draggingJog = true;
  lastJogAngle = getPointerAngle(event);
  jogWheel.setPointerCapture(event.pointerId);
});

jogWheel.addEventListener("pointermove", (event) => {
  if (!draggingJog) {
    return;
  }
  const angle = getPointerAngle(event);
  let delta = angle - lastJogAngle;
  if (delta > Math.PI) {
    delta -= Math.PI * 2;
  }
  if (delta < -Math.PI) {
    delta += Math.PI * 2;
  }
  lastJogAngle = angle;
  state.jog = Math.max(-1, Math.min(1, state.jog + delta * 1.7));
  state.jogAngle += delta * 1.7;
  jogWheel.style.transform = `rotate(${state.jogAngle}rad)`;
  jogValue.textContent = `${Math.round(state.jog * 100)}%`;
  jogWheel.setAttribute("aria-valuenow", String(Math.round(state.jog * 100)));
  state.scratchPulses.push({
    start: performance.now(),
    angle: state.baseRotation + angle,
    direction: Math.sign(delta) || 1,
  });
  if (audio && Math.abs(delta) > 0.08) {
    sampleLaser(now() + 0.01);
  }
});

function releaseJog(event) {
  if (!draggingJog) {
    return;
  }
  draggingJog = false;
  if (event.pointerId !== undefined) {
    jogWheel.releasePointerCapture(event.pointerId);
  }
}

jogWheel.addEventListener("pointerup", releaseJog);
jogWheel.addEventListener("pointercancel", releaseJog);

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawVisualization();
