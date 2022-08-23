import {Row, TextReader} from "./reader";
import {Observable} from "rxjs";

export class TsvReader implements TextReader {
  read(file: File): Observable<Row[]> {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Observable<Row[]>(subscriber => {
      reader.onload = e => {
        const rawText = e.target!.result as string;
        const rows = rawText.split('\n');
        const matrix = rows.map(value => value.split('\t'))

        subscriber.next(matrix);
        subscriber.complete();
      }
    });
  }
}
