using System;

namespace ENTITY
{
    public interface ICommand
    {
        string Execute(string input);
        bool Matches(string input);
    }

    public class Command : ICommand
    {
        public string Name { get; }
        public string Description { get; }
        public string Pattern { get; }
        public Action<string> Handler { get; }

        public Command(string name, string description, string pattern, Action<string> handler)
        {
            Name = name;
            Description = description;
            Pattern = pattern;
            Handler = handler;
        }

        public string Execute(string input)
        {
            try
            {
                Handler(input);
                return $"Comando '{Name}' ejecutado correctamente.";
            }
            catch (Exception ex)
            {
                return $"Error al ejecutar el comando: {ex.Message}";
            }
        }

        public bool Matches(string input)
        {
            return System.Text.RegularExpressions.Regex.IsMatch(input, Pattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        }

        public string GetDescription() => Description;
    }
} 