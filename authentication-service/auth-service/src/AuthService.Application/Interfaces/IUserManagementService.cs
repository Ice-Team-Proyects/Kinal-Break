using AuthService.Application.DTOs;

namespace AuthService.Application.Interfaces;

public interface IUserManagementService
{
    Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName);
    Task<IReadOnlyList<string>> GetUserRolesAsync(string userId);
    Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName);
    Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto> ActivateUserAsync(string userId);
    Task<UserResponseDto> DenyUserAsync(string userId);
    Task<UserResponseDto> BlockUserAsync(string userId);
    Task<UserResponseDto> UnblockUserAsync(string userId);
}
