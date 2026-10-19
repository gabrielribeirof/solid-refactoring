class Customer {
  constructor(id, name, email, phone, type, address) {
    if (!email || !email.includes("@")) {
      throw new Error("E-mail do cliente invalido.");
    }

    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#phone = phone;
    this.#type = type;
    this.#address = address;
  }

  #id;
  #name;
  #email;
  #phone;
  #type;
  #address;

  getName() {
    return this.#name;
  }

  getId() {
    return this.#id;
  }

  getEmail() {
    return this.#email;
  }

  getType() {
    return this.#type;
  }

  changeType(type) {
    this.#type = type;
  }

  getRegion() {
    return this.#address.getRegion();
  }

  getLocation() {
    return this.#address.getLocation();
  }

  getCity() {
    return this.#address.getCity();
  }

  getState() {
    return this.#address.getState();
  }
}

module.exports = Customer;
