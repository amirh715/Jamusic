import { orderBy } from 'lodash';
import { LibraryEntityIdAndTitle } from './LibraryEntityIdAndTitleDTO';
import { TrackDetailsDTO } from './TrackDetailsDTO';

class PlaylistDetailsDTO {
  
  public id: string;
  public title: string;
  public createdAt: Date;
  public lastModifiedAt: Date;
  public tracks: TrackDetailsDTO[];
  
  public constructor(_props: {
    id: string,
    title: string,
    createdAt: string,
    lastModifiedAt: string,
    tracks?: {
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
    } []
  }) {
    this.id = _props.id;
    this.title = _props.title;
    this.createdAt = new Date(_props.createdAt);
    this.lastModifiedAt = new Date(_props.lastModifiedAt);
    this.tracks = orderBy(
      _props.tracks.map(
        props => new TrackDetailsDTO(props)
      ),
      track => track.rate,
      ['desc']
    );
  }

}

export {
  PlaylistDetailsDTO,
}
