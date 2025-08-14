import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { IHelper } from "../helper.model";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface PaginationOptions {
    sortFeild?: string,
    searchQuery?: string,
    type?: string,
    organizations?: string[],
    dateFrom?: string,
    dateTo?: string,
    services?: string[],
}

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    private apiUrl = `${environment.apiUrl}/helper`;
    constructor(private http: HttpClient) { }
    getHelpers(): Observable<{ success: boolean, data: IHelper[] }> {
        return this.http.get<{ success: boolean; data: IHelper[] }>(this.apiUrl);
    }

    getHelpersPagination(page: number, limit: number, options: PaginationOptions = {}
    ): Observable<{ success: boolean, data: IHelper[] }> {
        let params: any = { page, limit, ...options };
        if (options.organizations?.length) {
            params.organizations = options.organizations.join(',');
        }
        if (options.services?.length) {
            params.services = options.services.join(',');
        }
        let httpParams = new HttpParams({fromObject: params});
        return this.http.get<{ success: boolean, data: IHelper[] }>(`${this.apiUrl}/pagination`, {params: httpParams});
    }

    addHelper(formData: FormData): Observable<{ success: boolean, data: IHelper }> {
        return this.http.post<{ success: boolean, data: IHelper }>(this.apiUrl, formData);
    }

    deleteHelper(id: string): Observable<{ success: boolean, data: IHelper }> {
        console.log(id);

        return this.http.delete<{ success: boolean, data: IHelper }>(`${this.apiUrl}/${id}`)
    }
}