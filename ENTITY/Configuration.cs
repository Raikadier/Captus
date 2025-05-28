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