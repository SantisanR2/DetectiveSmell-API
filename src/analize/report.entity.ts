export class Report {
    constructor() {
        this.id = 0;
        this.name = '';
        this.description = '';
        this.example = '';
        this.severity = '';
        this.message = '';
        this.line = 0;
        this.path = '';
        this.absolutePath = '';
    }
    id: number;
    name: string;
    description: string;
    example: string;
    severity: string;
    message: string;
    line: number;
    path: string;
    absolutePath: string;
}