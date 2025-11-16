export default class User {
  constructor({
    id_User = null,
    name,
    userName,
    password,
    lastName,
    email,
    phone,
  }) {
    this.id_User = id_User;
    this.name = name;
    this.userName = userName;
    this.password = password;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }
}
