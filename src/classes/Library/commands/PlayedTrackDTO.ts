class PlayedTrackDTO {
  
  public trackId: string;
  public playedAt: Date;

  public constructor(_props: {
    trackId: string,
    playedAt: Date,
  }) {
    this.trackId = _props.trackId;
    this.playedAt = _props.playedAt;
  }

}

export {
  PlayedTrackDTO,
}
