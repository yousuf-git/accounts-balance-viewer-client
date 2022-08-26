import {Reader, Row} from "./reader";
import {Observable} from "rxjs";

export class TsvReader implements Reader {
  public read(file: File): Observable<Row[]> {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Observable<Row[]>(subscriber => {
      reader.onload = e => {
        let rawText = e.target!.result as string;
        rawText = rawText.trim();
        const rows = rawText.split('\n');
        const matrix = rows.map(value => value.split('\t'))

        const parsedMatrix: Row[] = [];

        for (const row of matrix) {
          if (row.length === 0) continue;

          const newRow: Row = [];

          for (let cell of row) {
            newRow.push(this.castToPrimitive(cell));
          }

          parsedMatrix.push(newRow);
        }

        subscriber.next(parsedMatrix);
        subscriber.complete();
      }
    });
  }

  private castToPrimitive(s: string): string | number | boolean {
    if (isNaN(+s) === false) {
      return Number(s);
    } else if (s === 'true') {
      return true;
    } else if (s === 'false') {
      return false;
    } else {
      return s;
    }
  }
}
