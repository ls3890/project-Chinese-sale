export interface giftModel {
    // Support both camelCase and PascalCase
    id?: number;
    Id?: number;
    
    name: string;
    Name?: string;
    
    price: number;
    Price?: number;
    ticketCost?: number;
    TicketCost?: number;
    
    donatorId: number;
    DonatorId?: number;
    
    category: string;
    Category?: string;
    categoryId?: number;
    CategoryId?: number;
    categoryName?: string;
    CategoryName?: string;
    
    numOfCostermes?: number;
    NumOfCostermes?: number;
    purchaseCount?: number;
    PurchaseCount?: number;
    
    donatorName?: string;
    DonatorName?: string;
    donor?: string;
    Donor?: string;
    
    image?: string;
    Image?: string;
    imageUrl?: string;
    ImageUrl?: string;
}