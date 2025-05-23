using Microsoft.EntityFrameworkCore;


class SketchOrganizerDb : DbContext
{
    public SketchOrganizerDb(DbContextOptions<SketchOrganizerDb> options)
     : base(options) { }
    public DbSet<Sketch> Sketches => Set<Sketch>();
    public DbSet<User> Users => Set<User>();
     public DbSet<Tag> Tags => Set<Tag>();
}