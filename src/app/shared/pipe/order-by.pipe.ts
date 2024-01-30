import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "orderBy"
})
export class OrderByPipe implements PipeTransform {
  transform(array: Array<any>, field: string, sort: string = 'asc'): any[] {
    if (!array) return;
    const tempList = array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else if (a[field] === b[field]) {
        return 0;
      }
      return 1;
    });
    return (sort === 'asc') ? tempList : tempList.reverse();
  }
}

