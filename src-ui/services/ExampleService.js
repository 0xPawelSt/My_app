import BaseService from "@/services/BaseService";

export default class ExampleService extends BaseService {
  constructor() {
    super();
    this.endpointData = import.meta.env.VITE_API_URL;
  }

  getData() {
    return this.callAjax("GET", this.endpointData);
  }
}
