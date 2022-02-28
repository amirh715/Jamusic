import _ from 'lodash';
import { HttpService } from '../HttpService';
import { ShowcaseDetails } from '@/classes/Showcase/ShowcaseDetails';

class ShowcaseService {

  public async getShowcases(options?: { initImageLoadingValue: boolean }): Promise<ShowcaseDetails[]> {
    try {
      const { data } = await HttpService.get('/showcase/');
      return (data as ShowcaseDetails[]).map(item => new ShowcaseDetails({...item, imageLoading: options && options.initImageLoadingValue || false}));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getShowcaseImageById(id: string): Promise<Blob> {
    try {
      const { data } = await HttpService.get(`/showcase/image/${id}`, '', { responseType: 'blob' });
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
