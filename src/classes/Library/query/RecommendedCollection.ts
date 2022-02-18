class RecommendedCollection {

  public title: string;
  public image: Blob;
  public imageLoading: boolean;

  public constructor(_props: {
    title: string,
    image: Blob,
    imageLoading: boolean,
  }) {
    this.title = _props.title;
    this.image = _props.image;
    this.imageLoading = _props.imageLoading;
  }

}

export {
  RecommendedCollection,
}
