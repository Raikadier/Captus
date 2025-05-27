using System;

namespace ENTITY
{
    public static class Configuration
    {
        public static string ConnectionString { get; } = "Server=.\\SQLEXPRESS;Database=Captus;Trusted_Connection=True;";
        // Clave de API para OpenRouter (debe ser configurada por el usuario)
        public static string OpenRouterKey { get; set; } = "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";
    }
} 