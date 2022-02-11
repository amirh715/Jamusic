class ReportDetails {

  public reportType: string;
  public message: string;

  public constructor(_props: {
    reportType: string,
    message: string,
  }) {
    this.reportType = _props.reportType;
    this.message = _props.message;
  }

}

export {
  ReportDetails,
}
