using System;

namespace ENTITY
{
    public class Command
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Pattern { get; set; }
        public Action<string> Handler { get; set; }
        public bool RequiresCaptus { get; set; }

        public Command(string name, string description, string pattern, Action<string> handler, bool requiresCaptus = true)
        {
            Name = name;
            Description = description;
            Pattern = pattern;
            Handler = handler;
            RequiresCaptus = requiresCaptus;
        }
    }
} 