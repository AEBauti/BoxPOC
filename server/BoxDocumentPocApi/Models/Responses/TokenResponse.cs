using System;

namespace BoxDocumentPocApi.Models.Responses
{
    public class TokenResponse
    {
        public string Token { get; set; }
        public string Id { get; set; }
        public DateTime Expires { get; set; }
    }
}
