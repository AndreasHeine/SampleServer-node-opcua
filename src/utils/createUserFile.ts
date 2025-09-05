import { UserFile } from "./userfile";

export function createUserFile(): void {
  const userFile = new UserFile();

  userFile.addUser({
    username: "admin",
    password: "pw1",
    roles: "Supervisor;ConfigureAdmin;SecurityAdmin",
  });
  userFile.addUser({
    username: "operator",
    password: "pw2",
    roles: "Operator;ConfigureAdmin",
  });
  userFile.addUser({
    username: "guest",
    password: "pw3",
    roles: "AuthenticatedUser",
  });

  userFile.createUserFile("user.json");
}
