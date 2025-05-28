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