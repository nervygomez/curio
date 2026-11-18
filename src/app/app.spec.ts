import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TOPICS } from './data/topics';

class MockAudioContext {
  currentTime = 0;
  state = 'running';
  destination = {};
  resume = vi.fn();

  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    };
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn()
      },
      connect: vi.fn()
    };
  }
}

describe('App', () => {
  beforeEach(async () => {
    vi.stubGlobal('AudioContext', MockAudioContext);

    await TestBed.configureTestingModule({
      imports: [App]
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('starts with the first topic and displays its translations', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const translations = compiled.querySelectorAll('.translations div');

    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe(TOPICS[0].title);
    expect(translations[0].textContent?.trim()).toBe(TOPICS[0].es);
    expect(translations[1].textContent?.trim()).toBe(TOPICS[0].pt);
    expect(compiled.querySelector('button')?.disabled).toBe(false);
  });

  it('selects a random topic and restores translations when the spin ends', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector('button')?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isDrawing).toBe(true);
    expect(compiled.querySelector('button')?.disabled).toBe(true);
    expect(compiled.querySelector('.translations')).toBeNull();

    vi.runAllTimers();
    fixture.detectChanges();

    const lastTopic = TOPICS[TOPICS.length - 1];
    const translations = compiled.querySelectorAll('.translations div');

    expect(fixture.componentInstance.isDrawing).toBe(false);
    expect(fixture.componentInstance.currentTopic).toBe(lastTopic);
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe(lastTopic.title);
    expect(translations[0].textContent?.trim()).toBe(lastTopic.es);
    expect(translations[1].textContent?.trim()).toBe(lastTopic.pt);
    expect(compiled.querySelector('button')?.disabled).toBe(false);
  });

  it('increases the delay between topic changes as the spin progresses', () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);

    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.spinTopic();
    const initialCalls = random.mock.calls.length;

    vi.advanceTimersByTime(500);
    const earlyChanges = random.mock.calls.length - initialCalls;

    vi.advanceTimersByTime(500);
    const laterChanges = random.mock.calls.length - initialCalls - earlyChanges;

    expect(earlyChanges).toBeGreaterThan(laterChanges);

    vi.runAllTimers();
  });

  it('ignores another spin while a draw is in progress', () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);

    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.spinTopic();
    const topicDuringDraw = app.currentTopic;
    const randomCallsAfterStarting = random.mock.calls.length;
    app.spinTopic();

    expect(random).toHaveBeenCalledTimes(randomCallsAfterStarting);
    expect(app.isDrawing).toBe(true);
    expect(app.currentTopic).toBe(topicDuringDraw);

    vi.runAllTimers();
  });

  it('contains 100 topics with English, Spanish, and Portuguese text', () => {
    expect(TOPICS).toHaveLength(100);
    expect(
      TOPICS.every((topic) => topic.title.trim() && topic.es.trim() && topic.pt.trim())
    ).toBe(true);
  });
});
