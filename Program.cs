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

    app.MapPost("Add Designer", async (Designer designer, SketchOrganizerDb db) =>
{
    db.Designers.Add(designer);
    await db.SaveChangesAsync();

    return Results.Created($"/Sketch organizer/{designer.Id}", designer);
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








// see the record of sketch table using get function.
 app.MapGet("/Sketch organizer", async (SketchOrganizerDb db) =>
    await db.Sketches.ToListAsync());


  // insert the record in the sketch table.
    app.MapPost("Add Sketch", async (Sketch sketch, SketchOrganizerDb db) =>
{
    db.Sketches.Add(sketch);
    await db.SaveChangesAsync();

    return Results.Created($"/Sketch organizer/{sketch.Id}", sketch);
});


// put function  to update the record of table sketch.

app.MapPut("put/update Sketch", async (int id, Sketch inputsketch, SketchOrganizerDb db) =>
{
    var sketch = await db.Sketches.FindAsync(id);

    if (sketch is null) return Results.NotFound();

    sketch.sketchTitle = inputsketch.sketchTitle;


    await db.SaveChangesAsync();

    return Results.NoContent();
});


// delete the data using the id of sketch.

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



// get function of tags table.
 app.MapGet("/Tag Table", async (SketchOrganizerDb db) =>
    await db.Tags.ToListAsync());


// Add data in the Tags table.

app.MapPost("Add Tags", async (Tag tag, SketchOrganizerDb db) =>
{
db.Tags.Add(tag);
await db.SaveChangesAsync();

return Results.Created($"/Sketch organizer/{tag.id}", tag);
});

//update data in tags table.


app.MapPut("put/update Tags", async (int id, Tag inputtag, SketchOrganizerDb db) =>
{
    var tag = await db.Tags.FindAsync(id);

    if (tag is null) return Results.NotFound();

    tag.TagName = inputtag.TagName;


    await db.SaveChangesAsync();

    return Results.NoContent();
});

// delete the data using the id of tags.
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


app.Run();
