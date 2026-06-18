# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY auth-service/AuthService.sln ./
COPY auth-service/src/AuthService.Api/AuthService.Api.csproj src/AuthService.Api/
COPY auth-service/src/AuthService.Application/AuthService.Application.csproj src/AuthService.Application/
COPY auth-service/src/AuthService.Domain/AuthService.Domain.csproj src/AuthService.Domain/
COPY auth-service/src/AuthService.Persistence/AuthService.Persistence.csproj src/AuthService.Persistence/

RUN dotnet restore

COPY auth-service/src/ src/

WORKDIR /src/src/AuthService.Api
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5296

ENV ASPNETCORE_URLS=http://+:5296
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "AuthService.Api.dll"]