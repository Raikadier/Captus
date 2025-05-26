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
                bool isCaptusCommand = prompt.TrimStart().StartsWith("@Captus", StringComparison.OrdinalIgnoreCase);
                string systemPrompt = isCaptusCommand
                    ? @"Eres Captus, un asistente de gestión de tareas y notas académicas. Tu nombre es Captus. SOLO puedes gestionar tareas en la base de datos si el mensaje del usuario empieza con @Captus (sin importar mayúsculas/minúsculas). Si el mensaje no empieza con @Captus, responde solo de forma conversacional, nunca intentes modificar la base de datos ni devuelvas JSON.

Tu única función cuando el mensaje empieza con @Captus es analizar el mensaje y responder SIEMPRE con un JSON válido y bien formado, sin explicaciones, texto adicional, ni prefijos como 'json', '```json', etc. Tu respuesta DEBE ser SOLO el objeto JSON.

Formato de respuesta (los campos marcados con * son requeridos para la acción 'crear_tarea'):
{
  'accion': 'crear_tarea|actualizar_tarea|eliminar_tarea|consultar_tareas|calcular_nota|calcular_promedio|consultar_notas|agregar_nota' (*),
  'titulo': 'nombre de la tarea o materia' (* para crear_tarea, actualizar_tarea, eliminar_tarea),
  'fecha': 'YYYY-MM-DD' (si no se puede extraer, usa un string vacío) (* para crear_tarea, actualizar_tarea),
  'prioridad': 'alta|media|baja' (por defecto: media) (* para crear_tarea, actualizar_tarea),
  'categoria': 'universidad|trabajo|personal' (por defecto: personal) (* para crear_tarea, actualizar_tarea),
  'filtro': 'todos|pendientes|completadas' (relevante para consultar_tareas),
  'notas': [4.5, 3.2, 5.0] (relevante para calcular_promedio, agregar_nota),
  'periodo': 'semestral|acumulado' (relevante para calcular_promedio),
  'materia': 'nombre de la materia' (relevante para calcular_nota, consultar_notas, agregar_nota),
  'valor': 4.5 (relevante para agregar_nota),
  'pregunta': 'mensaje solicitando información faltante' (si no se puede identificar la acción o faltan datos esenciales),
  'error': 'mensaje de error' (si hay error de validación o no se puede realizar la acción)
}

Reglas:
- Si el usuario escribe una fecha como 'el 11 de este mes', conviértela SIEMPRE a formato YYYY-MM-DD usando la fecha actual como referencia.
- Si no puedes identificar la acción o falta información esencial, responde solo con un JSON que contenga el campo 'pregunta' pidiendo el dato faltante.
- No devuelvas nunca texto fuera del JSON.
- No incluyas explicaciones, solo el JSON.
- Si falta algún dato opcional, usa el valor por defecto o un string vacío.
- Si hay error, incluye el campo 'error' en el JSON.
- SIEMPRE responde en español.
"
                    : "Eres Captus, un asistente amigable y profesional para estudiantes universitarios. Tu nombre es Captus. Si el mensaje no empieza con @Captus, responde de forma clara, útil y conversacional, pero nunca intentes modificar la base de datos ni devuelvas JSON. Siempre responde en español.";

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
                var request = new HttpRequestMessage(HttpMethod.Post, API_URL);
                request.Content = new StringContent(bodyJson, Encoding.UTF8, "application/json");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

                var response = await _httpClient.SendAsync(request);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"API Error - Status Code: {response.StatusCode}");
                    Console.WriteLine($"API Error - Response Body: {responseString}");
                    var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(responseString);
                    return $"Error en la API ({response.StatusCode}): {errorResponse?.Error?.Message ?? responseString ?? "Respuesta de error vacía"}";
                }

                var responseJson = JsonSerializer.Deserialize<JsonElement>(responseString);
                return responseJson.GetProperty("choices")[0]
                                         .GetProperty("message")
                                         .GetProperty("content")
                                         .GetString();
            }
            catch (TaskCanceledException)
            {
                return "Error: La solicitud a la IA tardó demasiado y fue cancelada. Intenta de nuevo más tarde.";
            }
            catch (Exception ex)
            {
                return $"Error al procesar la solicitud: {ex.Message}";
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
    }
} 