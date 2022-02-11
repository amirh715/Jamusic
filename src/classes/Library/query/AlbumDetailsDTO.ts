import { ArtworkDetailsDTO } from './ArtworkDetailsDTO';
import { LibraryEntityIdAndTitle } from './LibraryEntityIdAndTitleDTO';

class AlbumDetailsDTO extends ArtworkDetailsDTO {

  public tracks: LibraryEntityIdAndTitle[];

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
    tracks: LibraryEntityIdAndTitle[],
  }) {
    super(_props);
    this.tracks = _props.tracks;
  }

}

export {
  AlbumDetailsDTO,
}
