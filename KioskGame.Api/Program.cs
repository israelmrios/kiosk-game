using KioskGame.Api.Data;
using KioskGame.Api.Repositories;
using KioskGame.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GameDbContext>(options =>
    options.UseSqlite("Data Source=kioskgame.db"));

builder.Services.AddScoped<IPlayerRepository, EfPlayerRepository>();
builder.Services.AddScoped<IPlayHistoryRepository, EfPlayHistoryRepository>();
builder.Services.AddScoped<PlayerService>();
builder.Services.AddSingleton<PrizePicker>();
builder.Services.AddScoped<GameService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("Frontend");
app.MapControllers();

app.Run();
