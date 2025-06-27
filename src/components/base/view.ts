import { EventEmitter } from './events';

export abstract class View<T> {
    protected container: HTMLElement;
    protected events: EventEmitter;
    protected _data: T;

    constructor(container: HTMLElement, events: EventEmitter) {
        this.container = container;
        this.events = events;
    }

    abstract render(data?: T): HTMLElement;

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (state) {
            element.setAttribute('disabled', 'disabled');
        } else {
            element.removeAttribute('disabled');
        }
    }
}