export class HttpService {
  constructor(
    private baseURL: string,
    private defaultHeaders: Record<string, string> = {}
  ) {}

  async get<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(this.baseURL + url, {
      ...init,
      method: "GET",
      headers: {
        ...this.defaultHeaders,
        ...init?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  async post<T>(
    url: string,
    body: any,
    init?: RequestInit
  ): Promise<T> {
    const res = await fetch(this.baseURL + url, {
      ...init,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...init?.headers,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
  }
}
