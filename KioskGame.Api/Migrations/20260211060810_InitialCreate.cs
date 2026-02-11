using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KioskGame.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    PlaysRemaining = table.Column<int>(type: "INTEGER", nullable: false),
                    LastPlayDate = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    SessionStartedAtUtc = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    SessionExpiresAtUtc = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    HasWonGift = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlayHistory",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PlayerId = table.Column<string>(type: "TEXT", nullable: false),
                    PlayedAtUtc = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    PrizeId = table.Column<string>(type: "TEXT", nullable: false),
                    PrizeName = table.Column<string>(type: "TEXT", nullable: false),
                    IsWin = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayHistory", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "PlayHistory");
        }
    }
}
