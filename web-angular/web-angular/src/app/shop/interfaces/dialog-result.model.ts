export class DialogResult<T> {
    data: T;
    event: EventEnum;
}

export enum EventEnum {
    ADD = 'add',
    EDIT = 'edit',
    DELETE = 'delete',
}
