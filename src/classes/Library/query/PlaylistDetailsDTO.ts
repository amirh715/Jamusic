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
    tracks?: TrackDetailsDTO[]
  }) {
    this.id = _props.id;
    this.title = _props.title;
    this.createdAt = new Date(_props.createdAt);
    this.lastModifiedAt = new Date(_props.lastModifiedAt);
    this.tracks = _props.tracks;
  }

}

export {
  PlaylistDetailsDTO,
}
