import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Hero } from "./hero";
import { Observable } from "rxjs";
import { of } from "rxjs/observable/of";
import { MessageService } from "./message.service";
import { catchError, map, tap } from 'rxjs/operators';


@Injectable()
export class HeroService {
  private heroesUrl = '/api/heroes';
  // private headers = new Headers({ 'Content-Type': 'application/json' });
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private messageService: MessageService,
    private http: HttpClient

  ) { }

  getHeroes(): Observable<Hero[]> {
    // this.messageService.add('HeroService: fetched heroes')
    // return of(HEROES);

    return this.http.get<Hero[]>(this.heroesUrl).pipe(tap(heroes => this.log(`fetched heroes`)), catchError(this.handleError('getHeroes', [])));
  }
  getHero(id): Observable<Hero> {
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(HEROES.find(hero => hero.id === id));
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(tap(_ => this.log(`fetched hero id=${id}`)), catchError(this.handleError<Hero>(`getHero id=${id}`)))
  }
  updateHero(hero: Hero): Observable<any> {

    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))

    )
  }
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero')))
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`delete Hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`)
      .pipe(tap(_ => this.log(`found heroes matching "${term}"`)), catchError(this.handleError<Hero[]>('searchHeroes', [])))
  }
  private log(message: string) {
    this.messageService.add(`HeroService:${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed:${error.message}`);
      return of(result as T);
    }
  }

}
