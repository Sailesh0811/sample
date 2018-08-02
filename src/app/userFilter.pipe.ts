import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {
    transform(users: any[], searchText: string): any[] {
        console.log(searchText);
        console.log(users);
        if (!users) {
            return [];
        }
        if (!searchText) {
            return users.filter(it => {
                return  users;
            });
        } else if (searchText) {

            searchText = searchText.toLowerCase();
            return users.filter(it => {
                let temp = it.firstName + ' ' + it.lastName;
                return temp.toLowerCase().includes(searchText);
                
            });
        }
    }
}
