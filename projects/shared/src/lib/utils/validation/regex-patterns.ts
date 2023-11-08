export const regex = {
  lastName: `^[a-zA-Z]+(([\\'\\,\\.\\- ][a-zA-Z ])?[a-zA-Z]*)*$`,
  firstName: `^[a-zA-Z]+(([\\'\\- ][a-zA-Z ])?[a-zA-Z]*)*$`,
  password: `^[!@#\\$%\\^&\\*\\(\\)_\\+<>~\\?A-Za-z\\d ]+$`,
  email: `^[\\w\\-\\+\\'\\&\\*]+(?:\\.[\\w\\-\\'\\_\\+\\&\\*]+)*@(?:[\\w-]+\\.)+[a-zA-Z]{2,7}$`,
  // username: `^[!@\\$\\^&\\*\\(\\)_~\\?A-Za-z\\d \\.]+$`,
  username: `^([A-Za-z0-9]+[A-Za-z0-9 @.#!$^&*_']*[A-Za-z0-9]+|[A-Za-z0-9])$`,
  questionAnswer: `^[!@\\$\\^&\\*\\(\\)_~\\?A-Za-z\\d \\.]+$`,
  address1: `^[a-zA-Z0-9]+([a-zA-Z0-9\\'\\,\\.\\-\\# ])*$`,
  address2: `^[a-zA-Z0-9]+([a-zA-Z0-9\\'\\,\\.\\-\\# ])*$`,
  pin: `^[0-9A-Za-z]*$`,
  notPin: `[^0-9A-Za-z]`,
  name: `^[A-Za-z ,.''-]+$`,
  city: `^[A-Za-z]+([a-zA-Z0-9\\s\\'.\\-\\/])*[A-Za-z0-9]+$`,
  state: `^(AE|AL|AK|AP|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|` +
    `ME|MH|MD|MA|MI|MN|MS|MO|MP|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY)$`,
  middleInitial: `^[A-Za-z]$`,
  // phoneNumber: '^\\d{10}$',
  phoneNumber: '^[2-9]\\d{10}$|([2-9]\\d{2}([-]?)\\d{3}([-]?)\\d{4})$',
  zipCode: `^\\d{5}(-\\d{4})?$`,
  noRandomCharacters1: `^([^<>\\"'])*$`,
  noRandomCharacters2: `^([^~&^_|\\\\])*$`,
  alphaNumericWithRandomCharacters: `^[a-zA-Z0-9-' ]*$`,
  alphaWithRandomCharacters: `^[A-Za-z-./' ]*$`,
  ssn: '^\\d{4}$',
  directEmailAddress: '^[0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*$',
  directEmailAddress2: '^[^\\.-].*[^\\.-]$',
  physicianName: `^([A-Za-z]+[A-Za-z' ]*[A-Za-z]+|[A-Za-z])$`,
  messageText: `^(?:[a-zA-Z0-9][a-zA-Z0-9 @.#!|%+=~;"<>/'-_(){}&$]*)?$`,
  confirmationCode: `^[0-9]*$`
};