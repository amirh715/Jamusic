import { LibraryEntityDetailsDTO } from './LibraryEntityDetailsDTO';

class ArtistDetailsDTO extends LibraryEntityDetailsDTO {

  public instagramId: string;

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
    instagramId: string,
  }) {
    super(_props);
    this.instagramId = _props.instagramId;
  }

}

export {
  ArtistDetailsDTO,
}
