import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
   transform(items: any[], searchText: string, filter: number): any[] {
       
       console.log(searchText);
       console.log(filter);
       console.log(items);
       if (!searchText && filter === 100) {
           console.log(1);

           return items.filter(it => {
               return items;
           });
       }
       if (!items) {
           return [];
       }
       if (!searchText) {
           console.log(3);

           return items.filter(it => {
               return  (it.categoryId === filter);
           });
       } else if (searchText && filter === 100) {
           console.log(4);

           searchText = searchText.toLowerCase();
           return items.filter(it => {
               console.log(it.categoryId);
               return it.name.toLowerCase().includes(searchText.toLowerCase());
           });
       } else {
           return items.filter(it => {
               console.log(it.categoryId);
               return it.name.toLowerCase().includes(searchText.toLowerCase()) && (it.categoryId === filter) ;
           });
       }
   }
}