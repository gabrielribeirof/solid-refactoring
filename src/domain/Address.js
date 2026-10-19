class Address {
  constructor(street, number, city, state, zipCode, region) {
    this.#street = street;
    this.#number = number;
    this.#city = city;
    this.#state = state;
    this.#zipCode = zipCode;
    this.#region = region;
  }

  #street;
  #number;
  #city;
  #state;
  #zipCode;
  #region;

  getRegion() {
    return this.#region;
  }

  getLocation() {
    return `${this.#city}/${this.#state}`;
  }

  getCity() {
    return this.#city;
  }

  getState() {
    return this.#state;
  }
}

module.exports = Address;
