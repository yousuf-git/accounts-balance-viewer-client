import {Reader, Row} from "./reader";
import {from, Observable} from "rxjs";
import readXlsxFile from "read-excel-file";

export class XlxsReader implements Reader {

  public read(file: File): Observable<Row[]> {
    return from(readXlsxFile(file));
  }
}
