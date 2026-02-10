using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace projact.Migrations
{
    /// <inheritdoc />
    public partial class InitalCreateAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "phone",
                table: "Donators",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Donators",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Donators",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Donators",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "DonatorId",
                table: "Gifts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Gifts_DonatorId",
                table: "Gifts",
                column: "DonatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Gifts_Donators_DonatorId",
                table: "Gifts",
                column: "DonatorId",
                principalTable: "Donators",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gifts_Donators_DonatorId",
                table: "Gifts");

            migrationBuilder.DropIndex(
                name: "IX_Gifts_DonatorId",
                table: "Gifts");

            migrationBuilder.DropColumn(
                name: "DonatorId",
                table: "Gifts");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Donators",
                newName: "phone");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Donators",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Donators",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Donators",
                newName: "id");
        }
    }
}
