
export const api = 
{
  root: 'http://localhost:3000/api',

  headers: 
  {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  credentials: 'include' as RequestCredentials,

  cache: 'no-cache' as RequestCache,

  async get<T> (url: string, params?: any): Promise<T> 
  {
    return api.call('GET', url + this.getParams(params));
  },
  async post<T> (url: string, data: object): Promise<T> 
  {
    return api.call('POST', url, data);
  },
  async put<T> (url: string, data?: object): Promise<T> 
  {
    return api.call('PUT', url, data);
  },
  async delete<T> (url: string, params?: any): Promise<T> 
  {
    return api.call('DELETE', url + this.getParams(params));
  },

  async call<T> (method: string, url: string, data?: object): Promise<T> 
  {
    const { headers, credentials, cache, root } = api;
    const body = data ? JSON.stringify(data) : undefined;
    const options = { method, headers, body, credentials, cache };

    const response = await fetch(root + url, options);
    let responseText = await response.text();
    let responseData = undefined;

    try
    {
      responseData = JSON.parse(responseText);
    }
    catch (e) { }

    if (response.ok) 
    {
      return responseData as unknown as T;
    }
 
    if (responseData && responseData.failures) 
    {
      throw {
        status: response.status,
        statusText: response.statusText,
        failures: responseData.failures
      };
    }

    throw {
      status: response.status,
      statusText: typeof responseData === 'string' 
        ? responseData 
        : response.statusText
    };
  },

  getParams (params?: any): string 
  {
    if (!params) 
    {
      return '';
    }

    const pairs: string[] = [];

    for (let param in params) 
    {
      const key = encodeURIComponent(param) + '=';
      const paramValue = params[param];
      const paramValues = Array.isArray(paramValue) ? paramValue : [paramValue];
      
      for (let i = 0; i < paramValues.length; i++)
      {
        const value = this.getParamValue(paramValues[i]);
        
        if (value !== '')
        {
          pairs.push(key + encodeURIComponent(value));
        }
      }
    }

    return pairs.length === 0
      ? ''
      : '?' + pairs.join('&');
  },

  getParamValue (value?: any): string
  {
    if (value === undefined || value === null)
    {
      return '';
    }

    if (value instanceof Date)
    {
      return value.toISOString();
    }

    if (typeof value === 'object')
    {
      return JSON.stringify(value);
    }

    return value + '';
  }
};