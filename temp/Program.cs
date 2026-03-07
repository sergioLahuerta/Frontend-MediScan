using Microsoft.EntityFrameworkCore;
using FamilyAffairAPI.Data;
using FamilyAffairAPI.Repositories;
using FamilyAffairAPI.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();

// CORS
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(builder => {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// 1. Configurar la conexión a SQL Server (Docker o Local)
// Extraemos la cadena de conexión desde appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<MyDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Registrar Repositorios y Servicios
// Esto permite que el Controller pueda usar el Service y el Service el Repository
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IChatService, ChatService>();
// 3. Configurar Controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Configurar el pipeline de HTTP (Swagger solo en desarrollo)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Importante para entornos locales
app.UseHttpsRedirection();
app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();