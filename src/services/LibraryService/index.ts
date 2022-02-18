import * as _ from 'lodash';
import { HttpService } from '../HttpService';
import { CreateNewPlaylistDTO } from '@/classes/Library/commands/CreateNewPlaylistDTO';
import { EditPlaylistDTO } from '@/classes/Library/commands/EditPlaylistDTO';
import { PlaylistDetailsDTO } from '@/classes/Library/query/PlaylistDetailsDTO';
import { PlayedTrackDTO } from '@/classes/Library/commands/PlayedTrackDTO';
import { GetLibraryEntitiesByFilters } from '@/classes/Library/commands/GetLibraryEntitiesByFiltersDTO';
import { LibraryEntityDetailsDTO } from '@/classes/Library/query/LibraryEntityDetailsDTO';
import { LibraryEntityDetailsDTOBuilder } from '@/classes/Library/query/LibraryEntityDetailsDTOBuilder';
import { map, orderBy } from 'lodash';
import { RecommendedCollection } from '@/classes/Library/query/RecommendedCollection';

class LibraryService {

  public async getLibraryEntitiesByFilters(dto: GetLibraryEntitiesByFilters): Promise<LibraryEntityDetailsDTO[]> {
    try {
      let query = dto ? '?' : '';
      _.forOwn((_.omitBy(dto, _.isNil)), (val, key) => query += `${key}=${val}&`);
      const { data } = await HttpService.get('/library/', query);
      const results = _.orderBy(_.map(data, v => LibraryEntityDetailsDTOBuilder.build(v)), ['rate'], ['desc']);
      return Promise.resolve(results);
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getLibraryEntityById(id: string): Promise<LibraryEntityDetailsDTO> {
    try {
      const { data } = await HttpService.get(`/library/${id}`, '');
      return Promise.resolve(LibraryEntityDetailsDTOBuilder.build(data));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getLibraryEntityImageById(id: string): Promise<Blob> {
    try {
      const { data } = await HttpService.get(`/library/image/${id}`, '', { responseType: 'blob' });
      return Promise.resolve(new Blob([data]));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getTrackAudioById(id: string): Promise<Blob> {
    try {
      const { data } = await HttpService.get('/user/', '', { responseType: 'blob' });
      return Promise.resolve(new Blob([data]));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async playTrack(dto: PlayedTrackDTO): Promise<void> {
    try {
      const {
        trackId,
        playedAt,
      } = dto;
      const data = new FormData();
      data.append('trackId', trackId);
      data.append('playedAt', playedAt.toUTCString());
      await HttpService.post('/library/played-track', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async createNewPlaylist(dto: CreateNewPlaylistDTO): Promise<void> {
    try {
      const {
        title,
        trackIds,
      } = dto;
      const data = new FormData();
      data.append('title', title);
      data.append('trackIds', JSON.stringify(trackIds));
      await HttpService.post('/library/playlist/', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async editPlaylist(dto: EditPlaylistDTO): Promise<void> {
    try {
      const {
        id,
        title,
        trackIds,
      } = dto;
      const data = new FormData();
      data.append('id', id);
      data.append('title', title);
      data.append('trackIds', JSON.stringify(trackIds));
      await HttpService.put('/library/playlist/', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getAllOfMyPlaylists(): Promise<PlaylistDetailsDTO[]> {
    try {
      const { data } = await HttpService.get('/library/playlist/');
      return orderBy(map(data, (item) => new PlaylistDetailsDTO(item)), 'createdAt', 'desc');
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getPlaylistById(id: string): Promise<PlaylistDetailsDTO> {
    try {
      const { data } = await HttpService.get(`/library/playlist/${id}`);
      return new PlaylistDetailsDTO(data);
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getAllCollections() {
    try {
      const { data } = await HttpService.get('/library/collections/');
      return map(data, (collection) => new RecommendedCollection(collection));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async deletePlaylist(id: string): Promise<void> {
    try {
      const data = new FormData();
      data.append('id', id);
      await HttpService.delete('/library/playlist/', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

}

const INSTANCE = new LibraryService();

export {
  INSTANCE as LibraryService,
}
