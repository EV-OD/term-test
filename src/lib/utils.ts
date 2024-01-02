interface CommandStructure {
  [key: string]: {
    isComplete: boolean;
    type: string;
    args?: {
      [key: string]: {
        type: string;
        isComplete: boolean;
        isNameAndCommandSame?: boolean;
        args?: {
          [key: string]: {
            type: string;
            isNameAndCommandSame: boolean;
            isComplete: boolean;
          };
        };
      };
    };
  };
}

function autoComplete(
  command: string,
  cmdStructure: CommandStructure
): string[] {
  const commandParts = command.trim().split(/\s+/).filter(Boolean);
  const currentCommand = commandParts[0];
  const remainingInput = commandParts.slice(1).join(" ");
  const matchingCommands = Object.keys(cmdStructure).filter((cmd) =>
    cmd.startsWith(currentCommand)
  );
  if (matchingCommands.length === 1 && matchingCommands[0] == currentCommand) {
    const subCommand = cmdStructure[matchingCommands[0]];

    if (!subCommand.args || remainingInput.length === 0) {
      // If there are no subcommands or no remaining input, return available subcommands
      const availableSubcommands = Object.keys(subCommand.args || {}).filter(
        (arg) =>
          !subCommand.args[arg].isComplete && arg.includes(remainingInput)
      );
      return availableSubcommands;
    } else {
      // Recursively traverse into subcommands
      return autoComplete(remainingInput, subCommand.args);
    }
  } else if (matchingCommands.length > 0) {
    // If there are multiple matching commands, return the matching commands themselves
    return matchingCommands;
  } else {
    // If the command is not found, return an empty array
    return [];
  }
}

export { autoComplete };
