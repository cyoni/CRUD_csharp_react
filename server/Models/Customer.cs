using Common;
using System.ComponentModel.DataAnnotations;

namespace Modals
{
    public class Customer
    {
        [Required(ErrorMessage = "User Id is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Invalid id value.")]
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }


        public bool IsValid
        {
            get
            {
                return Id >= 0
                    && FirstName != null
                    && LastName != null
                    && Phone != null
                    && Email != null
                    && Tools.IsValidEmail(Email);
            }
        }
    }
}