import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';

export class VideoAPI extends RESTDataSource {
  override baseURL = 'http://video-service:4000/v1/';
  context!: { token?: string };

  // Hook to forward the authorization token if it exists
  override willSendRequest(_path: string, request: AugmentedRequest) {
    if (this.context?.token) {
      request.headers['authorization'] = this.context.token;
    }
  }

  async getHealth() {
    return this.get('health');
  }
}

export class AccountAPI extends RESTDataSource {
  override baseURL = 'http://account-service:4000/v1/';
  context!: { token?: string };

  override willSendRequest(_path: string, request: AugmentedRequest) {
    if (this.context?.token) {
      request.headers['authorization'] = this.context.token;
    }
  }

  async getHealth() {
    return this.get('health');
  }
}
