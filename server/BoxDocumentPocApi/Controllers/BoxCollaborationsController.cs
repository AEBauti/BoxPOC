using Box.V2;
using Box.V2.Config;
using Box.V2.JWTAuth;
using Box.V2.Models;
using BoxDocumentPocApi.Models.Requests;
using BoxDocumentPocApi.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace BoxDocumentPocApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoxCollaborationsController : ControllerBase
    {
        private readonly BoxAppSettings _configuration;
        public BoxCollaborationsController(IOptions<BoxAppSettings> configuration)
        {
            _configuration = configuration.Value;
        }

        [HttpPost]
        public async Task<IActionResult> Create(BoxCollaborationCreate model)
        {
            var client = BuildBoxUserClient(model.UserId);
            var requestParams = new BoxCollaborationRequest()
            {
                Item = new BoxRequestEntity()
                {
                    Type = model.ItemType,
                    Id = model.ItemId
                },
                Role = model.Role,
                AccessibleBy = new BoxCollaborationUserRequest()
                {
                    Id = model.Collaborator
                },
                ExpiresAt = model.DurationTime.HasValue ? DateTime.UtcNow.AddDays(model.DurationTime.Value) : (DateTime?)null
            };
            var collab = await client.CollaborationsManager.AddCollaborationAsync(requestParams);
            return Ok(collab);
        }

        private BoxClient BuildBoxUserClient(string userId)
        {
            var config = new BoxConfig(_configuration.ClientId, _configuration.ClientSecret, _configuration.EnterpriseID, _configuration.AppAuth.PrivateKey, _configuration.AppAuth.Passphrase, _configuration.AppAuth.PublicKeyID);
            var sdk = new BoxJWTAuth(config);
            var token = sdk.UserToken(userId);
            return sdk.UserClient(token, userId);
        }
    }
}
