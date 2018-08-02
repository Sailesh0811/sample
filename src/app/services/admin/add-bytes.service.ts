import { HttpserviceService } from "../httpservice.service";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
@Injectable()
export class AddBytesService {

    constructor(private httpservice: HttpserviceService) { }

    getLastUpdateDetails(): Observable<any> {
        return this.httpservice.post('admin/credit', "");
    }

    creditBytes(bytes: number) {
        this.httpservice.get('admin/credit'+'?bytes='+bytes).subscribe();
    }

}