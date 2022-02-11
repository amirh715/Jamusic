import { LibraryEntityDetailsDTO } from './LibraryEntityDetailsDTO';
import { AlbumDetailsDTO } from './AlbumDetailsDTO';
import { ArtistDetailsDTO } from './ArtistDetailsDTO';
import { TrackDetailsDTO } from './TrackDetailsDTO';

class LibraryEntityDetailsDTOBuilder {

  public static build(_props): LibraryEntityDetailsDTO {
    let instance: LibraryEntityDetailsDTO;
    switch(_props.type) {
      case 'S':
        instance = new ArtistDetailsDTO(_props);
        break;
      case 'B':
        instance = new ArtistDetailsDTO(_props);
        break;
      case 'A':
        instance = new AlbumDetailsDTO(_props);
        break;
      case 'T':
        instance = new TrackDetailsDTO(_props);
        break;
    }
    return instance;
  }

}

export {
  LibraryEntityDetailsDTOBuilder,
}
