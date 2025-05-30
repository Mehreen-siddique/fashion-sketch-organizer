public class Sketch{
    public int id { get; set; }

     
    // Add foreign key for Designer
    public int Designerid { get; set; }
    public string? sketchTitle { get; set; }

    public string? description { get; set; }
    public string? sketchCategory { get; set; }
    public string? season { get; set; }
    public string? Fabric { get; set; }
    public DateOnly sketchCreateddate { get; set; }
}