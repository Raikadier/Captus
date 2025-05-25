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
                // Detectar si es comando especial
                bool isCaptusCommand = prompt.TrimStart().StartsWith("@Captus", StringComparison.OrdinalIgnoreCase);
                string systemPrompt = isCaptusCommand
                    ? "Eres un asistente para gestión de tareas y notas. Si el mensaje inicia con '@Captus', analiza el mensaje y, si detectas intención de crear, eliminar, actualizar o consultar una tarea, responde SOLO con un JSON con los campos: { \"accion\": \"crear_tarea|eliminar_tarea|actualizar_tarea|consultar_tareas\", \"titulo\": \"...\", \"fecha\": \"...\", \"prioridad\": \"...\", \"categoria\": \"...\" }. Si falta algún dato, ponlo como null. Si no es una acción válida, responde con { \"accion\": \"desconocida\" }. Responde solo con el JSON, sin explicaciones. Siempre responde en español."
                    : "Eres un asistente amigable y profesional para estudiantes universitarios. Responde de forma clara, útil y conversacional a cualquier pregunta o mensaje que no sea un comando especial. Siempre responde en español.";

                var requestBody = new
                {
                    model = "deepseek/deepseek-chat-v3-0324:free",
                    messages = new[]
                    {
                        new { role = "system", content = systemPrompt },
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

                    // Optimización: Si es comando, intenta extraer JSON rápidamente
                    if (isCaptusCommand && !string.IsNullOrWhiteSpace(reply))
                    {
                        int start = reply.IndexOf('{');
                        int end = reply.LastIndexOf('}');
                        if (start >= 0 && end > start)
                        {
                            string possibleJson = reply.Substring(start, end - start + 1);
                            // Validar si es JSON válido
                            try
                            {
                                JsonDocument.Parse(possibleJson);
                                return possibleJson;
                            }
                            catch { /* Si falla, retorna el texto original */ }
                        }
                    }

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