import { HttpClient } from "@angular/common/http";
import { ServerDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/lib/data-source/server/server-source.conf";
import { Observable } from "rxjs";

export class PostServerDataSource extends ServerDataSource {

    body: any;
    
    constructor(protected http: HttpClient, conf?: ServerSourceConf | {}, body?: any) {
        super(http, conf);
        this.body = body;
    }

    protected requestElements(): Observable<any> {
        let httpParams = this.createRequesParams();
        return this.http.post(this.conf.endPoint, this.body, {params: httpParams, observe: 'response'});
    }

}