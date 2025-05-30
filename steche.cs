public class Sketch
{
    public int Id { get; set; }
  
  
    // Foreign key for Designer
    public int DesignerId { get; set; }
    public Designer? Designer { get; set; }
        public string? sketchTitle { get; set; }

    public string? description { get; set; }
    public string? sketchCategory { get; set; }
    public string? season { get; set; }
    public string? Fabric { get; set; }
    public DateOnly sketchCreateddate { get; set; }
}