// src/components/base/view.ts (Базовый класс)

import { EventEmitter } from './events';

export abstract class View<T> {
    protected container: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement | string, events: EventEmitter) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) as HTMLElement
            : container;
        this.events = events;
    }

    abstract render(data?: Partial<T>): HTMLElement;

    protected setDisabled(element: HTMLElement, state: boolean) {
        element.toggleAttribute('disabled', state);
    }
}