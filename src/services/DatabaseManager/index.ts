import { Dexie, Table } from 'dexie';
import { IPlayedTrack } from './IPlayedTrack';
import { ISearchHistory } from './ISearchHistory';

class DatabaseManager extends Dexie {

  public searchHistory: Table<ISearchHistory, number>;
  public playedTracks: Table<IPlayedTrack, number>;

  public constructor(databaseName: string) {
    super(databaseName);
    this.version(2).stores({
      searchHistory: '++id, entityId, entityTitle, searchTerm, searchedAt',
      playedTracks: '++id, trackId, playedAt',
    });
  }

}

const INSTANCE = new DatabaseManager('JamusicDB');

export {
  INSTANCE as DatabaseManager,
}
