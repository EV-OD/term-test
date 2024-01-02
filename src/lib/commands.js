export let commands = {
  git: {
    id: uuid(),
    isComplete: false,
    type: "git",
    args: {
      commit: {
        id: uuid(),
        type: "commit",
        isNameAndCommandSame: true,
        isComplete: false,
      },
      add: {
        id: uuid(),
        type: "add",
        isComplete: false,
        isNameAndCommandSame: true,
        args: {
          file: {
            id: uuid(),
            type: "file",
            isNameAndCommandSame: false,
            isComplete: false,
          },
        },
      },
      push: {
        id: uuid(),
        type: "push",
        isComplete: false,
        isNameAndCommandSame: true,
      },
      branch: {
        id: uuid(),
        type: "branch",
        isComplete: false,
        isNameAndCommandSame: true,
      },
    },
  },
  gh: {
    id: uuid(),
    isComplete: false,
    type: "gh",
    args: {
      pr: {
        id: uuid(),
        type: "pr",
        isNameAndCommandSame: true,
        isComplete: false,
      },
      issue: {
        id: uuid(),
        type: "issue",
        isNameAndCommandSame: true,
        isComplete: false,
      },
    },
  },
  npm: {
    id: uuid(),
    isComplete: false,
    type: "npm",
    args: {
      install: {
        id: uuid(),
        type: "install",
        isNameAndCommandSame: true,
        isComplete: false,
      },
      uninstall: {
        id: uuid(),
        type: "uninstall",
        isNameAndCommandSame: true,
        isComplete: false,
      },
      init: {
        id: uuid(),
        type: "init",
        isNameAndCommandSame: true,
        isComplete: false,
      },
    },
  },
};

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
