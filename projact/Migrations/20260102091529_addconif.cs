using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projact.Migrations
{
    /// <inheritdoc />
    public partial class addconif : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isconfirmed",
                table: "Purchases",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isconfirmed",
                table: "Purchases");
        }
    }
}
