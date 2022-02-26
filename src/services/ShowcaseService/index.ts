import _ from 'lodash';
import { HttpService } from '../HttpService';
import { ShowcaseDetails } from '@/classes/Showcase/ShowcaseDetails';

class ShowcaseService {

  public async getShowcases(): Promise<ShowcaseDetails[]> {
    try {
      const { data } = await HttpService.get('/showcase/');
      return (data as ShowcaseDetails[]).map(item => new ShowcaseDetails(item));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getShowcaseImageById(id: string): Promise<Blob> {
    try {
      const { data } = await HttpService.get(`/showcase/image/${id}`, '', { responseType: 'json' });
      return Promise.resolve(new Blob([data]));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async itemClicked(id: string): Promise<void> {
    try {
      const data = new FormData();
      data.append('id', id);
      await HttpService.put('/showcase/interacted-with/', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

}

const INSTANCE = new ShowcaseService();

export {
  INSTANCE as ShowcaseService,
}
