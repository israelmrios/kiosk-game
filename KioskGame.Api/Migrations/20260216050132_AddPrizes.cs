using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KioskGame.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPrizes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PlayHistory",
                table: "PlayHistory");

            migrationBuilder.RenameTable(
                name: "PlayHistory",
                newName: "PlayHistories");

            migrationBuilder.AlterColumn<int>(
                name: "PrizeId",
                table: "PlayHistories",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "PrizeCode",
                table: "PlayHistories",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlayHistories",
                table: "PlayHistories",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Prizes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Code = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Weight = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prizes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Prizes_Code",
                table: "Prizes",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Prizes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlayHistories",
                table: "PlayHistories");

            migrationBuilder.DropColumn(
                name: "PrizeCode",
                table: "PlayHistories");

            migrationBuilder.RenameTable(
                name: "PlayHistories",
                newName: "PlayHistory");

            migrationBuilder.AlterColumn<string>(
                name: "PrizeId",
                table: "PlayHistory",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlayHistory",
                table: "PlayHistory",
                column: "Id");
        }
    }
}
