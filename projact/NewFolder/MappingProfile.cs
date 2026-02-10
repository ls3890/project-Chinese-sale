using AutoMapper;
using projact.models;
using projact.models.DTO;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Gift
        CreateMap<Gift, GiftDto>().ReverseMap();

        // Donator
        CreateMap<Donator, DonatorDto>().ReverseMap();

        // Customer
        CreateMap<User, CustomerDto>().ReverseMap();

        // Purchases
        CreateMap<Purchases, PurchasesDto>().ReverseMap();
    }
}
