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

app.MapGet("/todoitems", async (SketchOrganizerDb db) =>
    await db.Sketches.ToListAsync());


    app.MapPost("/todoitems", async (Sketch sketch, SketchOrganizerDb db) =>
{
    db.Sketches.Add(sketch);
    await db.SaveChangesAsync();

    return Results.Created($"/todoitems/{sketch.id}", sketch);
});

app.MapGet("/", () => "Mehreen  siddique \n22_arid_5114 \nBSCS");

app.Run();
