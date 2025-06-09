using Microsoft.EntityFrameworkCore;

public class SketchOrganizerContext : DbContext
{
    public DbSet<Sketch> Sketches { get; set; }
    public DbSet<Designer> Designers { get; set; }
      public DbSet<Tag> Tags { get; set; }

    public string DbPath { get; }

    public SketchOrganizerContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = Path.Join(path, "SketchOrganizer.db");
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}