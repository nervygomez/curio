import { Component, ChangeDetectorRef } from '@angular/core';
import { TOPICS, Topic } from './data/topics';

const SPIN_STEPS = 24;
const MIN_TICK_DELAY_MS = 35;
const MAX_TICK_DELAY_MS = 300;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  topics: Topic[] = TOPICS;

  currentTopic: Topic = this.topics[0];

  hasStarted = false;

  isDrawing = false;

  private audioContext?: AudioContext;

  constructor(private cdr: ChangeDetectorRef) {}

  continueToWheel(): void {
    this.hasStarted = true;
  }

  spinTopic(): void {
    if (this.isDrawing) {
      return;
    }

    this.isDrawing = true;
    this.cdr.detectChanges();

    this.startAudio();

    const finalIndex = Math.floor(Math.random() * this.topics.length);
    let step = 0;

    const draw = () => {
      if (step === SPIN_STEPS - 1) {
        this.currentTopic = this.topics[finalIndex];
        this.isDrawing = false;
        this.playWinnerSound();
        this.cdr.detectChanges();
        return;
      }

      const randomIndex = Math.floor(Math.random() * this.topics.length);
      this.currentTopic = this.topics[randomIndex];
      this.playTick();
      this.cdr.detectChanges();

      step += 1;
      const progress = step / (SPIN_STEPS - 1);
      const delay =
        MIN_TICK_DELAY_MS +
        (MAX_TICK_DELAY_MS - MIN_TICK_DELAY_MS) * progress ** 2;

      setTimeout(draw, delay);
    };

    draw();
  }

  private startAudio(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private playTick(): void {
    if (!this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = 'square';

    oscillator.frequency.setValueAtTime(850, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.035
    );

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.04);
  }

  private playWinnerSound(): void {
    if (!this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = 'sine';

    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.setValueAtTime(
      680,
      now + 0.12
    );

    gain.gain.setValueAtTime(0.001, now);

    gain.gain.linearRampToValueAtTime(
      0.12,
      now + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.35
    );

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.4);
  }
}
