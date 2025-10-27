using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext with SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Create database if it doesn't exist and apply migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
    
    // Migrate existing teachers to add ClassID if missing
    await MigrateExistingTeachers(dbContext);
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Migration function to add ClassID to existing teachers
async Task MigrateExistingTeachers(ApplicationDbContext context)
{
    try
    {
        // Get all teachers that don't have a ClassID
        var teachersWithoutClassId = await context.Teachers
            .Where(t => string.IsNullOrEmpty(t.ClassID))
            .ToListAsync();

        foreach (var teacher in teachersWithoutClassId)
        {
            // Generate a unique ClassID
            string classId;
            bool isUnique;
            
            do
            {
                var random = new Random();
                classId = random.Next(10000000, 99999999).ToString();
                isUnique = !await context.Teachers.AnyAsync(t => t.ClassID == classId);
            } while (!isUnique);
            
            teacher.ClassID = classId;
        }

        if (teachersWithoutClassId.Any())
        {
            await context.SaveChangesAsync();
            Console.WriteLine($"Migrated {teachersWithoutClassId.Count} teachers with new ClassIDs");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error migrating teachers: {ex.Message}");
    }
}

app.Run();

