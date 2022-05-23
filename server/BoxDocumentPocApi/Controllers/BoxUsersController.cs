using Box.V2;
using Box.V2.Auth.Token;
using Box.V2.Config;
using Box.V2.JWTAuth;
using Box.V2.Models;
using BoxDocumentPocApi.Models.Requests;
using BoxDocumentPocApi.Models.Responses;
using BoxDocumentPocApi.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BoxDocumentPocApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoxUsersController : ControllerBase
    {
        private readonly BoxAppSettings _configuration;

        public BoxUsersController(IOptions<BoxAppSettings> configuration)
        {
            _configuration = configuration.Value;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var client = await BuildBoxAdminClient();
            var users = await client.UsersManager.GetEnterpriseUsersAsync(fields: new List<string>{ "name", "login", "notification_email", "external_app_user_id" });

            return Ok(users.Entries);
        }

        [HttpGet("{userId}/token")]
        public async Task<IActionResult> Login(Guid userId)
        {
            var config = new BoxConfig(_configuration.ClientId, _configuration.ClientSecret, _configuration.EnterpriseID, _configuration.AppAuth.PrivateKey, _configuration.AppAuth.Passphrase, _configuration.AppAuth.PublicKeyID);
            var sdk = new BoxJWTAuth(config);
            var token = await sdk.AdminTokenAsync();
            var client = sdk.AdminClient(token);

            var users = await client.UsersManager.GetEnterpriseUsersAsync(externalAppUserId: userId.ToString());
            BoxUser user;
            if (users.TotalCount != 0)
            {
                user = users.Entries[0];
            }
            else
            {
                var userRequest = new BoxUserRequest()
                {
                    Name = "Test Name",
                    ExternalAppUserId = userId.ToString(),
                    IsPlatformAccessOnly = true,
                };

                user = await client.UsersManager.CreateEnterpriseUserAsync(userRequest);
            }
            var userToken = await sdk.UserTokenAsync(user.Id);

            var exchanger = new TokenExchange(userToken, new[] { "base_explorer", /*"item_download",*/ "item_delete", "item_upload" });
            var downscopedToken = await exchanger.ExchangeAsync();

            var response = new TokenResponse
            {
                Token = downscopedToken,
                Expires = DateTime.UtcNow.AddMinutes(60),
                Id = user.Id
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserCreate model)
        {
            var client = await BuildBoxAdminClient();

            var userId = model.UserId.ToString();
            var users = await client.UsersManager.GetEnterpriseUsersAsync(externalAppUserId: userId);

            if (users.TotalCount > 0)
            {
                return BadRequest("User already exists");
            }
            var userRequest = new BoxUserRequest()
            {
                Name = model.Name,
                ExternalAppUserId = userId,
                IsPlatformAccessOnly = true,
            };

            var user = await client.UsersManager.CreateEnterpriseUserAsync(userRequest);
            return Ok(user);
        }

        private async Task<BoxClient> BuildBoxAdminClient()
        {
            var config = new BoxConfig(_configuration.ClientId, _configuration.ClientSecret, _configuration.EnterpriseID, _configuration.AppAuth.PrivateKey, _configuration.AppAuth.Passphrase, _configuration.AppAuth.PublicKeyID);
            var sdk = new BoxJWTAuth(config);
            var token = await sdk.AdminTokenAsync();
            return sdk.AdminClient(token);
        }
    }
}
