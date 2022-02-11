class ShowcaseDetails {

  public id: string;
  public index: number;
  public title: string;
  public description: string;
  public route: string;

  public constructor(_props: {
    id: string,
    index: number,
    title: string,
    description: string,
    route: string,
  }) {
    this.id = _props.id;
    this.index = _props.index;
    this.title = _props.title;
    this.description = _props.description;
    this.route = _props.route;
  }

}

export {
  ShowcaseDetails,
}
