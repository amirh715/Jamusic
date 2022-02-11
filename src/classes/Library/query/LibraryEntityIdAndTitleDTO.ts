class LibraryEntityIdAndTitle {

  public id: string;
  public title: string;

  public constructor(_props: {
    id: string,
    title: string,
  }) {
    this.id = _props.id;
    this.title = _props.title;
  }

}

export {
  LibraryEntityIdAndTitle,
}
