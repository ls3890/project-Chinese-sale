using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projact.Migrations
{
    /// <inheritdoc />
    public partial class vyj : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gifts_Donators_DonatorId",
                table: "Gifts");

            migrationBuilder.RenameColumn(
                name: "DonatorName",
                table: "Gifts",
                newName: "Category");

            migrationBuilder.AlterColumn<int>(
                name: "DonatorId",
                table: "Gifts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Gifts_Donators_DonatorId",
                table: "Gifts",
                column: "DonatorId",
                principalTable: "Donators",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gifts_Donators_DonatorId",
                table: "Gifts");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "Gifts",
                newName: "DonatorName");

            migrationBuilder.AlterColumn<int>(
                name: "DonatorId",
                table: "Gifts",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Gifts_Donators_DonatorId",
                table: "Gifts",
                column: "DonatorId",
                principalTable: "Donators",
                principalColumn: "Id");
        }
    }
}
