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