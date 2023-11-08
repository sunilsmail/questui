import { PhoneFaxPipe } from './phone-fax.pipe';

describe('PhonePipe', () => {
  let phonePipe: PhoneFaxPipe;

  beforeEach(() => {
    phonePipe = new PhoneFaxPipe();
  });

  it('create an instance', () => {
    expect(phonePipe).toBeTruthy();
  });

  it('should return value if value is null', () => {
    expect(phonePipe.transform(null)).toBeNull();
  });

  it('should return value if value is not expected 10 characters', () => {
    expect(phonePipe.transform('234123345')).toEqual('234123345');
  });

  it('should return formatted 10-digit phone number as XXX-XXX-XXXX', () => {
    expect(phonePipe.transform('2341233456')).toEqual('(234)123-3456');
  });
});
