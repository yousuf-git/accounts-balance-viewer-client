import {Row, TextReader} from "./reader";
import {from, Observable} from "rxjs";
import readXlsxFile from "read-excel-file";

export class XlxsReader implements TextReader {
  read(file: File): Observable<Row[]> {
    return from(readXlsxFile(file));
  }
}
