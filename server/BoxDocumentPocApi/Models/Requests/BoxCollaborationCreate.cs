namespace BoxDocumentPocApi.Models.Requests
{
    public class BoxCollaborationCreate
    {
        public string UserId { get; set; }
        public BoxType ItemType { get; set; }
        public string ItemId { get; set; }
        public string Collaborator { get; set; }
        public string Role { get; set; }
        public int? DurationTime { get; set; }
    }
}
