using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<SketchOrganizerDb>(opt => opt.UseInMemoryDatabase("Fashion Sketch Organizer"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// configure swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "Fashion Sketch organizer";
    config.Title = "Sketchorganizer v1";
    config.Version = "v1";
});


//swagger install
var app = builder.Build();

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

app.MapGet("/Sketch organizer", async (SketchOrganizerDb db) =>
    await db.Sketches.ToListAsync());


    app.MapPost("Sketch organizer", async (Sketch sketch, SketchOrganizerDb db) =>
{
    db.Sketches.Add(sketch);
    await db.SaveChangesAsync();

    return Results.Created($"/Sketch organizer/{sketch.id}", sketch);
});


// put function 

app.MapPut("/put/update/{id}", async (int id, Sketch inputsketch, SketchOrganizerDb db) =>
{
    var sketch = await db.Sketches.FindAsync(id);

    if (sketch is null) return Results.NotFound();

    sketch.s_Title = inputsketch.s_Title;


    await db.SaveChangesAsync();

    return Results.NoContent();
});


// delete the data using the delete function.

app.MapDelete("/Delete/{id}", async (int id, SketchOrganizerDb db) =>
{
    if (await db.Sketches.FindAsync(id) is Sketch sketch)
    {
        db.Sketches.Remove(sketch);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});


app.MapGet("/", () => "Mehreen  siddique \n22_arid_5114 \nBSCS");

app.Run();
