import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IHelper } from "../helper.model";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class HelperService{
    private apiUrl = `${environment.apiUrl}/helper`;
    constructor(private http : HttpClient){}

    getHelpers(): Observable<{ success: boolean, data: IHelper[] }>{
        return this.http.get<{ success: boolean; data: IHelper[] }>(this.apiUrl);
    }

    addHelper(formData : FormData): Observable<{success: boolean, data: IHelper}>{
        return this.http.post<{success: boolean, data: IHelper}>(this.apiUrl, formData);
    }

    deleteHelper(id: string): Observable<{success: boolean, data: IHelper}>{
        console.log(id);
    
        return this.http.delete<{success: boolean, data: IHelper}>(`${this.apiUrl}/${id}`)
    }
}