using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Net.Http.Headers;


namespace BLL
{
    public class AIService
    {

        private readonly string _apiKey;
        private static readonly HttpClient _httpClient;
        private const string API_URL = "https://openrouter.ai/api/v1/chat/completions";

        static AIService()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://github.com/CaptusGUI");
            _httpClient.DefaultRequestHeaders.Add("X-Title", "CaptusGUI");
        }

        public AIService(string apiKey)
        {
            _apiKey = apiKey;
        }

        public async Task<string> GetResponseAsync(string prompt)
        {
            try
            {
                var requestBody = new
                {
                    model = "deepseek/deepseek-chat-v3-0324:free",
                    messages = new[]
                    {
                        new { role = "system", content = "Eres un asistente útil que responde preguntas generales y conversa amigablemente en español. Si la pregunta no es un comando específico de tareas, responde de forma natural." },
                        new { role = "user", content = prompt }
                    },
                    max_tokens = 500,
                    temperature = 0.2
                };

                var bodyJson = JsonSerializer.Serialize(requestBody);
                
                HttpRequestMessage request = null;
                try
                {
                    request = new HttpRequestMessage(HttpMethod.Post, API_URL);
                    request.Content = new StringContent(bodyJson, Encoding.UTF8, "application/json");
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

                    var response = await _httpClient.SendAsync(request);
                    var responseString = await response.Content.ReadAsStringAsync();

                    if (!response.IsSuccessStatusCode)
                    {
                        var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(responseString);
                        return $"Error en la API: {errorResponse?.Error?.Message ?? responseString}";
                    }

                    var responseJson = JsonSerializer.Deserialize<JsonElement>(responseString);
                    string reply = responseJson.GetProperty("choices")[0]
                                             .GetProperty("message")
                                             .GetProperty("content")
                                             .GetString();

                    return reply ?? "No se pudo obtener una respuesta.";
                }
                finally
                {
                    request?.Dispose();
                }
            }
            catch (HttpRequestException ex)
            {
                return $"Error de conexión: {ex.Message}";
            }
            catch (JsonException ex)
            {
                return $"Error al procesar la respuesta: {ex.Message}";
            }
            catch (Exception ex)
            {
                return $"Error inesperado: {ex.Message}";
            }
        }
    }

    public class ErrorResponse
    {
        public ErrorInfo Error { get; set; }
    }

    public class ErrorInfo
    {
        public string Message { get; set; }
        public string Type { get; set; }
        public string Code { get; set; }
    }
} 