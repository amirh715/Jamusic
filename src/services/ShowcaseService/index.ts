import _ from 'lodash';
import { HttpService } from '../HttpService';
import { ShowcaseDetails } from '@/classes/Showcase/ShowcaseDetails';

class ShowcaseService {

  public async getShowcases(): Promise<void> {
    try {
      const { data } = await HttpService.get('');
      return _.forOwn(data, v => new ShowcaseDetails(v));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getShowcaseImageById(id: string): Promise<Blob> {
    try {
      const { data } = await HttpService.get('/showcase/image', '', { responseType: 'json' });
      return Promise.resolve(new Blob([data]));
    } catch(err) {
      return Promise.reject(err);
    }
  }

}

const INSTANCE = new ShowcaseService();

export {
  INSTANCE as ShowcaseService,
}
