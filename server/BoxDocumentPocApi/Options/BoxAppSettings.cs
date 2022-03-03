namespace BoxDocumentPocApi.Options
{
    public class BoxAppSettings
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string EnterpriseID { get; set; }
        public BoxAppSettingsAppAuth AppAuth { get; set; }
    }

    public class BoxAppSettingsAppAuth
    {
        public string PublicKeyID { get; set; }
        public string PrivateKey { get; set; }
        public string Passphrase { get; set; }
    }
}
