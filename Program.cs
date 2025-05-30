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

app.MapGet("/", () => "Mehreen  siddique \n22_arid_5114 \nBSCS");

// add the record of designer table.

app.MapGet("/Designer", async (SketchOrganizerDb db) =>
    await db.Designers.ToListAsync());


  // insert the record in the Designer table.
app.MapPost("Add Data", async (Sketch sketch, SketchOrganizerDb db) =>
{
    if (!await db.Designers.AnyAsync(d => d.id == sketch.Designerid))
    {
        return Results.BadRequest("Invalid Designerid");
    }
    db.Sketches.Add(sketch);
    await db.SaveChangesAsync();
    return Results.Created($"/Sketch organizer/{sketch.id}", sketch);
});




// put function  to update the record of table sketch.

app.MapPut("put/update data", async (int id, Designer inputdesigner, SketchOrganizerDb db) =>
{
    var designer = await db.Designers.FindAsync(id);

    if (designer is null) return Results.NotFound();

    designer.FullName = inputdesigner.FullName;


    await db.SaveChangesAsync();

    return Results.NoContent();
});

// delete the data using the id of designer.

app.MapDelete("Delete Record", async (int id, SketchOrganizerDb db) =>
{
    if (await db.Designers.FindAsync(id) is Designer designer)
    {
        db.Designers.Remove(designer);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
}); 








// see the record of sketch table using get function.
 app.MapGet("/Sketch organizer", async (SketchOrganizerDb db) =>
    await db.Sketches.ToListAsync());


  // insert the record in the sketch table.
    app.MapPost("Add Record", async (Sketch sketch, SketchOrganizerDb db) =>
{
    db.Sketches.Add(sketch);
    await db.SaveChangesAsync();

    return Results.Created($"/Sketch organizer/{sketch.id}", sketch);
});


// put function  to update the record of table sketch.

app.MapPut("put/update Record", async (int id, Sketch inputsketch, SketchOrganizerDb db) =>
{
    var sketch = await db.Sketches.FindAsync(id);

    if (sketch is null) return Results.NotFound();

    sketch.sketchTitle = inputsketch.sketchTitle;


    await db.SaveChangesAsync();

    return Results.NoContent();
});


// delete the data using the id of sketch.

app.MapDelete("Delete", async (int id, SketchOrganizerDb db) =>
{
    if (await db.Sketches.FindAsync(id) is Sketch sketch)
    {
        db.Sketches.Remove(sketch);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
}); 




app.Run();
