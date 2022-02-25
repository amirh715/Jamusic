import { forOwn, orderBy } from 'lodash';
import { HttpService } from '../HttpService';
import { CreateNewReportDTO } from '@/classes/Report/commands/CreateNewReportDTO';
import { ReportDetails } from '@/classes/Report/query/ReportDetails';
import { ApiError } from '../HttpService/ApiError';

class ReportService {

  public async createNewReport(dto: CreateNewReportDTO): Promise<void> {
    try {
      const {
        reportType,
        message,
      } = dto;
      const data = new FormData();
      data.append('reportType', reportType);
      data.append('message', message);
      await HttpService.post('/report/', data);
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getAllOfMyReports(): Promise<ReportDetails[]> {
    try {
      const { data } = await HttpService.get('/report/');
      const results = orderBy(forOwn(data, v => new ReportDetails(v)), 'createdAt', 'desc');
      return Promise.resolve(results);
    } catch(err) {
      return Promise.reject(err);
    }
  }

}

const INSTANCE = new ReportService();

export {
  INSTANCE as ReportService,
}
