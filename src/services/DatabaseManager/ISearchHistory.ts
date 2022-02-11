interface ISearchHistory {
  id?: number;
  entityId: string;
  entityTitle: string;
  searchTerm: string;
  searchedAt: Date;
}

export {
  ISearchHistory,
}
