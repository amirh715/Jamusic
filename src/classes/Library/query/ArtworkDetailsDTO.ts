import { LibraryEntityIdAndTitle } from './LibraryEntityIdAndTitleDTO';
import { LibraryEntityDetailsDTO } from './LibraryEntityDetailsDTO';

abstract class ArtworkDetailsDTO extends LibraryEntityDetailsDTO {

  public recordLabel: string;
  public producer: string;
  public releaseDate: Date;
  public artist: LibraryEntityIdAndTitle;

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
    recordLabel: string,
    producer: string,
    releaseDate: Date,
    artist: LibraryEntityIdAndTitle,
  }) {
    super(_props);
    this.recordLabel = _props.recordLabel;
    this.producer = _props.producer;
    this.releaseDate = _props.releaseDate;
    this.artist = _props.artist;
  }


}

export {
  ArtworkDetailsDTO,
}
