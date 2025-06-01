using Microsoft.EntityFrameworkCore;

// Create a WebApplication builder
var builder = WebApplication.CreateBuilder(args);

// Register the in-memory database for SketchOrganizerDb
builder.Services.AddDbContext<SketchOrganizerDb>(opt => opt.UseInMemoryDatabase("Fashion Sketch Organizer"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Configure Swagger/OpenAPI for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "Fashion Sketch organizer";
    config.Title = "Sketchorganizer v1";
    config.Version = "v1";
});

// Build the application
var app = builder.Build();

// Enable Swagger UI in development environment
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "Fashion Sketch Organizer";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

// Root endpoint with basic info
app.MapGet("/", () => "Mehreen  siddique \n22_arid_5114 \nBSCS  \nFashion Sketch Organizer  \nImplementing CRUD operations.");

// ---------------- Designer Endpoints ----------------

// Get all designers
app.MapGet("/Designer", async (SketchOrganizerDb db) =>
    await db.Designers.ToListAsync());

// Add a new designer
app.MapPost("Add Designer", async (Designer designer, SketchOrganizerDb db) =>
{
    db.Designers.Add(designer);
    await db.SaveChangesAsync();
    return Results.Created($"/Sketch organizer/{designer.Id}", designer);
});

// Update an existing designer by id
app.MapPut("put/update data", async (int id, Designer inputdesigner, SketchOrganizerDb db) =>
{
    var designer = await db.Designers.FindAsync(id);
    if (designer is null) return Results.NotFound();
    designer.FullName = inputdesigner.FullName;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Delete a designer by id
app.MapDelete("Delete data", async (int id, SketchOrganizerDb db) =>
{
    if (await db.Designers.FindAsync(id) is Designer designer)
    {
        db.Designers.Remove(designer);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

// ---------------- Sketch Endpoints ----------------

// Get all sketches
app.MapGet("/Sketch organizer", async (SketchOrganizerDb db) =>
    await db.Sketches.ToListAsync());

// Add a new sketch
app.MapPost("Add Sketch", async (Sketch sketch, SketchOrganizerDb db) =>
{
    db.Sketches.Add(sketch);
    await db.SaveChangesAsync();
    return Results.Created($"/Sketch organizer/{sketch.Id}", sketch);
});

// Update an existing sketch by id
app.MapPut("put/update Sketch", async (int id, Sketch inputsketch, SketchOrganizerDb db) =>
{
    var sketch = await db.Sketches.FindAsync(id);
    if (sketch is null) return Results.NotFound();
    sketch.sketchTitle = inputsketch.sketchTitle;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Delete a sketch by id
app.MapDelete("Delete Sketch", async (int id, SketchOrganizerDb db) =>
{
    if (await db.Sketches.FindAsync(id) is Sketch sketch)
    {
        db.Sketches.Remove(sketch);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

// ---------------- Tag Endpoints ----------------

// Get all tags
app.MapGet("/Tag Table", async (SketchOrganizerDb db) =>
    await db.Tags.ToListAsync());

// Add a new tag
app.MapPost("Add Tags", async (Tag tag, SketchOrganizerDb db) =>
{
    db.Tags.Add(tag);
    await db.SaveChangesAsync();
    return Results.Created($"/Sketch organizer/{tag.id}", tag);
});

// Update an existing tag by id
app.MapPut("put/update Tags", async (int id, Tag inputtag, SketchOrganizerDb db) =>
{
    var tag = await db.Tags.FindAsync(id);
    if (tag is null) return Results.NotFound();
    tag.TagName = inputtag.TagName;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Delete a tag by id
app.MapDelete("Delete Tags", async (int id, SketchOrganizerDb db) =>
{
    if (await db.Tags.FindAsync(id) is Tag tag)
    {
        db.Tags.Remove(tag);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

// Run the application
app.Run();
