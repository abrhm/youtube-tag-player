import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagName',
  pure: true,
})
export class TagNamePipe implements PipeTransform {
  transform(tagId: number, tagList: string[] | null): string {
    return tagList ? tagList[tagId] : '';
  }
}
