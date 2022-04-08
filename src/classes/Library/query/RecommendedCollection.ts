import { LibraryEntityIdAndTitle } from "./LibraryEntityIdAndTitleDTO";

class RecommendedCollection {

  public title: string;
  public image: Blob;
  public imageLoading: boolean;
  public items: LibraryEntityIdAndTitle[];
  public index: number;

  public constructor(_props: {
    title: string,
    image: Blob,
    imageLoading: boolean,
    items: LibraryEntityIdAndTitle[],
    index: number,
  }) {
    this.title = _props.title;
    this.image = _props.image;
    this.imageLoading = _props.imageLoading;
    this.items = _props.items;
    this.index = _props.index;
  }

}

export {
  RecommendedCollection,
}
