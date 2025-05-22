using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BLL
{
    public class ChatGPTService
    {
        private readonly string _apiKey;
        private readonly HttpClient _httpClient;
        private const string API_URL = "https://api.openai.com/v1/chat/completions";

        public ChatGPTService(string apiKey)
        {
            _apiKey = apiKey;
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<string> GetResponseAsync(string prompt)
        {
            int maxRetries = 5;
            int baseDelay = 2000; // 2 segundos

            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    var requestBody = new
                    {
                        model = "gpt-3.5-turbo",
                        messages = new[]
                        {
                            new { role = "user", content = prompt }
                        }
                    };

                    var content = new StringContent(
                        JsonSerializer.Serialize(requestBody),
                        Encoding.UTF8,
                        "application/json"
                    );

                    var response = await _httpClient.PostAsync(API_URL, content);

                    if (response.StatusCode == (System.Net.HttpStatusCode)429) // Too Many Requests
                    {
                        if (i < maxRetries - 1)
                        {
                            int delay = baseDelay * (int)Math.Pow(2, i);
                            System.Threading.Tasks.Task.Delay(delay).Wait(); // Esperar exponencialmente
                            continue; // Reintentar
                        }
                        else
                        {
                            return "Error: Demasiadas solicitudes a la API de ChatGPT. Inténtalo de nuevo más tarde.";
                        }
                    }

                    response.EnsureSuccessStatusCode(); // Lanza excepción para otros errores HTTP

                    var responseBody = await response.Content.ReadAsStringAsync();
                    var responseObject = JsonSerializer.Deserialize<ChatGPTResponse>(responseBody);

                    return responseObject?.Choices[0]?.Message?.Content ?? "No se pudo obtener una respuesta.";
                }
                catch (HttpRequestException httpEx)
                {
                     if (i < maxRetries - 1) // Puedes agregar lógica de reintento para ciertos errores HTTP si es necesario
                     {
                         // Por ahora, solo reintentamos en caso de 429
                         // Podrías agregar manejo específico para otros códigos aquí
                     }
                     else
                     {
                          return $"Error HTTP al comunicarse con ChatGPT: {httpEx.Message}";
                     }
                }
                catch (Exception ex)
                {
                    // Si ocurre otro tipo de error, no reintentamos (o podrías agregar lógica para errores específicos)
                    return $"Error al comunicarse con ChatGPT: {ex.Message}";
                }
            }

            return "Error desconocido al comunicarse con ChatGPT después de varios reintentos.";
        }
    }

    public class ChatGPTResponse
    {
        public Choice[] Choices { get; set; }
    }

    public class Choice
    {
        public Message Message { get; set; }
    }

    public class Message
    {
        public string Content { get; set; }
    }
} 