import { LibraryEntityIdAndTitle } from "./LibraryEntityIdAndTitleDTO";

class RecommendedCollection {

  public title: string;
  public image: Blob;
  public imageLoading: boolean;
  public items: LibraryEntityIdAndTitle[];

  public constructor(_props: {
    title: string,
    image: Blob,
    imageLoading: boolean,
    items: LibraryEntityIdAndTitle[],
  }) {
    this.title = _props.title;
    this.image = _props.image;
    this.imageLoading = _props.imageLoading;
    this.items = _props.items;
  }

}

export {
  RecommendedCollection,
}
