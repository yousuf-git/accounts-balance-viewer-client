import {Observable} from "rxjs";

export type Cell = string | number | boolean | typeof Date;

export type Row = Cell[];

export interface TextReader {
  read(file: File): Observable<Row[]>
}
