class CreateNewReportDTO {

  public message: string;
  public reportType: string;

  public constructor(_props: {
    message: string,
    reportType: string,
  }) {
    this.message = _props.message;
    this.reportType = _props.reportType;
  }

}

export {
  CreateNewReportDTO,
}
