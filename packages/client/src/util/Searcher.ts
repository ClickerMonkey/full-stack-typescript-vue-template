import { Paging } from 'common';

export type SearchService<R, S> = (request?: R) => Promise<Paging<S>>;

export interface PagingRequest 
{ 
  limit?: number; 
  offset?: number;
}

export class Searcher<R extends PagingRequest, S>
{
  public request: R;
  public results: Paging<S>;
  public failures: any = {};
  public service: SearchService<R, S>;

  public constructor(service: SearchService<R, S>, request: R)
  {
    this.service = service;
    this.request = request;
    this.results = this.emptyResult();
  }

  public async run (): Promise<void>
  {
    try
    {
      this.failures = {};
      this.request.offset = 0;
      this.results = await this.service(this.request);
    }
    catch (e)
    {
      this.failures = e.failures;
      this.results = this.emptyResult();
    }
  }

  public hasNext (): boolean
  {
    return (this.request.offset as number) + this.results.rows.length < this.results.count;
  }

  public async next (append: boolean = true): Promise<void>
  {
    try
    {
      (this.request.offset as number) += (this.request.limit as number);

      const next = await this.service(this.request);

      if (append)
      {
        this.results.rows = this.results.rows.concat(next.rows);
        this.results.count = next.count;
      }
      else
      {
        this.results = next;
      }
    }
    catch (e)
    {
      this.failures = e.failures;
    }
  }

  public emptyResult(): Paging<S>
  {
    return { rows: [], count: 0 };
  }

}