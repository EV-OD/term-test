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

function countSpaces(inputString: string) {
  // Using a regular expression to match spaces and then counting the matches
  const spaceMatches = inputString.match(/ /g);
  return spaceMatches ? spaceMatches.length : 0;
}

function autoComplete(
  command: string,
  cmdStructure: CommandStructure,
  depth = 0,
  spaceCount = 0
): { name: string; id: string; isNameAndCommandSame: boolean; type: string }[] {
  spaceCount = spaceCount ? spaceCount : countSpaces(command);
  if (command.length === 0) {
    // let keys = Object.keys(cmdStructure);
    // let arry = [];
    // for (let i = 0; i < keys.length; i++) {
    //   arry.push(arry.push({ ...cmdStructure[keys[i]], name: keys[i] }));
    // }
    if (depth != spaceCount) {
      return [];
    }
  }
  const commandParts = command.split(/\s+/).filter(Boolean);
  const currentCommand = commandParts[0];
  const remainingInput = commandParts.slice(1).join(" ");
  const matchingCommands = Object.keys(cmdStructure).filter((cmd) =>
    cmd.startsWith(currentCommand)
  );
  if (matchingCommands.length === 1 && matchingCommands[0] == currentCommand) {
    const subCommand = cmdStructure[matchingCommands[0]];

    if (!subCommand.args) {
      // If there are no subcommands or no remaining input, return available subcommands
      const availableSubcommands = Object.keys(subCommand.args || {})
        .filter(
          (arg) =>
            !subCommand.args[arg].isComplete && arg.includes(remainingInput)
        )
        .map((arg) => ({
          name: arg,
          id: matchingCommands[0],
          isNameAndCommandSame:
            subCommand.args[arg].isNameAndCommandSame || false,
          type: subCommand.args[arg].type,
          depth,
          spaceCount,
        }));
      return availableSubcommands;
    } else {
      // Recursively traverse into subcommands
      // if (spaceCount == depth + 1) {
      //   const subCommand = cmdStructure[matchingCommands[0]].args;
      //   let keys = Object.keys(subCommand);
      //   let arry = [];
      //   for (let i = 0; i < keys.length; i++) {
      //     arry.push({
      //       ...subCommand[keys[i]],
      //       name: keys[i],
      //       spaceCount,
      //       depth: depth,
      //     });
      //   }
      //   return arry;
      // }
      return autoComplete(
        remainingInput,
        subCommand.args,
        depth + 1,
        spaceCount
      );
    }
  } else if (matchingCommands.length > 0) {
    // If there are multiple matching commands, return the matching commands themselves
    return matchingCommands.map((cmd) => ({
      name: cmd,
      id: cmd,
      isNameAndCommandSame: true,
      type: cmdStructure[cmd].type,
      depth,
      spaceCount,
    }));
  } else {
    // If the command is not found, return an empty array
    return [];
  }
}

function splitStringIntoArrayWithSpaces(inputString: string): string[] {
  // Split the string into words and include spaces in the array
  const splitArray = inputString
    .split(/\s+/)
    .flatMap((word, index, array) =>
      index < array.length - 1 ? [word, " "] : [word]
    );
  return splitArray;
}

export { autoComplete, splitStringIntoArrayWithSpaces };
