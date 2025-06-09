
public class Tag
{
    
    public int id { get; set; }
    public string? TagName { get; set; }
    // Foreign key for Sketch
    public int SketchId { get; set; }
}