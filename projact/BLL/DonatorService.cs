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
        public async Task AddAsync(DonatorDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new Exception("שם תורם הוא שדה חובה");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new Exception("אימייל הוא שדה חובה");

            var existing = await _donatorDal.GetByEmailAsync(dto.Email);
            if (existing != null)
                throw new Exception("תורם עם אימייל זה כבר קיים");

            var donator = new Donator
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone
            };

            await _donatorDal.AddAsync(donator);
        }

        public async Task<List<Donator>> GetAllAsync()
        {
            return await _donatorDal.GetAllAsync();
        }

        public async Task<Donator?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new Exception("אימייל לא חוקי");

            return await _donatorDal.GetByEmailAsync(email);
        }

        public async Task RemoveAsync(string email)
        {
            var donator = await _donatorDal.GetByEmailAsync(email);
            if (donator == null)
                throw new Exception("תורם לא נמצא");

            await _donatorDal.RemoveAsync(donator);
        }
    }
}
