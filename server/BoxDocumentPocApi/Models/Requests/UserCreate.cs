using System;

namespace BoxDocumentPocApi.Models.Requests
{
    public class UserCreate
    {
        public string Name { get; set; }
        public Guid UserId { get; set; }
    }
}
