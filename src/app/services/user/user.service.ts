import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => ``
};

export interface RandomQuoteContext {
  // The quote's category: 'nerdy', 'explicit'...
  category: string;
}

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getUsers(context: RandomQuoteContext): Observable<string> {
    return this.http.get('', {})
      .pipe(
      map((res: Response) => res.json()),
      catchError(() => of({ "error": 'Service call failed' }))
      );
  }


  addUser(data: any): Observable<string> {
    return this.http.post('', data, {})
      .pipe(
      map((res: Response) => res.json()),
      catchError(() => of({ "error": 'Service call failed' }))
      );
  }

}
