abstract class LibraryEntityDetailsDTO {

  public id: string;
  public type: string;
  public title: string;
  public description: string;
  public monthlyPlayedCount: string;
  public totalPlayedCount: string;
  public rate: number;
  public duration: string;
  public image: Blob;
  public imageLoading: boolean;

  protected constructor(_props: {
    id: string,
    type: string,
    title: string,
    description: string,
    monthlyPlayedCount: string,
    totalPlayedCount: string,
    rate: string,
    duration: string,
    image: Blob,
    imageLoading: boolean,
  }) {
    this.id = _props.id;
    this.type = _props.type;
    this.title = _props.title;
    this.description = _props.description;
    this.monthlyPlayedCount = _props.monthlyPlayedCount;
    this.totalPlayedCount = _props.totalPlayedCount;
    this.rate = Number(_props.rate);
    this.duration = _props.duration;
    this.image = _props.image;
    this.imageLoading = _props.imageLoading;
  }


}

export {
  LibraryEntityDetailsDTO,
}
