var builder = WebApplication.CreateBuilder(args);


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    // Configure OpenAPI document details
    config.DocumentName = "SketchOrganizer";
    config.Title = "SketchOrganizer v1";
    config.Version = "v1";
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        // Configure Swagger UI appearance and paths
        config.DocumentTitle = "SketchOrganizer API";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}


app.MapGet("/", () => "Hello World!");

// Map endpoints for Sketch CRUD operations
app.MapPost("/sketches", (Sketch sketch) => DbOperation.CreateSketch(sketch));
app.MapGet("/Getsketches/{id}", (int id) => DbOperation.GetSketches());

app.MapPut("/Updatesketches", (Sketch sketch) => DbOperation.UpdateSketch(sketch));
app.MapDelete("/Deletesketches/{id}", (int id) => DbOperation.DeleteSketch(id));
 

// Map endpoints for Designer CRUD operations
app.MapPost("/designers", (Designer designer) => DbOperation.CreateDesigner(designer)); 
app.MapGet("/Getdesigners/{id}", (int id) => DbOperation.GetDesigners()); 
app.MapPut("/Updatedesigners", (Designer designer) => DbOperation.UpdateDesigner(designer)); 
app.MapDelete("/Deletedesigners/{id}", (int id) => DbOperation.DeleteDesigner(id)); 

// Map endpoints for Tag CRUD operations
app.MapPost("/tags", (Tag tag) => DbOperation.CreateTag(tag)); 
app.MapGet("/Gettags/{id}", (int id) => DbOperation.GetTags());
app.MapPut("/Updatetags", (Tag tag) => DbOperation.UpdateTag(tag));
app.MapDelete("/Deletetags/{id}", (int id) => DbOperation.DeleteTag(id)); 




app.Run();
