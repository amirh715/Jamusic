class Timer {
  private timerId: number;
  private duration: number;

  constructor() {
    this.duration = 0;
  }

  public start(): void {
    this.timerId = setInterval(() => {
      this.duration++;
    }, 1000, []);
  }

  public stop(): void {
    clearInterval(this.timerId);
  }

  public reset(): void {
    this.stop();
    this.duration = 0;
  }

  public restart(): void {
    this.stop();
    this.start();
  }

  public getDuration(): number {
    return this.duration;
  }
}

export {
  Timer,
};
