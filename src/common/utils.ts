import { parsePhoneNumber } from 'awesome-phonenumber';

export const camelToSnakeCase = (str: string) => {
  return (
    str[0].toLowerCase() +
    str.slice(1).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  );
};

export function isNullOrUndefined(obj: any) {
  if (typeof obj === 'undefined' || obj === null) return true;
  return false;
}

export function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return json;
  }
}

export function getPhoneE164(
  phone: string,
  regionCode = 'VN',
): string | undefined {
  const phoneNumber = parsePhoneNumber(phone, { regionCode });

  return phoneNumber.possible ? phoneNumber.number.e164 : undefined;
}
