import { useState, useEffect, useRef } from 'react';

export function useCampfireSound() {
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [ambientIntensity, setAmbientIntensity] = useState<number>(0.15);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const flameGainNodeRef = useRef<GainNode | null>(null);
  const intervalIdRef = useRef<any>(null);

  const toggleAmbientSound = () => {
    if (isAmbientPlaying) {
      stopAmbient();
    } else {
      startAmbient();
    }
  };

  const startAmbient = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain for Campfire volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(ambientIntensity, ctx.currentTime);
      masterGain.connect(ctx.destination);
      flameGainNodeRef.current = masterGain;

      // 1. Synthesize Brown Noise for Flame Rumble
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brownian noise integration formula
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 4.0; // amplify to audible level
      }

      const flameSource = ctx.createBufferSource();
      flameSource.buffer = noiseBuffer;
      flameSource.loop = true;

      // Lowpass filter for deep rumbling flames
      const flameFilter = ctx.createBiquadFilter();
      flameFilter.type = 'lowpass';
      flameFilter.frequency.setValueAtTime(110, ctx.currentTime);

      // Low Frequency Oscillator (LFO) for flame crackle flicker
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.7, ctx.currentTime); // 0.7 Hz flicker

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(45, ctx.currentTime); // modulate cutoff frequency up to 45Hz

      lfo.connect(lfoGain);
      lfoGain.connect(flameFilter.frequency);

      flameSource.connect(flameFilter);
      flameFilter.connect(masterGain);

      lfo.start();
      flameSource.start();

      // 2. Synthesize White Noise for crackles/sparks
      const playSpark = () => {
        if (!audioCtxRef.current || ctx.state === 'closed') return;

        const duration = 0.005 + Math.random() * 0.015;
        const sparkBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const sparkData = sparkBuffer.getChannelData(0);
        for (let i = 0; i < sparkBuffer.length; i++) {
          sparkData[i] = Math.random() * 2 - 1;
        }

        const sparkSource = ctx.createBufferSource();
        sparkSource.buffer = sparkBuffer;

        const sparkFilter = ctx.createBiquadFilter();
        sparkFilter.type = 'bandpass';
        sparkFilter.frequency.setValueAtTime(1800 + Math.random() * 3200, ctx.currentTime);
        sparkFilter.Q.setValueAtTime(12, ctx.currentTime);

        const sparkGain = ctx.createGain();
        const volume = 0.03 + Math.random() * 0.18;
        sparkGain.gain.setValueAtTime(volume, ctx.currentTime);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        sparkSource.connect(sparkFilter);
        sparkFilter.connect(sparkGain);
        sparkGain.connect(masterGain);

        sparkSource.start();

        // Schedule next random spark
        const nextCrackleMs = 40 + Math.random() * 420;
        intervalIdRef.current = setTimeout(playSpark, nextCrackleMs);
      };

      playSpark();
      setIsAmbientPlaying(true);
    } catch (err) {
      console.warn('Audio Context failed to initialize or was blocked by browser security: ', err);
    }
  };

  const stopAmbient = () => {
    setIsAmbientPlaying(false);
    if (intervalIdRef.current) {
      clearTimeout(intervalIdRef.current);
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  // Adjust volume if intensity changes while playing
  useEffect(() => {
    if (flameGainNodeRef.current && audioCtxRef.current) {
      flameGainNodeRef.current.gain.setValueAtTime(ambientIntensity, audioCtxRef.current.currentTime);
    }
  }, [ambientIntensity]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearTimeout(intervalIdRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isAmbientPlaying,
    ambientIntensity,
    setAmbientIntensity,
    toggleAmbientSound
  };
}
