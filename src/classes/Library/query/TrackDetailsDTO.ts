import { ArtworkDetailsDTO } from './ArtworkDetailsDTO';
import { LibraryEntityIdAndTitle } from './LibraryEntityIdAndTitleDTO';

class TrackDetailsDTO extends ArtworkDetailsDTO {

  public lyrics: string;
  public album: LibraryEntityIdAndTitle;

  public constructor(_props: {
    id: string,
    type: string,
    title: string,
    description: string,
    monthlyPlayedCount: string,
    totalPlayedCount: string,
    rate: string,
    duration: string,
    image: Blob,
    recordLabel: string,
    producer: string,
    releaseDate: Date,
    artist: LibraryEntityIdAndTitle,
    lyrics: string,
    album: LibraryEntityIdAndTitle,
  }) {
    super(_props);
    this.lyrics = _props.lyrics;
    this.album = _props.album;
  }
  

}

export {
  TrackDetailsDTO,
}
