class CreateNewPlaylistDTO {

  public title: string;
  public trackIds: string[];

  public constructor(_props: {
    title: string,
    trackIds: string[]
  }) {
    this.title = _props.title;
    this.trackIds = _props.trackIds;
  }

}

export {
  CreateNewPlaylistDTO,
}
