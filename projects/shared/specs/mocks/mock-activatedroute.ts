
import { BehaviorSubject, Observable } from 'rxjs';

export class MockActivatedRoute {
  snapshot = { data: null };

  private paramMapSubject = new BehaviorSubject(new Map());
  paramMap = this.paramMapSubject.asObservable();
  private queryParamsSubject = new BehaviorSubject({});
  queryParams = this.queryParamsSubject.asObservable();
  private queryParamMapSubject = new BehaviorSubject(new Map());
  queryParamMap: Observable<any> = this.queryParamMapSubject.asObservable();
  private fragmentSubject = new BehaviorSubject('');
  fragment = this.fragmentSubject.asObservable();
  private dataSubject = new BehaviorSubject('');
  data = this.dataSubject.asObservable();

  setParamMap(key, value) {
    const map = this.paramMapSubject.value;
    this.paramMapSubject.next(map.set(key, value));
  }

  setQueryParam(key, value) {
    const oldValue = this.queryParamsSubject.value;
    const newValue = { ...oldValue };
    newValue[key] = value;
    this.queryParamsSubject.next(newValue);
  }

  setQueryParamMap(key, value) {
    const map = this.queryParamMapSubject.value;
    this.queryParamMapSubject.next(map.set(key, value));
  }

  setFragment(fragment) {
    this.fragmentSubject.next(fragment);
  }
  setData(value) {
    this.dataSubject.next(value);
  }
  setSnapshotData(value) {
    this.snapshot.data = value;
  }
}
