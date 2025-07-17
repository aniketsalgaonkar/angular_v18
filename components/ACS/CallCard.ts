import { Injectable } from "@angular/core";

@Injectable()
export class CallCard
{
    constructor()
    {

    }
    render()
    {
        debugger;
        return `<p-dialog header="Title" [(visible)]="display">
                    Content
                </p-dialog>`
    }
}