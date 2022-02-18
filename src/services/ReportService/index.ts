import _ from 'lodash';
import { HttpService } from '../HttpService';
import { CreateNewReportDTO } from '@/classes/Report/commands/CreateNewReportDTO';
import { ReportDetails } from '@/classes/Report/query/ReportDetails';
import { ApiError } from '../HttpService/ApiError';

class ReportService {

  public async createNewReport(dto: CreateNewReportDTO): Promise<void> {
    const {
      reportType,
      message,
    } = dto;
    const data = new FormData();
    data.append('reportType', reportType);
    data.append('message', message);
    await HttpService.post('/report/', data);
  }

  public async getAllOfMyReports(): Promise<ReportDetails> {
    const { data } = await HttpService.get('/report/');
    return Promise.resolve(_.forOwn(data, v => new ReportDetails(v)));
  }

}

const INSTANCE = new ReportService();

export {
  INSTANCE as ReportService,
}
