export enum PurchaseStatus {
    Draft = 0,
    Approved = 1, // ב-C# קראת לזה Approved, כדאי שיהיה זהה
    Cancelled = 2
}

export interface PurchaseResponseDto {
    Id: number;
    GiftId: number;
    GiftName: string;
    Quantity: number;
    UnitPrice: number;
    TotalPrice: number;
    Status: PurchaseStatus;
}