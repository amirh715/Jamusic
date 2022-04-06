import { toString } from 'lodash';
import { ArtworkDetailsDTO } from './ArtworkDetailsDTO';
import { LibraryEntityIdAndTitle } from './LibraryEntityIdAndTitleDTO';
import { TrackDetailsDTO } from './TrackDetailsDTO';

class AlbumDetailsDTO extends ArtworkDetailsDTO {

  public tracks: TrackDetailsDTO[];

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
    imageLoading: boolean,
    recordLabel: string,
    producer: string,
    releaseDate: Date,
    artist: LibraryEntityIdAndTitle,
    tracks: {
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
      lyrics: string,
      album: LibraryEntityIdAndTitle,
    }[],
  }) {
    super(_props);
    this.tracks = _props.tracks.map((track) => new TrackDetailsDTO({
      ...track,
      artist: _props.artist,
      album: {id: _props.id, title: _props.title},
    }));
  }

}

export {
  AlbumDetailsDTO,
}
