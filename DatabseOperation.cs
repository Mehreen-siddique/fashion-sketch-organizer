
public class DbOperation
{
    // Database context for Entity Framework operations
    public static SketchOrganizerContext db = new SketchOrganizerContext();

    // Create a new sketch in the database
    public static Sketch CreateSketch(Sketch sketch)
    {
        db.Sketches.Add(sketch);
        db.SaveChanges();
        return sketch;
    }

    // Update an existing sketch in the database
    public static Sketch UpdateSketch(Sketch sketch)
    {
        db.Sketches.Update(sketch);
        db.SaveChanges();
        return sketch;
    }

    // Delete a sketch by its ID
    public static Sketch? DeleteSketch(int id)
    {
        var sketch = db.Sketches.Find(id);
        if (sketch != null)
        {
            db.Sketches.Remove(sketch);
            db.SaveChanges();
        }
        return sketch;
    }
   
    // Get all sketches from the database
    public static List<Sketch> GetSketches()
    {
        return db.Sketches.ToList();
    }
    
  

    // Delete a sketch by passing the sketch object
    public static Sketch DeleteSketch(Sketch sketch)
    {
        db.Sketches.Remove(sketch);
        db.SaveChanges();
        return sketch;
    }

    // Create a new designer in the database
    public static Designer CreateDesigner(Designer designer)
    {
        db.Designers.Add(designer);
        db.SaveChanges();
        return designer;
    }

    // Delete a designer by its ID
    public static Designer? DeleteDesigner(int id)
    {
        var designer = db.Designers.Find(id);
        if (designer != null)
        {
            db.Designers.Remove(designer);
            db.SaveChanges();
        }
        return designer;
    }

    // Get all designers from the database
    public static List<Designer> GetDesigners()
    {
        return db.Designers.ToList();
    }

    // Update an existing designer in the database
    public static Designer UpdateDesigner(Designer designer)
    {
        db.Designers.Update(designer);
        db.SaveChanges();
        return designer;
    }

    // Delete a designer by passing the designer object
    public static Designer DeleteDesigner(Designer designer)
    {
        db.Designers.Remove(designer);
        db.SaveChanges();
        return designer;
    }

    // Create a new tag in the database
    public static Tag CreateTag(Tag tag)
    {
        db.Tags.Add(tag);
        db.SaveChanges();
        return tag;
    }

    // Delete a tag by its ID
    public static Tag? DeleteTag(int id)
    {
        var tag = db.Tags.Find(id);
        if (tag != null)
        {
            db.Tags.Remove(tag);
            db.SaveChanges();
        }
        return tag;
    }

    // Get all tags from the database
    public static List<Tag> GetTags()
    {
        return db.Tags.ToList();
    }   

    // Update an existing tag in the database
    public static Tag UpdateTag(Tag tag)
    {
        db.Tags.Update(tag);
        db.SaveChanges();
        return tag;
    }

    // Delete a tag by passing the tag object
    public static Tag DeleteTag(Tag tag)
    {
        db.Tags.Remove(tag);
        db.SaveChanges();
        return tag;
    }

}

