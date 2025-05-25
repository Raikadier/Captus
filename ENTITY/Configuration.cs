using System;

namespace ENTITY
{
    public static class Configuration
    {
        public static string ConnectionString { get; } = "Server=.\\SQLEXPRESS;Database=Captus;Trusted_Connection=True;";
        // Clave de API para OpenRouter (debe ser configurada por el usuario)
        public static string OpenRouterKey { get; set; } = "AQUÍ_TU_API_KEY";
    }
} 