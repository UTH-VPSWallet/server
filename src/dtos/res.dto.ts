export class Res {
  Status: number = 0;
  Message: string = '';
}
export class ResData<T> extends Res { Data!: T }