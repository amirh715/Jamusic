class LibraryEntityIdAndTitle {

  public id: string;
  public title: string;
  public image?: Blob;
  public imageLoading?: boolean;

  public constructor(_props: {
    id: string,
    title: string,
    image?: Blob,
    imageLoading?: boolean,
  }) {
    this.id = _props.id;
    this.title = _props.title;
    this.image = _props.image;
    this.imageLoading = _props.imageLoading;
  }

}

export {
  LibraryEntityIdAndTitle,
}
