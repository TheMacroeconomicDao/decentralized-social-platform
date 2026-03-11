class MockApiService {
  static getData(json: unknown, timeout = 1000): Promise<unknown> {
    return new Promise(resolve => {
      setTimeout(() => resolve(json), timeout);
    });
  }

  static async GET(json: unknown, timeout?: number | undefined): Promise<unknown> {
    return MockApiService.getData(json, timeout);
  }

  static async POST(json: unknown, timeout?: number): Promise<unknown> {
    const res = await MockApiService.makeRequest(json, timeout);

    return res;
  }

  static async PATCH(json: unknown, timeout?: number): Promise<unknown> {
    const res = await MockApiService.makeRequest(json, timeout);

    return res;
  }

  static async makeRequest(json: unknown, timeout: number | undefined): Promise<unknown> {
    return MockApiService.getData(json, timeout);
  }
}

export default MockApiService;
