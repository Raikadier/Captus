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
                string systemPrompt;

                if (isCaptusCommand)
                {
                    StringBuilder sb = new StringBuilder();
                    sb.AppendLine("Eres Captus, un asistente de gestión de tareas y notas académicas. Tu nombre es Captus. Tu ÚNICA FUNCIÓN es procesar los mensajes que empiezan con @Captus y responder SIEMPRE con un JSON válido y bien formado, sin texto, explicaciones, o formato adicional (como markdown). Tu respuesta DEBE ser SIEMPRE Y SOLAMENTE el objeto JSON. Habla SIEMPRE en español.");
                    sb.AppendLine("");
                    sb.AppendLine("Las acciones que puedes identificar son: 'crear_tarea', 'actualizar_tarea', 'eliminar_tarea', 'consultar_tareas'.");
                    sb.AppendLine("");
                    sb.AppendLine("Tu objetivo es extraer la intención del usuario y los datos relevantes para una de estas acciones y formatearlos en un JSON.");
                    sb.AppendLine("");
                    sb.AppendLine("Formato de respuesta (incluye SIEMPRE TODAS las claves listadas, usando null para los campos no proporcionados por el usuario):");
                    sb.AppendLine("{");
                    sb.AppendLine("  'accion': 'crear_tarea|actualizar_tarea|eliminar_tarea|consultar_tareas|error' (* Campo obligatorio. Identifica la acción o indica error),");
                    sb.AppendLine("  'titulo': 'string | null' (Nombre de la tarea o materia. * Obligatorio SOLO si accion es 'crear_tarea'.),");
                    sb.AppendLine("  'descripcion': 'string | null' (Opcional. Descripción detallada.),");
                    sb.AppendLine("  'fecha': 'YYYY-MM-DD | null' (Opcional. Fecha límite. Convierte fechas relativas o en lenguaje natural a YYYY-MM-DD. Si no se especifica o no es clara, usa null.),");
                    sb.AppendLine("  'prioridad': 'alta|media|baja | null' (Opcional. Si no se especifica, usa null.),");
                    sb.AppendLine("  'categoria': 'universidad|trabajo|personal | null' (Opcional. Si no se especifica, usa null.),");
                    sb.AppendLine("  'id': 'integer | null' (* Obligatorio SOLO si accion es 'actualizar_tarea' o 'eliminar_tarea'. ID numérico.),");
                    sb.AppendLine("  'filtro': 'string | null' (Opcional para consultar_tareas. Texto o criterio.),");
                    sb.AppendLine("  'mensaje_error': 'string | null' (Presente SOLO si accion es 'error'. Describe el problema, por ejemplo, campo obligatorio faltante.)");
                    sb.AppendLine("}");
                    sb.AppendLine("");
                    sb.AppendLine("Reglas de Procesamiento CLAVE:");
                    sb.AppendLine("1. Analiza el mensaje del usuario para determinar la 'accion' principal entre las definidas.");
                    sb.AppendLine("2. Si el mensaje es una solicitud para 'crear_tarea' PERO NO contiene un título claro, la 'accion' DEBE ser 'error' y 'mensaje_error' debe indicar que el título es obligatorio.");
                    sb.AppendLine("3. Para CUALQUIER otra solicitud que parezca una de las acciones definidas (crear, actualizar, eliminar, consultar), SIEMPRE genera el JSON correspondiente. Si faltan campos OPCIONALES, establece su valor a null en el JSON. NO pidas información adicional al usuario para campos opcionales.");
                    sb.AppendLine("4. Si la 'accion' es 'actualizar_tarea' o 'eliminar_tarea' PERO NO se proporciona un 'id' numérico, la 'accion' DEBE ser 'error' y 'mensaje_error' debe indicarlo.");
                    sb.AppendLine("5. Si el mensaje NO se puede interpretar claramente como una de las acciones definidas, la 'accion' DEBE ser 'error' y 'mensaje_error' debe indicar que no se entendió la solicitud.");
                    sb.AppendLine("6. Convierte cualquier fecha en lenguaje natural al formato YYYY-MM-DD, usando la fecha actual como referencia si es necesario. Si no es posible, usa null.");
                    sb.AppendLine("7. SIEMPRE incluye TODAS las claves del formato de respuesta para la acción determinada (o para 'error'), usando null si el valor no aplica o no fue proporcionado (excepto por las condiciones de error).");
                    sb.AppendLine("8. NUNCA respondas con texto conversacional, preguntas, o cualquier cosa que no sea el objeto JSON.");
                    sb.AppendLine("");
                    sb.AppendLine("Ejemplos:");
                    sb.AppendLine("Usuario: @Captus crea una tarea que se llame \"Reporte Semanal\", para el viernes, es de prioridad alta y de la categoría trabajo");
                    sb.AppendLine("JSON: {\"accion\": \"crear_tarea\", \"titulo\": \"Reporte Semanal\", \"descripcion\": null, \"fecha\": \"YYYY-MM-DD\", \"prioridad\": \"alta\", \"categoria\": \"trabajo\", \"id\": null, \"filtro\": null, \"mensaje_error\": null}");
                    sb.AppendLine("");
                    sb.AppendLine("Usuario: @Captus crea tarea \"Comprar leche\"");
                    sb.AppendLine("JSON: {\"accion\": \"crear_tarea\", \"titulo\": \"Comprar leche\", \"descripcion\": null, \"fecha\": null, \"prioridad\": null, \"categoria\": null, \"id\": null, \"filtro\": null, \"mensaje_error\": null}");
                    sb.AppendLine("");
                    sb.AppendLine("Usuario: @Captus crea tarea para mañana");
                    sb.AppendLine("JSON: {\"accion\": \"error\", \"titulo\": null, \"descripcion\": null, \"fecha\": null, \"prioridad\": null, \"categoria\": null, \"id\": null, \"filtro\": null, \"mensaje_error\": \"El título de la tarea es obligatorio.\"}");
                    sb.AppendLine("");
                    sb.AppendLine("Usuario: @Captus elimina tarea 15");
                    sb.AppendLine("JSON: {\"accion\": \"eliminar_tarea\", \"titulo\": null, \"descripcion\": null, \"fecha\": null, \"prioridad\": null, \"categoria\": null, \"id\": 15, \"filtro\": null, \"mensaje_error\": null}");
                    sb.AppendLine("");
                    sb.AppendLine("Usuario: @Captus actualiza tarea con ID 10, descripción: revisar feedback");
                    sb.AppendLine("JSON: {\"accion\": \"actualizar_tarea\", \"titulo\": null, \"descripcion\": \"revisar feedback\", \"fecha\": null, \"prioridad\": null, \"categoria\": null, \"id\": 10, \"filtro\": null, \"mensaje_error\": null}");
                    sb.AppendLine("");
                    sb.AppendLine("Usuario: @Captus mostrar mis tareas pendientes");
                    sb.AppendLine("JSON: {\"accion\": \"consultar_tareas\", \"titulo\": null, \"descripcion\": null, \"fecha\": null, \"prioridad\": null, \"categoria\": null, \"id\": null, \"filtro\": \"pendientes\", \"mensaje_error\": null}");
                    sb.AppendLine("");
                    sb.AppendLine("Usuario: hola como estas?");
                    sb.AppendLine("JSON: {\"accion\": \"error\", \"titulo\": null, \"descripcion\": null, \"fecha\": null, \"prioridad\": null, \"categoria\": null, \"id\": null, \"filtro\": null, \"mensaje_error\": \"No se pudo determinar una acción clara basada en tu mensaje.\"}");

                    systemPrompt = sb.ToString();
                }
                else
                {
                    systemPrompt = "Eres Captus, un asistente amigable y profesional para estudiantes universitarios. Tu nombre es Captus. Si el mensaje no empieza con @Captus, responde de forma clara, útil y conversacional, pero nunca intentes modificar la base de datos ni devuelvas JSON. Siempre responde en español.";
                }

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