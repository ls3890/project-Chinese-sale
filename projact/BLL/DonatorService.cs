using projact.DAL;
using projact.models;
using projact.models.DTO;

namespace projact.BLL
{
    public class DonatorService : IDonatorService
    {
        private readonly IDonatorDal _donatorDal;

        public DonatorService(IDonatorDal donatorDal)
        {
            _donatorDal = donatorDal;
        }

        // הוספת תורם
        public async Task AddDonatorAsync(DonatorDto donatorDto)
        {
            if (string.IsNullOrWhiteSpace(donatorDto.Name))
                throw new Exception("שם תורם הוא שדה חובה");

            if (string.IsNullOrWhiteSpace(donatorDto.Email))
                throw new Exception("אימייל הוא שדה חובה");

            var existing = await _donatorDal.GetByEmailDonatorAsync(donatorDto.Email);
            if (existing != null)
                throw new Exception("תורם עם אימייל זה כבר קיים");

            var donator = new Donator
            {
                Name = donatorDto.Name,
                Email = donatorDto.Email,
                Phone = donatorDto.Phone
            };

            await _donatorDal.AddDonatorAsync(donator);
        }

        public async Task<List<Donator>> GetAllDonatorAsync()
        {
            return await _donatorDal.GetAllDonatorAsync();
        }

        public async Task<Donator?> GetByEmailDonatorAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new Exception("אימייל לא חוקי");

            return await _donatorDal.GetByEmailDonatorAsync(email);
        }

        public async Task RemoveDonatorAsync(string email)
        {
            var donator = await _donatorDal.GetByEmailDonatorAsync(email);
            if (donator == null)
                throw new Exception("תורם לא נמצא");

            await _donatorDal.RemoveDonatorAsync(donator);
        }
    }
}
