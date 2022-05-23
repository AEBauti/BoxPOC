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
            var client = await BuildBoxUserClient(model.UserId);
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
                CanViewPath = model.ItemType == BoxType.folder,
                ExpiresAt = model.DurationTime.HasValue ? DateTime.UtcNow.AddDays(model.DurationTime.Value) : (DateTime?)null
            };

            var collab = await client.CollaborationsManager.AddCollaborationAsync(requestParams);

            //requestParams = new BoxCollaborationRequest()
            //{
            //    Id = collab.Id,
            //    CanViewPath = true,
            //};
            //collab = await client.CollaborationsManager.EditCollaborationAsync(requestParams);
            return Ok(collab);
        }

        [HttpPost("{folderId}")]
        public async Task<IActionResult> Get(string folderId, BoxCollaborationCreate model)
        {
            var client = await BuildBoxUserClient(model.UserId); 
            BoxCollection<BoxItem> folderItems = await client.FoldersManager.GetFolderItemsAsync(folderId, 100);
            return Ok(folderItems);
        }

        private async Task<BoxClient> BuildBoxUserClient(string userId)
        {
            var config = new BoxConfig(_configuration.ClientId, _configuration.ClientSecret, _configuration.EnterpriseID, _configuration.AppAuth.PrivateKey, _configuration.AppAuth.Passphrase, _configuration.AppAuth.PublicKeyID);
            var sdk = new BoxJWTAuth(config);
            var token = await sdk.UserTokenAsync(userId);
            return sdk.UserClient(token, userId);
        }
    }
}
