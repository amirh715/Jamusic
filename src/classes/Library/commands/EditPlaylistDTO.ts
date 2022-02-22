class EditPlaylistDTO {

  public id: string;
  public title: string;
  public trackIds?: string[];

  public constructor(_props: {
    id: string,
    title: string,
    trackIds?: string[]
  }) {
    this.id = _props.id;
    this.title = _props.title;
    this.trackIds = _props.trackIds;
  }

}

export {
  EditPlaylistDTO,
}
