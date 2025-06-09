using Microsoft.EntityFrameworkCore;


class SketchOrganizerDb : DbContext
{
    public SketchOrganizerDb(DbContextOptions<SketchOrganizerDb> options)
     : base(options) { }
    public DbSet<Sketch> Sketches => Set<Sketch>();
    public DbSet<Designer> Designers => Set<Designer>();
     public DbSet<Tag> Tags => Set<Tag>();
}