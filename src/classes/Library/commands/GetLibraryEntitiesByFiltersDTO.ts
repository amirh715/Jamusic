class GetLibraryEntitiesByFilters {

  public searchTerm: string;
  public artistId?: string;
  public limit: number;
  public offset: number;

  public constructor(_props: {
    searchTerm?: string,
    artistId?: string,
    limit?: number,
    offset?: number,
  }) {
    this.searchTerm = _props.searchTerm;
    this.artistId = _props.artistId;
    this.limit = _props.limit || 20;
    this.offset = _props.offset || 0;
  }

}

export {
  GetLibraryEntitiesByFilters,
}
