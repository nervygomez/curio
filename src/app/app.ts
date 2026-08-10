import { Component, ChangeDetectorRef } from '@angular/core';
import { TOPICS, Topic } from './data/topics';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  topics: Topic[] = TOPICS;

  currentTopic: Topic = this.topics[0];

  isDrawing = false;

  private audioContext?: AudioContext;

  constructor(private cdr: ChangeDetectorRef) {}

  spinTopic(): void {
    if (this.isDrawing) {
      return;
    }

    this.isDrawing = true;
    this.cdr.detectChanges();

    this.startAudio();

    let elapsed = 0;
    let delay = 30;

    const draw = () => {

      const randomIndex = Math.floor(
        Math.random() * this.topics.length
      );

      this.currentTopic = this.topics[randomIndex];

      this.playTick();

      elapsed += delay;

      this.cdr.detectChanges();

      if (elapsed < 2500) {

        delay += 18;
        setTimeout(draw, delay);

      } else {

        const finalIndex = Math.floor(
          Math.random() * this.topics.length
        );

        this.currentTopic = this.topics[finalIndex];

        this.isDrawing = false;
        this.playWinnerSound();
        this.cdr.detectChanges();
      }
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
