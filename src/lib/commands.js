export let commands = {
  git: {
    isComplete: false,
    type: "git",
    args: {
      commit: {
        type: "commit",
        isNameAndCommandSame: true,
        isComplete: false,
      },
      add: {
        type: "add",
        isComplete: false,
        isNameAndCommandSame: true,
        args: {
          file: {
            type: "file",
            isNameAndCommandSame: false,
            isComplete: false,
          },
        },
      },
    },
  },
};
