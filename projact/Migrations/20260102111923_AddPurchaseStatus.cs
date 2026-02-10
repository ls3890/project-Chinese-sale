using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projact.Migrations
{
    /// <inheritdoc />
    public partial class AddPurchaseStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isconfirmed",
                table: "Purchases");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Purchases",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Purchases");

            migrationBuilder.AddColumn<bool>(
                name: "isconfirmed",
                table: "Purchases",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
