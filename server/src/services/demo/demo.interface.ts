export interface IDemoService {
  getTimestamp: () => Promise<{ data: { timestamp: string } } | Error>;
  getCount: () => Promise<{ data: { count: number } } | Error>;
}
