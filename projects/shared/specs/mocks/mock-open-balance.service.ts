import { of, Observable } from 'rxjs';
import { OpenBalanceApiResponse } from 'shared/models/open-balance';

export const openBalanceresponse: OpenBalanceApiResponse = {
  'responseCode': '200',
  'searchARResponse': {
    'respCode': '000',
    'serviceDenialErrMsg': 'SERVICE DENIAL ELIGIBLE                 ',
    'message': '',
    'lastKeyData': '',
    'endPoint': '001',
    'resp2': '00000000',
    'totalMinDue': '+1086.00',
    'serviceDenialEligible': 'Y',
    'originalTotalMinDue': '+01521.61',
    'resp': '00000000',
    'moreData': 'N',
    'totalPendingPaymentAmount': 435.61,
    'originalServiceDenialEligible': 'Y',
    'totalOverDue': 1521.61,
    'aritem': [
      {
        'patientName': {
          'midInit': '',
          'lastName': 'CRUZ',
          'firstName': 'DORY'
        },
        'lastDate': {
          'year': '',
          'month': '',
          'day': ''
        },
        'billedDate': {
          'year': '2013',
          'month': '03',
          'day': '13'
        },
        'dob': {
          'year': '',
          'month': '',
          'day': ''
        },
        'address': {
          'state': '',
          'city': '',
          'zip': '',
          'addr1': '',
          'addr2': '',
          'attn': ''
        },
        'amountDue': '+01521.61',
        'legalEnt': 'TAM',
        'fileStatus': 'C',
        'billStatus': 'PAST DUE',
        'clientNbr': '00121196',
        'labNbr': '0005679',
        'billNbr': '8481983211',
        'accessionNbr': '',
        'billedAmt': '+01521.61',
        'insShortName': 'CIGNA OOD',
        'formCode': '9DD',
        'insId': 'U0340700402',
        'searchMethod': 'OpenAR',
        'searchType': '',
        'searchConfidence': '',
        'lastRejCd': '16',
        'followupType': '06',
        'followupCode': '1',
        'adjCd': '',
        'pendingPaymentAmount': '435.61',
        'dateOfService': {
          'year': '2020',
          'month': '05',
          'day': '04'
        },
        'physicianName': 'DUNN,MICHAEL E',
        'billType': '6'
      }
    ]
  },
  'token': '328ba0a7-1bf2-4798-b332-b9a8d8b72249',
  'responseMessage': 'Ok'
};

export class MockOpenBalanceService {

  getOpenBalances(): Observable<OpenBalanceApiResponse> {
    return of(openBalanceresponse);
  }

  getOBResponse(): Observable<OpenBalanceApiResponse> {
    return of(openBalanceresponse);
  }
}
