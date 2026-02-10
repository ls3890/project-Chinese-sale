export interface Donator {
    Id?: number;
    id?: number; // הוספה ליתר ביטחון
    Name: string;
    Email: string;
    Phone?: string; // סימן השאלה אומר שהשדה אופציונלי
    Gifts?: any[];
}