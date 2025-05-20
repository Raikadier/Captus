using System;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using System.Text.RegularExpressions;


namespace BLL
{
    public class ChatBot
    {
        TelegramBotClient botCliente;
        private Dictionary<long, bool> saludoRecibido = new Dictionary<long, bool>();
        public ChatBot()
        {
            botCliente = new TelegramBotClient("8108210163:AAEtTFo7zlBpmBKg56orj38WS2dTd8djeX4");
        }

        public async Task StartReceiver()
        {
            var token = new CancellationTokenSource();
            var cancelToken = token.Token;
            var receiverOptions = new ReceiverOptions
            {
                AllowedUpdates = { } // Recibe todos los tipos de mensajes
            };

            await botCliente.ReceiveAsync(OnMessage, ErrorMessage, receiverOptions, cancelToken);
        }


        public async Task OnMessage(ITelegramBotClient botClient, Update update, CancellationToken cancelToken)
        {
            if (update.Message == null || update.Message.Type != MessageType.Text)
                return;

            var texto = update.Message.Text?.ToLower().Trim();
            var chatId = update.Message.Chat.Id;

            Console.WriteLine("Texto recibido: " + texto); // Para depuración

            // --- HOLA ---
            if (texto == "hola")
            {
                var hora = DateTime.Now.Hour;
                string saludo;

                if (hora >= 6 && hora < 12)
                    saludo = "¡Buenos días";
                else if (hora >= 12 && hora < 20)
                    saludo = "¡Buenas tardes";
                else
                    saludo = "¡Buenas noches";

                if (saludoRecibido.ContainsKey(chatId) && saludoRecibido[chatId])
                {
                    await botClient.SendTextMessageAsync(
                        chatId: chatId,
                        text: $"{saludo} de nuevo! ¿Aún estabas por aquí? 😊",
                        cancellationToken: cancelToken
                    );
                }
                else
                {
                    saludoRecibido[chatId] = true;
                    await botClient.SendTextMessageAsync(
                        chatId: chatId,
                        text: $"{saludo}! ¿En qué puedo ayudarte? 🌞",
                        cancellationToken: cancelToken
                    );
                }

                return;
            }

            // --- DESPEDIDAS ---
            if (texto.Contains("chao") || texto.Contains("adiós") || texto.Contains("adios") || texto.Contains("hasta luego"))
            {
                await botClient.SendTextMessageAsync(
                    chatId: chatId,
                    text: "¡Hasta luego! 😊 Que tengas un gran día. Si necesitás algo, acá estaré.",
                    cancellationToken: cancelToken
                );
                return;
            }


            if (texto.Contains("necesito estudiar") && texto.Contains("tengo"))
            {
                try
                {
                    // 1. Extraer la materia
                    string materia = "la materia";
                    var matchMateria = Regex.Match(texto, @"estudiar\s+(.*?)\s+y\s+tengo");
                    if (matchMateria.Success)
                        materia = matchMateria.Groups[1].Value.Trim();

                    // 2. Extraer cantidad de tiempo y unidad (días, semanas, meses)
                    int diasDisponibles = 0;
                    var matchTiempo = Regex.Match(texto, @"tengo\s+(\d+)\s+(día|días|semana|semanas|mes|meses)", RegexOptions.IgnoreCase);
                    if (matchTiempo.Success)
                    {
                        int cantidad = int.Parse(matchTiempo.Groups[1].Value);
                        string unidad = matchTiempo.Groups[2].Value.ToLower();

                        switch (unidad)
                        {
                            case "día":
                            case "días":
                                diasDisponibles = cantidad;
                                break;
                            case "semana":
                            case "semanas":
                                diasDisponibles = cantidad * 7;
                                break;
                            case "mes":
                            case "meses":
                                diasDisponibles = cantidad * 30;
                                break;
                        }
                    }

                    if (diasDisponibles == 0)
                    {
                        await botClient.SendTextMessageAsync(
                            chatId: update.Message.Chat.Id,
                            text: "No pude entender cuántos días tenés. Escribí algo como: *Necesito estudiar física y tengo 5 días*.",
                            parseMode: ParseMode.Markdown,
                            cancellationToken: cancelToken
                        );
                        return;
                    }

                    // 3. Estimar plan de estudio
                    int horasTotales = diasDisponibles <= 3 ? 12 :
                                       diasDisponibles <= 7 ? 20 :
                                       diasDisponibles <= 14 ? 30 : 40;

                    int horasDiarias = Math.Max(1, horasTotales / diasDisponibles);

                    // 4. Armar el mensaje de respuesta
                    string respuesta = $"📘 *Plan de estudio para {materia}*\n";
                    respuesta += $"Tienes {diasDisponibles} días. Estudiarás aproximadamente {horasDiarias} hora(s) por día:\n\n";

                    for (int i = 1; i <= Math.Min(diasDisponibles, 7); i++) // Muestra solo los primeros 7 días
                    {
                        respuesta += $"📅 Día {i}:\n";
                        if (horasDiarias >= 3)
                        {
                            respuesta += "• 9:00 - 10:30 → Teoría\n";
                            respuesta += "• 11:00 - 12:00 → Ejercicios\n";
                            if (horasDiarias >= 4)
                                respuesta += "• 17:00 - 18:00 → Revisión\n";
                        }
                        else
                        {
                            respuesta += $"• 9:00 - 10:00 → Estudio general\n";
                        }
                        respuesta += "\n";
                    }

                    if (diasDisponibles > 7)
                        respuesta += $"📝 ... y así sucesivamente durante los {diasDisponibles} días.";

                    await botClient.SendTextMessageAsync(
                        chatId: update.Message.Chat.Id,
                        text: respuesta,
                        parseMode: ParseMode.Markdown,
                        cancellationToken: cancelToken
                    );
                }
                catch (Exception ex)
                {
                    await botClient.SendTextMessageAsync(
                        chatId: update.Message.Chat.Id,
                        text: "Hubo un problema al generar el plan. Asegurate de escribir algo como:\n\n*Necesito estudiar álgebra y tengo 2 semanas*.",
                        parseMode: ParseMode.Markdown,
                        cancellationToken: cancelToken
                    );
                }
            }



            // --- GRACIAS ---
            if (texto.Contains("gracias"))
            {
                await botClient.SendTextMessageAsync(
                    chatId: chatId,
                    text: "¡De nada! 😊 Siempre estoy aquí para ayudarte.",
                    cancellationToken: cancelToken
                );
                return;
            }

            

            // --- RESPUESTA POR DEFECTO ---
            await botClient.SendTextMessageAsync(
                chatId: chatId,
                text: "No entendí eso 🤔. Podés escribirme: 'hola', 'organiza mi día', 'necesito estudiar...', o 'gracias'.",
                cancellationToken: cancelToken
            );
        }

        private Task ErrorMessage(ITelegramBotClient client, Exception exception, CancellationToken token)
        {
            Console.WriteLine($"Error en bot: {exception.Message}");
            return Task.CompletedTask;
        }
    }
}
